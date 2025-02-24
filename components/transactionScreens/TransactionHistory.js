// TransactionHistory.js
import React from "react";
import { View, Text, ScrollView } from "react-native";

const TransactionHistory = ({
  TransactionsScreenStyle,
  t,
  transactionHistory,
}) => {
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
            <View key={index} style={TransactionsScreenStyle.historyItem}>
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
                      ? t("Send")
                      : t("Receive")}
                  </Text>

                  <Text
                    style={[
                      TransactionsScreenStyle.historyItemText,
                      { fontSize: 18, fontWeight: "bold" },
                    ]}
                  >
                    {transaction.amount} {`${transaction.symbol}`}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={TransactionsScreenStyle.historyItemText}>
                    <Text style={{ fontWeight: "bold" }}>{`State: `}</Text>
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
                  <Text
                    style={{ fontWeight: "bold" }}
                  >{`Transaction Time: `}</Text>
                  {`${new Date(
                    Number(transaction.transactionTime)
                  ).toLocaleString()}`}
                </Text>
              </View>

              <Text
                style={[
                  TransactionsScreenStyle.historyItemText,
                  { lineHeight: 24 },
                ]}
              >
                <Text style={{ fontWeight: "bold" }}>{`From: `}</Text>
                {transaction.from}
              </Text>
              <Text
                style={[
                  TransactionsScreenStyle.historyItemText,
                  { lineHeight: 24 },
                ]}
              >
                <Text style={{ fontWeight: "bold" }}>{`To: `}</Text>
                {transaction.to}
              </Text>

              <Text
                style={[
                  TransactionsScreenStyle.historyItemText,
                  { lineHeight: 24 },
                ]}
              >
                <Text
                  style={{ fontWeight: "bold" }}
                >{`Transaction hash: `}</Text>
                {transaction.txid}
              </Text>

              <Text style={TransactionsScreenStyle.historyItemText}>
                <Text style={{ fontWeight: "bold" }}>{`Network Fee: `}</Text>
                {transaction.txFee}
              </Text>

              <Text style={TransactionsScreenStyle.historyItemText}>
                <Text style={{ fontWeight: "bold" }}>{`Block Height: `}</Text>
                {transaction.height}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default TransactionHistory;
