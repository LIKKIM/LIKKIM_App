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
              <View style={TransactionsScreenStyle.historyItem}>
                <View>
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
                        { fontSize: 18, fontWeight: "bold" },
                      ]}
                    >
                      {transaction.address === transaction.fromAddress
                        ? t("Receive")
                        : t("Send")}
                    </Text>
                    <Text
                      style={[
                        TransactionsScreenStyle.historyItemText,
                        { fontSize: 18, fontWeight: "bold" },
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
                            transaction.state === "success"
                              ? "#47B480"
                              : "inherit",
                        }}
                      >
                        {transaction.state}
                      </Text>
                    </Text>
                  </View>
                  <Text style={TransactionsScreenStyle.historyItemText}>
                    <Text style={{ fontWeight: "bold" }}>
                      {`Transaction Time: `}
                    </Text>
                    {`${new Date(
                      Number(transaction.transactionTime)
                    ).toLocaleString()}`}
                  </Text>
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            {selectedTransaction && (
              <>
                {/* 显示列表中上半部分的交易信息 */}
                <View>
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
                        { fontSize: 18, fontWeight: "bold" },
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
                        { fontSize: 18, fontWeight: "bold" },
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
                    <Text style={TransactionsScreenStyle.historyItemText}>
                      <Text
                        style={{
                          color:
                            selectedTransaction.state === "success"
                              ? "#47B480"
                              : "inherit",
                        }}
                      >
                        {selectedTransaction.state}
                      </Text>
                    </Text>
                  </View>
                  <Text style={TransactionsScreenStyle.historyItemText}>
                    <Text style={{ fontWeight: "bold" }}>
                      {`Transaction Time: `}
                    </Text>
                    {`${new Date(
                      Number(selectedTransaction.transactionTime)
                    ).toLocaleString()}`}
                  </Text>
                </View>

                {/* 显示列表中下半部分的详细信息 */}
                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { lineHeight: 24 },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`From: `}</Text>
                  {selectedTransaction.from}
                </Text>
                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { lineHeight: 24 },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`To: `}</Text>
                  {selectedTransaction.to}
                </Text>
                <Text
                  style={[
                    TransactionsScreenStyle.historyItemText,
                    { lineHeight: 24 },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {`Transaction hash: `}
                  </Text>
                  {selectedTransaction.txid}
                </Text>
                <Text style={TransactionsScreenStyle.historyItemText}>
                  <Text style={{ fontWeight: "bold" }}>{`Network Fee: `}</Text>
                  {selectedTransaction.txFee}
                </Text>
                <Text style={TransactionsScreenStyle.historyItemText}>
                  <Text style={{ fontWeight: "bold" }}>{`Block Height: `}</Text>
                  {selectedTransaction.height}
                </Text>

                <TouchableOpacity
                  onPress={() => setSelectedTransaction(null)}
                  style={{ marginTop: 20 }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Close")}
                  </Text>
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
