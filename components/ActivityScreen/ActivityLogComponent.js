import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  FlatList,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { initialAdditionalCryptos } from "../../config/assetInfo"; // 修改为实际路径
import { CHAIN_NAMES } from "../../config/chainConfig";
import { DeviceContext, DarkModeContext } from "../../utils/DeviceContext";
import ChainSelectionModal from "../modal/ChainSelectionModal"; // 导入 ChainSelectionModal
import TransactionChainFilterModal from "../modal/TransactionChainFilterModal";

const ActivityLogComponent = ({
  ActivityScreenStyle,
  t,
  ActivityLog,
  isLoading,
  cryptoCards,
  refreshing,
  onRefresh,
  onLoadMore,
  hasMore,
}) => {
  // console.log("ActivityLog length:", ActivityLog.length);
  // console.log("cryptoCards length:", cryptoCards.length);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedChain, setSelectedChain] = useState("All");
  const { isDarkMode } = useContext(DarkModeContext);
  const [isChainFilterModalVisible, setChainFilterModalVisible] =
    useState(false);

  // 根据 ActivityLog 计算每笔交易对应的链卡片
  const transactionChainCards = useMemo(() => {
    const map = new Map();

    ActivityLog.filter((tx) => tx.amount > 0).forEach((tx) => {
      const matchedItems = initialAdditionalCryptos.filter((item) => {
        const address =
          item.address && typeof item.address === "string"
            ? item.address?.trim()
            : "";
        const shortName =
          item.shortName && typeof item.shortName === "string"
            ? item.shortName?.trim()
            : "";

        if (address === "") {
          return shortName.toLowerCase() === tx.symbol?.trim().toLowerCase();
        }
        return address.toLowerCase() === tx.address?.trim().toLowerCase();
      });

      if (matchedItems.length > 0) {
        const card = matchedItems[0];
        if (!map.has(card.chainShortName)) {
          map.set(card.chainShortName, card);
        }
      }
    });
    return Array.from(map.values());
  }, [ActivityLog]);

  const filteredActivityLog =
    selectedChain === "All"
      ? ActivityLog.filter((tx) => tx.amount > 0)
      : ActivityLog.filter((transaction) => {
          const matchedItems = initialAdditionalCryptos.filter((item) => {
            const address =
              item.address && typeof item.address === "string"
                ? item.address?.trim()
                : "";
            const shortName =
              item.shortName && typeof item.shortName === "string"
                ? item.shortName?.trim()
                : "";

            if (item.address?.trim() === "") {
              return (
                shortName.toLowerCase() ===
                transaction.symbol?.trim().toLowerCase()
              );
            }

            return (
              address.toLowerCase() ===
              transaction.address?.trim().toLowerCase()
            );
          });

          if (matchedItems.length > 0) {
            return (
              matchedItems[0].chainShortName === selectedChain &&
              transaction.amount > 0
            );
          }
          return false;
        });

  const shouldDisplayChainFilterModal = filteredActivityLog.length > 0;

  return (
    <View style={ActivityScreenStyle.historyContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text
          style={[
            ActivityScreenStyle.historyTitle,
            { textAlign: "left", flex: 1 },
          ]}
        >
          {t("Activity Log")}
        </Text>
        <TouchableOpacity
          onPress={() =>
            shouldDisplayChainFilterModal && setChainFilterModalVisible(true)
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            flexShrink: 1,
            flexWrap: "wrap",
            marginLeft: 8,
          }}
        >
          {selectedChain === "All" ? (
            <Image
              source={require("../../assets/VaultScreenLogo.png")}
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
          <Text
            style={{
              color: isDarkMode ? "#FFFFFF" : "#000000",
              textAlign: "right",
              flexShrink: 1,
            }}
          >
            {selectedChain === "All"
              ? t("All Chains")
              : transactionChainCards.find(
                  (card) => card.chainShortName === selectedChain
                )?.chain}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...ActivityLog].sort(
          (a, b) => Number(b.transactionTime) - Number(a.transactionTime)
        )}
        keyExtractor={(_, index) => index.toString()}
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 10,
          marginTop: 10,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent:
            !ActivityLog ||
            ActivityLog.length === 0 ||
            cryptoCards.length === 0 ||
            isLoading
              ? "center"
              : "flex-start",
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={-20}
          />
        }
        renderItem={({ item: transaction, index }) => {
          // ========== 匹配币种与链图标 ==========
          const matchedItems = initialAdditionalCryptos.filter((item) => {
            if (item.address?.trim() === "") {
              return (
                item.shortName?.trim().toLowerCase() ===
                transaction.symbol?.trim().toLowerCase()
              );
            }
            return (
              item.address?.trim().toLowerCase() ===
              transaction.address?.trim().toLowerCase()
            );
          });
          const chainIcon =
            matchedItems.length > 0 ? matchedItems[0].chainIcon : null;
          const cryptoItem = matchedItems.find(
            (item) =>
              item.shortName?.trim().toUpperCase() ===
              transaction.symbol?.trim().toUpperCase()
          );
          const cryptoIcon = cryptoItem ? cryptoItem.icon : null;

          // ========== 渲染单个item ==========
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedTransaction(transaction)}
            >
              <View
                style={[
                  {
                    borderRadius: 10,
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
                <Text style={ActivityScreenStyle.historyItemText}>
                  {`${new Date(
                    Number(transaction.transactionTime)
                  ).toLocaleString()}`}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ position: "relative", width: 50, height: 50 }}>
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
                          ActivityScreenStyle.historyItemText,
                          { fontSize: 16, fontWeight: "bold" },
                        ]}
                      >
                        {transaction.address === transaction.fromAddress
                          ? t("Receive")
                          : t("Send")}
                      </Text>
                      <Text
                        style={[
                          ActivityScreenStyle.historyItemText,
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
                      <Text style={ActivityScreenStyle.historyItemText}>
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
        }}
        // 空、加载状态完全等价ScrollView
        ListEmptyComponent={
          isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={ActivityScreenStyle.loadingText}>
                {t("Loading...")}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={ActivityScreenStyle.noHistoryText}>
                {t("No Histories")}
              </Text>
            </View>
          )
        }
        // 底部加载更多提示
        ListFooterComponent={
          isLoading && ActivityLog.length > 0 ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasMore && !isLoading) onLoadMore && onLoadMore();
        }}
        onEndReachedThreshold={0.2}
      />

      {/* 显示交易详情的 Modal */}
      <Modal
        visible={!!selectedTransaction}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View style={ActivityScreenStyle.modalContainer}>
          <View
            style={[
              ActivityScreenStyle.cardContainer,
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
                      ActivityScreenStyle.historyItemText,
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
                      ActivityScreenStyle.historyItemText,
                      { fontSize: 16, fontWeight: "bold", textAlign: "right" },
                    ]}
                  >
                    {selectedTransaction.amount} {selectedTransaction.symbol}
                  </Text>
                </View>
                <Text
                  style={[
                    ActivityScreenStyle.historyItemText,
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
                    ActivityScreenStyle.historyItemText,
                    { lineHeight: 24, textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`From: `}</Text>
                  {selectedTransaction.from}
                </Text>
                <Text
                  style={[
                    ActivityScreenStyle.historyItemText,
                    { lineHeight: 24, textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`To: `}</Text>
                  {selectedTransaction.to}
                </Text>
                <Text
                  style={[
                    ActivityScreenStyle.historyItemText,
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
                    ActivityScreenStyle.historyItemText,
                    { textAlign: "left" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>{`Network Fee: `}</Text>
                  {selectedTransaction.txFee}
                </Text>
                <Text
                  style={[
                    ActivityScreenStyle.historyItemText,
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
                    style={ActivityScreenStyle.cancelButton}
                  >
                    <Text style={ActivityScreenStyle.cancelButtonText}>
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

export default ActivityLogComponent;
