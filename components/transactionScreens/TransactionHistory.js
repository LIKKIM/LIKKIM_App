import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { initialAdditionalCryptos } from "../../config/cryptosData"; // 修改为实际路径
import { CHAIN_NAMES } from "../../config/chainConfig";
import { CryptoContext, DarkModeContext, usdtCrypto } from "../CryptoContext";
const TransactionHistory = ({
  TransactionsScreenStyle,
  t,
  transactionHistory,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedChainShortName, setSelectedChainShortName] =
    useState(CHAIN_NAMES);
  const [selectedChain, setSelectedChain] = useState("All");
  const { isDarkMode } = useContext(DarkModeContext);
  const [isChainSelectionModalVisible, setChainSelectionModalVisible] =
    useState(false);
  /*   const chainFilteredCards = cryptoCards.filter((card) =>
    selectedChainShortName.includes(card?.chainShortName)
  ); */

  return (
    <View style={TransactionsScreenStyle.historyContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          marginBottom: 10,
          width: "100%",
        }}
      >
        <Text
          style={[
            TransactionsScreenStyle.historyTitle,
            { position: "relative", left: 0, top: 0 },
          ]}
        >
          {t("Transaction History")}
        </Text>
        <TouchableOpacity
          onPress={() => setChainSelectionModalVisible(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {selectedChain === "All" ? (
            <Image
              source={require("../../assets/WalletScreenLogo.png")}
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: 12,
              }}
            />
          ) : (
            cryptoCards.length > 0 &&
            (() => {
              const uniqueChainIcons = new Set();
              return cryptoCards
                .filter((card) => {
                  if (
                    selectedChain === card.chainShortName &&
                    card.chainIcon &&
                    !uniqueChainIcons.has(card.chainShortName)
                  ) {
                    uniqueChainIcons.add(card.chainShortName);
                    return true;
                  }
                  return false;
                })
                .map((card, index) => (
                  <Image
                    key={`${card.chainShortName}-${index}`}
                    source={card.chainIcon}
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: 12,
                    }}
                  />
                ));
            })()
          )}
          <Text style={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
            {selectedChain === "All"
              ? t("All Chains")
              : cryptoCards.find(
                  (card) => card.chainShortName === selectedChain
                )?.chain}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        style={{ flex: 1, width: "100%" }}
      >
        {transactionHistory.length === 0 ? (
          <Text style={TransactionsScreenStyle.noHistoryText}>
            {t("No Histories")}
          </Text>
        ) : (
          transactionHistory.map((transaction, index) => {
            // 使用 toLowerCase() 和 trim() 统一格式
            // 如果数据中的 address 为占位符，则不参与地址匹配，而是用 symbol 来匹配
            const matchedItems = initialAdditionalCryptos.filter((item) => {
              if (item.address.trim() === "Click the Verify Address Button") {
                // 当地址为占位符时，使用 shortName 和交易 symbol 进行匹配
                return (
                  item.shortName.trim().toLowerCase() ===
                  transaction.symbol.trim().toLowerCase()
                );
              }
              // 否则使用地址匹配
              return (
                item.address.trim().toLowerCase() ===
                transaction.address.trim().toLowerCase()
              );
            });

            console.log(
              `Transaction ${index} - address: ${transaction.address}`
            );
            console.log("Matched Items:", matchedItems);

            // 如果匹配成功，取第一个匹配项的 chainIcon
            const chainIcon =
              matchedItems.length > 0 ? matchedItems[0].chainIcon : null;
            if (chainIcon) {
              console.log("Chain Icon found:", chainIcon);
            } else {
              console.log("No Chain Icon found");
            }

            // 在匹配项中查找 shortName 与交易 symbol 匹配的项（忽略大小写）
            const cryptoItem = matchedItems.find(
              (item) =>
                item.shortName.trim().toUpperCase() ===
                transaction.symbol.trim().toUpperCase()
            );
            const cryptoIcon = cryptoItem ? cryptoItem.icon : null;
            if (cryptoIcon) {
              console.log("Crypto Icon found:", cryptoIcon);
            } else {
              console.log(
                "No Crypto Icon found for symbol:",
                transaction.symbol
              );
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTransaction(transaction)}
              >
                <View
                  style={[
                    {
                      backgroundColor:
                        transaction.state.toLowerCase() === "success"
                          ? "rgba(71, 180, 128, 0.05)"
                          : "rgba(210, 70, 75, 0.05)",
                      borderLeftWidth: 3,
                      borderLeftColor:
                        transaction.state.toLowerCase() === "success"
                          ? "#47B480"
                          : "#D2464B",
                      marginVertical: 4,
                      padding: 10,
                    },
                  ]}
                >
                  <Text style={TransactionsScreenStyle.historyItemText}>
                    {`${new Date(
                      Number(transaction.transactionTime)
                    ).toLocaleString()}`}
                  </Text>
                  {/* 外层容器，左右排列 */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* 左侧：图片组合 */}
                    <View
                      style={{ position: "relative", width: 50, height: 50 }}
                    >
                      {["cardIconContainer", "cardChainIconContainer"].map(
                        (_, i) => (
                          <View
                            key={i}
                            style={
                              i === 0
                                ? {
                                    // 数字货币图标容器
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: 42,
                                    height: 42,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 21,
                                    backgroundColor: "#ffffff50",
                                    overflow: "hidden",
                                  }
                                : {
                                    // 链图标容器
                                    position: "absolute",
                                    top: 26,
                                    left: 28,
                                    width: 16,
                                    height: 16,
                                    borderWidth: 1,
                                    borderColor: "#ffffff80",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 15,
                                    backgroundColor: "#ffffff80",
                                    overflow: "hidden",
                                  }
                            }
                          >
                            <Image
                              source={i === 0 ? cryptoIcon : chainIcon}
                              style={
                                i === 0
                                  ? { width: 42, height: 42 }
                                  : { width: 14, height: 14 }
                              }
                              resizeMode="contain"
                            />
                          </View>
                        )
                      )}
                    </View>

                    {/* 右侧：交易详情 */}
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            TransactionsScreenStyle.historyItemText,
                            { fontSize: 16, fontWeight: "bold" },
                          ]}
                        >
                          {transaction.address === transaction.fromAddress
                            ? t("Receive")
                            : t("Send")}
                        </Text>
                        <Text
                          style={[
                            TransactionsScreenStyle.historyItemText,
                            { fontSize: 16, fontWeight: "bold" },
                          ]}
                        >
                          {transaction.amount} {transaction.symbol}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={TransactionsScreenStyle.historyItemText}>
                          <Text
                            style={{
                              color:
                                transaction.state.toLowerCase() === "success"
                                  ? "#47B480"
                                  : "#D2464B",
                            }}
                          >
                            {transaction.state}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
      {/* Modal 显示详细信息 */}
      <Modal
        visible={!!selectedTransaction}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View style={TransactionsScreenStyle.modalContainer}>
          <View
            style={[
              TransactionsScreenStyle.cardContainer,
              { alignItems: "flex-start" },
            ]}
          >
            {selectedTransaction && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text
                    style={[
                      TransactionsScreenStyle.historyItemText,
                      { fontSize: 16, fontWeight: "bold", textAlign: "left" },
                    ]}
                  >
                    {selectedTransaction.address ===
                    selectedTransaction.fromAddress
                      ? t("Send")
                      : t("Receive")}
                    {"  "}
                    <Text
                      style={{
                        color:
                          selectedTransaction.state.toLowerCase() === "success"
                            ? "#47B480"
                            : "#D2464B",
                        fontWeight: "normal",
                      }}
                    >
                      {selectedTransaction.state}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      TransactionsScreenStyle.historyItemText,
                      { fontSize: 16, fontWeight: "bold", textAlign: "right" },
                    ]}
                  >
                    {selectedTransaction.amount} {selectedTransaction.symbol}
                  </Text>
                </View>

                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {`Transaction Time: `}
                  </Text>
                  {`${new Date(
                    Number(selectedTransaction.transactionTime)
                  ).toLocaleString()}`}
                </Text>

                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { lineHeight: 24, textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`From: `}</Text>
                  {selectedTransaction.from}
                </Text>
                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { lineHeight: 24, textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`To: `}</Text>
                  {selectedTransaction.to}
                </Text>
                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { lineHeight: 24, textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {`Transaction hash: `}
                  </Text>
                  {selectedTransaction.txid}
                </Text>
                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`Network Fee: `}</Text>
                  {selectedTransaction.txFee}
                </Text>
                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`Block Height: `}</Text>
                  {selectedTransaction.height}
                </Text>

                <TouchableOpacity
                  onPress={() => setSelectedTransaction(null)}
                  style={{ marginTop: 20, alignSelf: "stretch" }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedTransaction(null)}
                    style={TransactionsScreenStyle.cancelButton}
                  >
                    <Text style={TransactionsScreenStyle.cancelButtonText}>
                      {t("Close")}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TransactionHistory;
