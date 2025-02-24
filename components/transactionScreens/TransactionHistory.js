import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";

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
          transactionHistory.map((transaction, index) => (
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
                        ? "rgba(71, 180, 128, 0.05)" // 绿色，透明度 0.3
                        : "rgba(210, 70, 75, 0.05)", // 红色，透明度 0.3
                    borderLeftWidth: 3, // 设置左边框宽度
                    borderLeftColor:
                      transaction.state.toLowerCase() === "success"
                        ? "#47B480" // 绿色
                        : "#D2464B", // 红色
                  },
                ]}
              >
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
          ))
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
                {/* 显示交易概要信息 */}
                <View style={{ width: "100%" }}>
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
                        { fontSize: 16, fontWeight: "bold", textAlign: "left" },
                      ]}
                    >
                      {selectedTransaction.address ===
                      selectedTransaction.fromAddress
                        ? t("Send")
                        : t("Receive")}
                    </Text>
                    <Text
                      style={[
                        TransactionsScreenStyle.historyItemText,
                        { fontSize: 16, fontWeight: "bold", textAlign: "left" },
                      ]}
                    >
                      {selectedTransaction.amount} {selectedTransaction.symbol}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        TransactionsScreenStyle.historyItemText,
                        { textAlign: "left" },
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            selectedTransaction.state.toLowerCase() ===
                            "success"
                              ? "#47B480"
                              : "#D2464B",
                        }}
                      >
                        {selectedTransaction.state}
                      </Text>
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
                </View>

                {/* 显示交易详细信息 */}
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
