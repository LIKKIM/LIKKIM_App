import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { initialAdditionalCryptos } from "../../config/cryptosData"; // 修改为实际路径

const TransactionHistory = ({
  TransactionsScreenStyle,
  t,
  transactionHistory,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  return (
    <View style={TransactionsScreenStyle.historyContainer}>
      <Text style={TransactionsScreenStyle.historyTitle}>
        {t("Transaction History")}
      </Text>
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
                    TransactionsScreenStyle.historyItem,
                    {
                      backgroundColor:
                        transaction.state.toLowerCase() === "success"
                          ? "rgba(71, 180, 128, 0.05)" // 绿色，透明度 0.05
                          : "rgba(210, 70, 75, 0.05)", // 红色，透明度 0.05
                      borderLeftWidth: 3,
                      borderLeftColor:
                        transaction.state.toLowerCase() === "success"
                          ? "#47B480"
                          : "#D2464B",
                    },
                  ]}
                >
                  {/* 显示两个图片 */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Image
                      source={chainIcon}
                      style={{
                        width: 14,
                        height: 14,
                      }}
                      resizeMode="contain"
                    />
                    <Image
                      source={cryptoIcon}
                      style={{
                        width: 42,
                        height: 42,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                  <View>
                    <Text style={TransactionsScreenStyle.historyItemText}>
                      {`${new Date(
                        Number(transaction.transactionTime)
                      ).toLocaleString()}`}
                    </Text>
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
