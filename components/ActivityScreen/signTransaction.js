import { Buffer } from "buffer";
import { accountAPI, signAPI } from "../../env/apiEndpoints";
import { chainGroups, families } from "../../config/mappingRegistry";
import assetOps from "../../config/assetOps";
import { bluetoothConfig } from "../../env/bluetoothConfig";
import { initialAdditionalCryptos } from "../../config/assetInfo";

// BLE 常量
const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;
/**
 * 签名函数 signTransaction
 * @param {Object} device - 蓝牙设备对象
 * @param {string|number} amount - 交易金额
 * @param {string} paymentAddress - 支付地址
 * @param {string} inputAddress - 输入地址
 * @param {string} selectedQueryChainName - 选中的链名称
 * @param {string} contractAddress - 合约地址
 * @param {string} selectedFeeTab - 费用标签，"Recommended" 或其他
 * @param {string} recommendedFee - 推荐费用
 * @param {string} rapidFeeValue - 快速费用
 * @param {function} setModalStatus - 设置模态框状态的函数
 * @param {function} t - 国际化翻译函数
 * @param {function} monitorSignedResult - 监听签名结果函数，需传入 device
 * @returns {Promise<Object|undefined>} 返回签名请求的响应数据
 */
const signTransaction = async (
  device,
  amount,
  paymentAddress,
  inputAddress,
  selectedQueryChainName,
  contractAddress,
  selectedFeeTab,
  recommendedFee,
  rapidFeeValue,
  setModalStatus,
  t,
  monitorSignedResult,
  monitorSubscription
) => {
  try {
    if (!device?.isConnected) {
      console.log("设备无效");
      return;
    }

    // 连接设备并发现服务
    await device.connect();
    await device.discoverAllServicesAndCharacteristics();

    // ---------------------------
    // 第1步：确定币种对应的链标识和支付路径 （使用以太坊的签名方法）
    // ---------------------------

    const chainKey = selectedQueryChainName?.toLowerCase();

    if (!chainKey || !assetOps[chainKey]) {
      console.log(`不支持的路径: ${chainKey}`);
      return;
    }

    const path = assetOps[chainKey];
    console.log("选择的路径:", path);

    // ---------------------------
    // 第2步：构造并发送第一步交易信息给设备
    // ---------------------------
    const senderAddress = paymentAddress;
    const receiveAddress = inputAddress;
    // 交易费用依赖外部变量：selectedFeeTab、recommendedFee、rapidFeeValue
    const transactionFee =
      selectedFeeTab === "Recommended" ? recommendedFee : rapidFeeValue;
    const firstTradeMsg = `destinationAddress:${senderAddress},${receiveAddress},${amount},${chainKey}`;
    // 交易金额也传给嵌入式设备
    console.log("交易金额:", amount);
    console.log("第一步交易信息发送:", firstTradeMsg);
    const firstTradeBuffer = Buffer.from(firstTradeMsg, "utf-8");
    const firstTradeBase64 = firstTradeBuffer.toString("base64");

    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        firstTradeBase64
      );
      console.log("第一步交易信息已成功发送给设备");
    } catch (error) {
      console.log("发送第一步交易信息给设备时发生错误:", error);
    }

    // ---------------------------
    // 第3步：持续监听嵌入式设备的 "Signed_OK" 命令
    // ---------------------------

    console.log("等待设备发送 Signed_OK 命令...");
    const signedOkPromise = new Promise((resolve) => {
      let isResolved = false;
      monitorSubscription.current = device.monitorCharacteristicForService(
        serviceUUID,
        notifyCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.log("监听 Signed_OK 时出错:", error.message);
            return;
          }
          // 对接收到的字符串进行 trim 处理
          const received = Buffer.from(characteristic.value, "base64")
            .toString("utf8")
            .trim();
          console.log("收到设备响应:", received);
          if (received === "Signed_OK" && !isResolved) {
            isResolved = true;
            monitorSubscription.current?.remove();
            // 更新 modalStatus 状态，表示设备已确认签名
            setModalStatus({
              title: t("Device Confirmed"),
              subtitle: t(
                "The device has confirmed the transaction signature."
              ),
              image: require("../../assets/gif/Pending.gif"),
            });
            resolve(); // resolve 这个 Promise
          }
        }
      );
    });
    await signedOkPromise;
    console.log("设备确认回复: Signed_OK");
    // ---------------------------
    // 第4步：为了获得下一步请求预签名数据的参数向服务器获取 nonce 和 gasPrice 等参数，真正开启签名流程
    // ---------------------------
    let postChain = selectedQueryChainName;
    for (const [defaultChain, chains] of Object.entries(chainGroups)) {
      if (chains.includes(selectedQueryChainName)) {
        postChain = defaultChain;
        break;
      }
    }

    const postData = {
      chain: postChain,
      from: paymentAddress, // ← 建议用 "from" 替换 "address"，如果接口要求一致
      to: inputAddress,
      txAmount: String(amount),
      extJson: {
        // protocol: "1", // 可选是否注释
      },
    };

    // 打印 POST 内容
    console.log("准备发送 getSignParam 请求:");
    console.log("POST 请求详情：", {
      url: accountAPI.getSignParam,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData,
    });

    // 发起请求
    const walletParamsResponse = await fetch(accountAPI.getSignParam, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    // 打印 fetch 返回的 Response 对象
    console.log("walletParamsResponse:", walletParamsResponse);

    if (!walletParamsResponse.ok) {
      console.log("获取 nonce 和 gasPrice 失败:", walletParamsResponse.status);
      return;
    }
    // ---------------------------
    // 处理返回的结果
    // ---------------------------
    const walletParamsData = await walletParamsResponse.json();
    console.log("请求预签名数据 Param 的返回数据:", walletParamsData);
    // ✅ 在这里提前定义变量，供下面用
    let gasPrice,
      nonce,
      gasLimit,
      sequence,
      utxoList,
      maxGasAmount,
      typeArg,
      blockHash,
      suiObjects,
      epoch,
      accountNumber,
      effectiveFeeAmount,
      heigh,
      gasPriceValue; // 提前声明 gasPriceValue

    if (
      !walletParamsData.data?.gasPrice ||
      walletParamsData.data?.nonce == null
    ) {
      console.log("接口返回数据不完整:", walletParamsData);
      return;
    }

    if (postChain === "ethereum") {
      const { gasPrice, nonce } = walletParamsData.data;
      gasPriceValue = gasPrice.normal;
      console.log("Ethereum 返回的数据:", { gasPrice: gasPriceValue, nonce });
    } else if (postChain === "bitcoin") {
      const { gasPrice, nonce, utxoList } = walletParamsData.data;

      console.log("bitcoin 返回的数据:", {
        gasPrice,
        nonce,
        utxoList,
      });
    } else if (postChain === "aptos") {
      const { gasPrice, nonce, sequence, maxGasAmount, typeArg } =
        walletParamsData.data;
      console.log("Aptos 返回的数据:", {
        gasPrice,
        nonce,
        sequence,
        maxGasAmount,
        typeArg,
      });
    } else if (postChain === "cosmos") {
      const {
        gasPrice,
        nonce,
        heigh,
        sequence,
        maxGasAmount,
        accountNumber,
        feeAmount,
      } = walletParamsData.data;
      const effectiveFeeAmount = feeAmount ? feeAmount : 3000;
      console.log("cosmos 返回的数据:", {
        gasPrice,
        nonce,
        sequence,
        maxGasAmount,
        accountNumber,
        feeAmount: effectiveFeeAmount,
      });
    }
    if (postChain === "solana") {
      const { gasPrice, nonce, blockHash } = walletParamsData.data;
      console.log("solana 返回的数据:", { gasPrice, nonce, blockHash });
    } else if (postChain === "sui") {
      const { gasPrice, nonce, maxGasAmount, suiObjects, epoch } =
        walletParamsData.data;

      console.log("提取的 sui 数据:", {
        gasPrice,
        nonce,
        maxGasAmount,
        suiObjects,
        epoch,
      });
    } else if (postChain === "ripple") {
      const { gasPrice, nonce } = walletParamsData.data;
      console.log("ripple 返回的数据:", { gasPrice, nonce });
    } else {
      const { gasPrice, nonce, sequence } = walletParamsData.data;
      console.log("其他链返回的数据:", { gasPrice, nonce, sequence });
    }

    // ---------------------------
    // 第5步 向服务器 POST 并获得预签名数据
    // ---------------------------
    const getChainMappingMethod = (chainKey) => {
      if (families.evm.includes(chainKey)) return "evm";
      if (families.btc.includes(chainKey)) return "btc";
      if (families.tron.includes(chainKey)) return "tron";
      if (families.aptos.includes(chainKey)) return "aptos";
      if (families.cosmos.includes(chainKey)) return "cosmos";
      if (families.sol.includes(chainKey)) return "solana";
      if (families.sui.includes(chainKey)) return "sui";
      if (families.xrp.includes(chainKey)) return "ripple";
      if (families.doge.includes(chainKey)) return "doge";
      return null;
    };

    const chainMethod = getChainMappingMethod(chainKey);
    let requestData = null;

    // 查找当前链的 publicKey
    // 如果 initialAdditionalCryptos 中有多个 queryChainName 相同的币种，getPublicKeyByChain 只会返回第一个匹配项的 publicKey（即 find 方法的行为）。如需特殊处理可改为返回全部或指定条件的 publicKey
    const getPublicKeyByChain = (chainKey) => {
      const crypto = initialAdditionalCryptos.find(
        (item) => item.queryChainName?.toLowerCase() === chainKey
      );
      return crypto?.publicKey || "";
    };

    if (chainMethod === "evm") {
      // evm:  构造待签名hex请求数据（例如 Ethereum）
      // gasPriceValue 需在 ethereum 分支提前定义
      requestData = {
        chainKey: chainKey,
        nonce: Number(nonce),
        gasLimit: 53000,
        gasPrice: Number(gasPriceValue),
        value: Number(amount),
        to: inputAddress,
        contractAddress: "",
        contractValue: 0,
      };
    } else if (chainMethod === "btc") {
      // btc:  构造待签名hex请求数据（比特币）
      requestData = {
        chainKey: "bitcoin",
        inputs: utxoList,
        feeRate: gasPrice,
        receiveAddress: inputAddress,
        receiveAmount: Number(amount),
        changeAddress: paymentAddress,
      };
    } else if (chainMethod === "tron") {
      // tron:  构造待签名hex请求数据（波场）
      requestData = {
        chainKey,
        value: Number(amount),
        to: inputAddress,
        contractAddress: "",
      };
    } else if (chainMethod === "aptos") {
      // aptos:  构造待签名hex请求数据（Aptos 链）
      requestData = {
        from: paymentAddress,
        sequenceNumber: sequence,
        maxGasAmount: maxGasAmount,
        gasUnitPrice: gasPrice,
        receiveAddress: inputAddress,
        receiveAmount: Number(amount),
        typeArg: typeArg,
        expiration: 600,
      };
    } else if (chainMethod === "cosmos") {
      // cosmos:  构造待签名hex请求数据（Cosmos 链）
      requestData = {
        from: paymentAddress,
        to: inputAddress,
        amount: Number(amount),
        sequence: sequence,
        chainKey: "cosmos",
        accountNumber: accountNumber,
        feeAmount: effectiveFeeAmount,
        gasLimit: maxGasAmount,
        memo: "", //这个是备注
        timeoutHeight: heigh,
        publicKey: getPublicKeyByChain(chainKey),
      };
    } else if (chainMethod === "solana") {
      // solana:  构造待签名hex请求数据（Solana 链）
      requestData = {
        from: paymentAddress,
        to: inputAddress,
        hash: blockHash,
        mint: contractAddress,
        amount: Number(amount) * 1000000000,
      };
    } else if (chainMethod === "sui") {
      // sui:  构造待签名hex请求数据（Sui 链）
      requestData = {
        objects: suiObjects,
        from: paymentAddress,
        to: inputAddress,
        amount: Number(amount),
        gasPrice: gasPrice,
        gasBudget: maxGasAmount,
        epoch: epoch,
      };
    } else if (chainMethod === "ripple") {
      // ripple:  构造待签名hex请求数据（Ripple）
      requestData = {
        from: paymentAddress,
        to: inputAddress,
        amount: Number(amount),
        fee: gasPrice,
        sequence: sequence,
        publicKey: getPublicKeyByChain(chainKey),
      };
    }
    console.log(
      " 构造待签名hex请求数据:",
      JSON.stringify(requestData, null, 2)
    );
    // 根据链类型选择对应的签名接口
    let signApiUrl = null;
    switch (chainMethod) {
      case "evm":
        signApiUrl = signAPI.encode_evm;
        break;
      case "btc":
        signApiUrl = signAPI.encode_btc;
        break;
      case "aptos":
        signApiUrl = signAPI.encode_aptos;
        break;
      case "cosmos":
        signApiUrl = signAPI.encode_cosmos;
        break;
      case "solana":
        signApiUrl = signAPI.encode_solana;
        break;
      case "sui":
        signApiUrl = signAPI.encode_sui;
        break;
      case "ripple":
        signApiUrl = signAPI.encode_xrp;
        break;
      default:
        signApiUrl = signAPI.encode_evm;
    }
    const response = await fetch(signApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();
    console.log("交易请求返回的预签名数据:", responseData);

    monitorSignedResult(device);

    // ---------------------------
    // 第6步：构造并发送预签名数据 sign 数据（发送presign数据）
    // ---------------------------
    if (responseData?.data?.data) {
      const signMessage = `sign:${chainKey},${path},${responseData.data.data}`;
      console.log("构造的 sign 消息:", signMessage);
      const signBuffer = Buffer.from(signMessage, "utf-8");
      const signBase64 = signBuffer.toString("base64");
      try {
        await device.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          signBase64
        );
        console.log("sign消息已成功发送给设备");
      } catch (error) {
        console.log("发送sign消息时发生错误:", error);
      }
    } else {
      console.log("返回的数据不包含sign消息的data_从服务器获得");
    }

    return responseData;
  } catch (error) {
    console.log("处理交易失败:", error.message || error);
  }
};

export default signTransaction;
