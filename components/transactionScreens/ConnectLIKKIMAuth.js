import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Platform,
    ActivityIndicator
} from "react-native";
import { useContext, useState } from 'react'
import { CryptoContext, DarkModeContext } from "../CryptoContext";
import TransactionsScreenStyle from "../../styles/TransactionsScreenStyle";
import { useTranslation } from "react-i18next";
import ChangellyAPI from "./ChangellyAPI";
/**
 * 闪兑请求钱包授权
 */
export default function ({

    route, navigation
}) {



    const { t } = useTranslation(); // i18n translation hook

    const { initialAdditionalCryptos, } = useContext(CryptoContext);


    // console.log(route.params)


    // Helper function to get the token details including the icon and name
    const getTokenDetails = (tokenShortName) => {
        return initialAdditionalCryptos.find(
            (token) => token.shortName === tokenShortName
        );
    };


    const toValue = route.params.toValue;
    const fromValue = route.params.fromValue;
    const selectedToToken = route.params.to;
    const selectedFromToken = route.params.from;
    const fromAddress = route.params.fromAddress;
    const toAddress = route.params.toAddress;
    const xrpAddress = '0x111111111';
    const xrpExtraId = '1';
    const dapp = route.params.dapp || 'test';
    const [load, setLoad] = useState(false);

    // Get the selected crypto details for "From" and "To" tokens
    const fromCryptoDetails = getTokenDetails(selectedFromToken);
    const toCryptoDetails = getTokenDetails(selectedToToken);


    //钱包交互完成后回调结果|钱包完成签名后执行
    const authCallBack = async () => {

        try {

            setLoad(true);
            console.warn('提交交易')
            let transactionSendRes = await ChangellyAPI.createTransaction(selectedFromToken, selectedToToken, xrpAddress, xrpExtraId, 'LIKKIM');
            setLoad(false);
            if (transactionSendRes.status) {

                console.warn('交易完成')
                console.warn(transactionSendRes.data);
                alert('交易完成');
                navigation.goBack();
            } else {
                alert('交易失败');
                console.warn('交易失败')
                console.warn(transactionSendRes.msg);
            }


        } catch (e) {

            alert(e instanceof Error ? e.message : JSON.stringify(e));
            setLoad(false);

        }






    }



    return (

        <View style={{ flex: 1, padding: 10, backgroundColor: '#fff' }}>

            {/* Transaction Confirmation Modal */}
            <View style={TransactionsScreenStyle.confirmModalView}>
                {/* 添加国际化标题 */}
                {/* <Text style={TransactionsScreenStyle.modalTitle}>
                    {t("Transaction Confirmation")}
                </Text> */}

                {/* From and To Sections in the same row */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between", // 确保左右两边分布
                        alignItems: "center",
                        width: "90%",
                        marginTop: 6,
                        marginBottom: 16,
                    }}
                >
                    {/* From Section */}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {fromCryptoDetails?.chainIcon && (
                            <Image
                                source={fromCryptoDetails.chainIcon}
                                style={{ width: 24, height: 24, marginRight: 8 }}
                            />
                        )}
                        <Text style={TransactionsScreenStyle.modalTitle}>
                            {`- ${fromCryptoDetails?.name} ${fromValue}`}
                        </Text>
                    </View>

                    {/* To Section */}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {toCryptoDetails?.chainIcon && (
                            <Image
                                source={toCryptoDetails.chainIcon}
                                style={{ width: 24, height: 24, marginRight: 8 }}
                            />
                        )}
                        <Text style={TransactionsScreenStyle.modalTitle}>
                            {`+ ${toCryptoDetails?.name} ${toValue}`}
                        </Text>
                    </View>
                </View>

                <ScrollView
                    style={{ maxHeight: 320 }} // 设置最大高度，当内容超过时启用滚动
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                    {/* 交互地址（至） */}
                    <Text style={TransactionsScreenStyle.transactionText}>
                        <Text style={{ fontWeight: "bold" }}>
                            {t("Interaction Address (To)")}:
                        </Text>
                    </Text>
                    <Text style={TransactionsScreenStyle.transactionText}>
                        {xrpAddress}
                    </Text>

                    {/* 发送地址 */}
                    <Text style={TransactionsScreenStyle.transactionText}>
                        <Text style={{ fontWeight: "bold" }}>
                            {t("Sending Address")}:
                        </Text>
                    </Text>
                    <Text style={TransactionsScreenStyle.transactionText}>
                        {fromAddress}
                    </Text>

                    {/* 接收地址 */}
                    <Text style={TransactionsScreenStyle.transactionText}>
                        <Text style={{ fontWeight: "bold" }}>
                            {t("Receiving Address")}:
                        </Text>
                    </Text>
                    <Text style={TransactionsScreenStyle.transactionText}>
                        {toAddress}
                    </Text>

                    {/* 网络 */}
                    <Text style={TransactionsScreenStyle.transactionText}>
                        <Text style={{ fontWeight: "bold" }}>{t("Network")}:</Text>
                    </Text>
                    <Text style={TransactionsScreenStyle.transactionText}>
                        {` ${fromCryptoDetails?.chain}`}
                    </Text>

                    {/* dApp */}
                    <Text style={TransactionsScreenStyle.transactionText}>
                        <Text style={{ fontWeight: "bold" }}>{t("dApp")}:</Text>
                        {dapp}
                    </Text>

                    {/* 预估网络费用 */}
                    <Text style={TransactionsScreenStyle.transactionText}>
                        <Text style={{ fontWeight: "bold" }}>
                            {t("Estimated Network Fee")}:
                        </Text>
                        {` ${fromCryptoDetails?.fee}`}
                    </Text>
                </ScrollView>

                <View
                    style={{ marginTop: 20, width: "100%", alignItems: "center", flexDirection: 'row' }}
                >
                    {/* 确认交易按钮 */}
                    <TouchableOpacity
                        style={{ width: '48%', margin: '1%', backgroundColor: '#000', padding: 12, borderRadius: 8 }}
                        onPress={async () => {


                            console.warn('检查设备，链接后发送至钱包，等待结果。');
                            authCallBack();

                            return;
                            try {
                                const response = await fetch(
                                    "https://bt.likkim.com/meridian/address/queryBlockList",
                                    {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            chainShortName: fromCryptoDetails?.chain,
                                        }),
                                    }
                                );
                                const data = await response.json();

                                if (data.code === "0" && Array.isArray(data.data)) {
                                    const block = data.data[0].blockList[0];
                                    const { hash, height, blockTime } = block;

                                    // 执行签名
                                    //假设已完成签署认证
                                    // await signTransaction(
                                    //     verifiedDevices,
                                    //     hash,
                                    //     height,
                                    //     blockTime,
                                    //     fromValue,
                                    //     toCryptoDetails?.address
                                    // );

                                    console.warn('检查设备，链接后发送至钱包，等待结果。');
                                    authCallBack();

                                }

                                // setConfirmModalVisible(false);
                            } catch (error) {
                                console.error("确认交易时出错:", error);
                            }
                        }}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 600, }}>
                            {t("Confirm")}
                        </Text>
                    </TouchableOpacity>

                    {/* 取消按钮 */}
                    <TouchableOpacity
                        style={{ width: '48%', margin: '1%', backgroundColor: 'gray', padding: 12, borderRadius: 8 }}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{ color: '#000', fontWeight: 600, textAlign: 'center' }}>
                            {t("Cancel")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>


            {

                load && <ActivityIndicator />
            }





        </View>
    )



}