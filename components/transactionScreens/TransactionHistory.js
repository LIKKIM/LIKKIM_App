import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  RefreshControl,
} from "react-native";
import { initialAdditionalCryptos } from "../../config/cryptosData"; // 修改为实际路径
import { CHAIN_NAMES } from "../../config/chainConfig";
import { CryptoContext, DarkModeContext, usdtCrypto } from "../CryptoContext";
import ChainSelectionModal from "../modal/ChainSelectionModal"; // 导入 ChainSelectionModal
import TransactionChainFilterModal from "../modal/TransactionChainFilterModal";

const TransactionHistory = ({
  TransactionsScreenStyle,
  t,
  transactionHistory,
  isLoading,
  cryptoCards,
  refreshing,
  onRefresh,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedChain, setSelectedChain] = useState("All");
  const { isDarkMode } = useContext(DarkModeContext);
  const [isChainFilterModalVisible, setChainFilterModalVisible] =
    useState(false);

  // 根据 transactionHistory 计算每笔交易对应的链卡片
  const transactionChainCards = useMemo(() => {
    const map = new Map();
    transactionHistory.forEach((tx) => {
      const matchedItems = initialAdditionalCryptos.filter((item) => {
        if (item.address.trim() === "Click the Verify Address Button") {
          return (
            item.shortName.trim().toLowerCase() ===
            tx.symbol.trim().toLowerCase()
          );
        }
        return (
          item.address.trim().toLowerCase() === tx.address.trim().toLowerCase()
        );
      });
      if (matchedItems.length > 0) {
        const card = matchedItems[0];
        if (!map.has(card.chainShortName)) {
          map.set(card.chainShortName, card);
        }
      }
    });
    return Array.from(map.values());
  }, [transactionHistory]);

  // 筛选出符合当前选择链的交易记录，剔除 amount 为 0 的交易记录
  const filteredTransactionHistory =
    selectedChain === "All"
      ? transactionHistory.filter((tx) => tx.amount > 0) // Filter out transactions with amount 0
      : transactionHistory.filter((transaction) => {
          const matchedItems = initialAdditionalCryptos.filter((item) => {
            if (item.address.trim() === "Click the Verify Address Button") {
              return (
                item.shortName.trim().toLowerCase() ===
                transaction.symbol.trim().toLowerCase()
              );
            }
            return (
              item.address.trim().toLowerCase() ===
              transaction.address.trim().toLowerCase()
            );
          });
          if (matchedItems.length > 0) {
            return (
              matchedItems[0].chainShortName === selectedChain &&
              transaction.amount > 0 // Filter out amount 0
            );
          }
          return false;
        });

  const shouldDisplayChainFilterModal = filteredTransactionHistory.length > 0;

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
          onPress={() =>
            shouldDisplayChainFilterModal && setChainFilterModalVisible(true)
          }
          style={{ flexDirection: "row", alignItems: "center" }}
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
            transactionChainCards.length > 0 &&
            transactionChainCards
              .filter((card) => card.chainShortName === selectedChain)
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
              ))
          )}
          <Text style={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
            {selectedChain === "All"
              ? t("All Chains")
              : transactionChainCards.find(
                  (card) => card.chainShortName === selectedChain
                )?.chain}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent:
            transactionHistory.length === 0 ||
            cryptoCards.length === 0 ||
            isLoading
              ? "center"
              : "flex-start",
        }}
        style={{ flex: 1, width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={TransactionsScreenStyle.loadingText}>
              {t("Loading...")}
            </Text>
          </View>
        ) : filteredTransactionHistory.length === 0 ||
          cryptoCards.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={TransactionsScreenStyle.noHistoryText}>
              {t("No Histories")}
            </Text>
          </View>
        ) : (
          cryptoCards.length > 0 &&
          filteredTransactionHistory.map((transaction, index) => {
            const matchedItems = initialAdditionalCryptos.filter((item) => {
              if (item.address.trim() === "Click the Verify Address Button") {
                return (
                  item.shortName.trim().toLowerCase() ===
                  transaction.symbol.trim().toLowerCase()
                );
              }
              return (
                item.address.trim().toLowerCase() ===
                transaction.address.trim().toLowerCase()
              );
            });

            const chainIcon =
              matchedItems.length > 0 ? matchedItems[0].chainIcon : null;
            const cryptoItem = matchedItems.find(
              (item) =>
                item.shortName.trim().toUpperCase() ===
                transaction.symbol.trim().toUpperCase()
            );
            const cryptoIcon = cryptoItem ? cryptoItem.icon : null;

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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                          {transaction.address === transaction.fromAddress
                            ? `${transaction.amount}`
                            : `-${transaction.amount}`}{" "}
                          {transaction.symbol}
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

      {/* 显示交易详情的 Modal */}
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
      {shouldDisplayChainFilterModal && (
        <TransactionChainFilterModal
          isVisible={isChainFilterModalVisible}
          onClose={() => setChainFilterModalVisible(false)}
          selectedChain={selectedChain}
          handleSelectChain={(chain) => {
            setSelectedChain(chain);
            setChainFilterModalVisible(false);
          }}
          chainCards={transactionChainCards}
          isDarkMode={isDarkMode}
          t={t}
        />
      )}
    </View>
  );
};

export default TransactionHistory;
