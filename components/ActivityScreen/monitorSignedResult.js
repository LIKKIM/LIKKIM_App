import { Buffer } from "buffer";
import { bluetoothConfig } from "../../env/bluetoothConfig";
import { accountAPI } from "../../env/apiEndpoints";

// BLE 常量
const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;

/**
 * 监听签名结果
 * @param {Object} params - 参数对象
 * @param {Object} params.device - BLE设备对象
 * @param {Function} params.setModalStatus - 设置模态框状态的函数
 * @param {Function} params.t - 国际化翻译函数
 * @param {Function} params.reconnectDevice - 重连设备函数
 * @param {String} params.selectedAddress - 选中的地址
 * @param {Object} params.monitorSubscription - 监听订阅引用
 * @param {Function} params.proceedToNextStep - 继续下一步的函数（可选）
 * @returns {Object} 监听订阅对象
 */
const createMonitorSignedResult = ({
  setModalStatus,
  t,
  reconnectDevice,
  selectedAddress,
  monitorSubscription,
  proceedToNextStep,
}) => {
  return (device) => {
    monitorSubscription.current = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        // ---- 错误处理完整展开 ----
        if (error) {
          if (
            error.message &&
            error.message.includes("Operation was cancelled")
          ) {
            console.log("监听操作被取消，正在重新连接...");
            reconnectDevice(device); // 主动重连逻辑
          } else if (
            error.message &&
            error.message.includes("Unknown error occurred")
          ) {
            console.log("未知错误，可能是一个Bug:", error.message);
            if (error.reason) {
              console.log("错误原因:", error.reason);
            }
            reconnectDevice(device); // 主动重连逻辑
          } else {
            console.log("监听设备响应时出错:", error.message);
          }
          return; // 出现错误时终止本次回调
        }

        // ---- BLE 数据解码 ----
        const receivedData = Buffer.from(
          characteristic.value,
          "base64"
        ).toString("utf8");
        console.log("接收到的数据:", receivedData);

        // ---- 处理 PIN 校验命令 ----
        if (receivedData === "PIN_SIGN_READY") {
          setModalStatus({
            title: t("Waiting for approval on your device...."),
            subtitle: t("Waiting for approval on your device..."),
            image: require("../../assets/gif/Pending.gif"),
          });
          // 继续后续签名流程（如请求链参数、发送 presign 等）
          proceedToNextStep && proceedToNextStep();
        } else if (receivedData === "PIN_SIGN_FAIL") {
          setModalStatus({
            title: t("Password Incorrect"),
            subtitle: t(
              "The PIN code you entered is incorrect. Transaction has been terminated."
            ),
            image: require("../../assets/gif/Fail.gif"),
          });
          // 不自动关闭，等待用户手动关闭Modal
        } else if (receivedData === "PIN_SIGN_CANCEL") {
          setModalStatus({
            title: t("Password Cancelled"),
            subtitle: t(
              "Password entry cancelled by user. Transaction has been terminated."
            ),
            image: require("../../assets/gif/Fail.gif"),
          });
          // 不自动关闭，等待用户手动关闭Modal
        } else if (receivedData.startsWith("signResult:")) {
          // ---- 处理签名数据完整流程 ----
          // 提取 signed_data 内容
          const signedData = receivedData.split("signResult:")[1];
          const [chain, hex] = signedData.split(",");
          // 构造广播交易的数据
          const postData = {
            chain: chain.trim(), // 去掉可能的空格
            hex: hex.trim(), // 在签名前加上 0x，并去掉空格
            address: selectedAddress,
          };
          // 打印对象
          console.log("准备发送的 POST 数据:", postData);
          // 输出: 准备发送的 POST 数据: { chain: "ethereum", hex: "F86C..." }

          // 调用广播交易的 API
          try {
            const response = await fetch(accountAPI.broadcastHex, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(postData),
            });

            const responseData = await response.json();
            // 根据返回的 code 字段判断广播是否成功
            if (response.ok && responseData.code === "0") {
              console.log("交易广播成功:", responseData);
              // 向嵌入式返回 BCAST_OK
              try {
                const msg = Buffer.from("BCAST_OK\r\n", "utf-8").toString(
                  "base64"
                );
                await device.writeCharacteristicWithResponseForService(
                  serviceUUID,
                  writeCharacteristicUUID,
                  msg
                );
                console.log("已向嵌入式发送 BCAST_OK");
              } catch (err) {
                console.log("发送 BCAST_OK 时出错:", err);
              }
              // 从响应中获取交易哈希
              const txHash = responseData.data;
              setModalStatus({
                title: t("Transaction Successful"),
                subtitle: t(
                  "Your transaction was successfully broadcasted on the LUKKEY device."
                ),
                image: require("../../assets/gif/Success.gif"),
                txHash: txHash, // 添加交易哈希到 modalStatus
              });
            } else {
              console.log("交易广播失败:", responseData);
              // 向嵌入式返回 BCAST_FAIL
              try {
                const msg = Buffer.from("BCAST_FAIL\r\n", "utf-8").toString(
                  "base64"
                );
                await device.writeCharacteristicWithResponseForService(
                  serviceUUID,
                  writeCharacteristicUUID,
                  msg
                );
                console.log("已向嵌入式发送 BCAST_FAIL");
              } catch (err) {
                console.log("发送 BCAST_FAIL 时出错:", err);
              }
              setModalStatus({
                title: t("Transaction Failed"),
                subtitle: t(
                  "The transaction broadcast failed. Please check your device and try again."
                ),
                image: require("../../assets/gif/Fail.gif"),
              });
            }
          } catch (broadcastError) {
            console.log("交易广播时出错:", broadcastError.message);
            // 向嵌入式返回 BCAST_FAIL
            try {
              const msg = Buffer.from("BCAST_FAIL\r\n", "utf-8").toString(
                "base64"
              );
              await device.writeCharacteristicWithResponseForService(
                serviceUUID,
                writeCharacteristicUUID,
                msg
              );
              console.log("已向嵌入式发送 BCAST_FAIL");
            } catch (err) {
              console.log("发送 BCAST_FAIL 时出错:", err);
            }
            setModalStatus({
              title: t("Transaction Error"),
              subtitle: t(
                "An error occurred while broadcasting the transaction."
              ),
              image: require("../../assets/gif/Fail.gif"),
            });
          }
        } else {
          // ---- 未知数据完整打印 ----
          console.log("签名结果收到未知数据:", receivedData);
        }
      }
    );

    return monitorSubscription.current;
  };
};

export default createMonitorSignedResult;
