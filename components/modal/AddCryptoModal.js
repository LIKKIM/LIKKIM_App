// AddCryptoModal.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

const AddCryptoModal = ({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  filteredCryptos,
  handleAddCrypto,
  styles,
  t,
  isDarkMode,
  chainCategories,
  cryptoCards,
}) => {
  const [selectedChain, setSelectedChain] = useState("All"); // 状态追踪选中的链标签
  const [selectedCryptos, setSelectedCryptos] = useState([]); // 用于存储选中的加密货币

  // 通过选中的链标签过滤加密货币
  const filteredByChain =
    selectedChain === "All"
      ? filteredCryptos
      : filteredCryptos.filter((crypto) => crypto.chain === selectedChain);

  // 根据持久化的数据初始化selectedCryptos
  useEffect(() => {
    if (visible) {
      // 使用 name 和 chain 的组合来标记已添加的加密货币
      const addedCryptos = cryptoCards.map(
        (crypto) => `${crypto.name}-${crypto.chain}`
      );
      const initiallySelected = filteredCryptos.filter((crypto) =>
        addedCryptos.includes(`${crypto.name}-${crypto.chain}`)
      );
      setSelectedCryptos(initiallySelected);
    }
  }, [visible, cryptoCards, filteredCryptos]);

  const toggleSelectCrypto = (crypto) => {
    const cryptoIdentifier = `${crypto.name}-${crypto.chain}`; // 使用name和chain作为唯一标识符
    if (
      selectedCryptos.some(
        (selected) => `${selected.name}-${selected.chain}` === cryptoIdentifier
      )
    ) {
      setSelectedCryptos(
        selectedCryptos.filter(
          (c) => `${c.name}-${c.chain}` !== cryptoIdentifier
        )
      );
    } else {
      setSelectedCryptos([...selectedCryptos, crypto]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.addCryptoModalView}>
          {/* 搜索输入框 */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t("Search Cryptocurrency")}
              placeholderTextColor={isDarkMode ? "#ffffff" : "#21201E"}
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
          </View>

          {/* 链分类标签 */}
          <ScrollView
            horizontal
            style={styles.chainScrollView}
            showsHorizontalScrollIndicator={false}
          >
            {/* All 标签 */}
            <TouchableOpacity
              key="All"
              style={[
                styles.chainTag,
                selectedChain === "All" && styles.selectedChainTag,
              ]}
              onPress={() => setSelectedChain("All")}
            >
              <Text
                style={[
                  styles.chainTagText,
                  selectedChain === "All" && styles.selectedChainTagText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {chainCategories.map((chain, index) => (
              <TouchableOpacity
                key={`${chain.name}-${chain.chain}-${index}`} // 使用链名和index确保key唯一
                style={[
                  styles.chainTag,
                  selectedChain === chain.chain && styles.selectedChainTag,
                ]}
                onPress={() => setSelectedChain(chain.chain)}
              >
                {chain.chainIcon && (
                  <Image source={chain.chainIcon} style={styles.TagChainIcon} />
                )}
                <Text
                  style={[
                    styles.chainTagText,
                    selectedChain === chain.chain &&
                      styles.selectedChainTagText,
                  ]}
                >
                  {chain.chain}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 加密货币列表 */}
          <ScrollView
            style={styles.addCryptoScrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {filteredByChain.map((crypto) => (
              <TouchableOpacity
                key={`${crypto.name}-${crypto.chain}`}
                style={[
                  styles.addCryptoButton,
                  {
                    borderWidth: 2, // 统一的边框宽度
                    borderColor: selectedCryptos.includes(crypto)
                      ? "#CFAB95"
                      : cryptoCards.some(
                          (card) =>
                            card.name === crypto.name &&
                            card.chain === crypto.chain
                        )
                      ? "#CFAB95"
                      : "transparent",
                  },
                ]}
                onPress={() => toggleSelectCrypto(crypto)} // 切换选中状态
              >
                <ImageBackground
                  source={crypto.cardImage}
                  style={styles.addCryptoImage}
                  imageStyle={{
                    borderRadius: 12,
                    backgroundColor: "#ffffff50",
                  }}
                >
                  <View style={styles.addCryptoOverlay} />
                  <View style={styles.iconAndTextContainer}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 15,
                        backgroundColor: "#ffffff50",
                        overflow: "hidden",
                      }}
                    >
                      <Image source={crypto.icon} style={styles.addCardIcon} />
                    </View>
                    <Text style={styles.addCryptoImageText}>
                      {crypto.shortName}
                    </Text>
                  </View>
                </ImageBackground>

                {/* 判断 Added 状态 */}
                {cryptoCards.some(
                  (card) =>
                    card.name === crypto.name && card.chain === crypto.chain
                ) && (
                  <View
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      backgroundColor: "#CFAB9540",
                      paddingVertical: 2,
                      paddingHorizontal: 8,
                      borderRadius: 30,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: isDarkMode ? "#ffffff" : "#21201E",
                      }}
                    >
                      {t("Added")}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.addCryptoText}>{crypto.name}</Text>

                  <View style={styles.chainContainer}>
                    <Text style={[styles.chainCardText]}>{crypto.chain}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 确认按钮 */}
          <TouchableOpacity
            style={[
              selectedCryptos.length > 0
                ? styles.addModalButton
                : styles.disabledButton, // 按选择状态改变按钮样式
            ]}
            onPress={() => {
              if (selectedCryptos.length > 0) {
                console.log("提交了多少个卡片:", selectedCryptos.length); // 打印提交的卡片数量
                handleAddCrypto(selectedCryptos); // 处理所有选中的货币
                setSelectedCryptos([]); // 重置选中的货币
              }
            }}
            disabled={selectedCryptos.length === 0} // 如果未选择任何货币，禁用按钮
          >
            <Text
              style={[
                selectedCryptos.length > 0
                  ? styles.confirmText
                  : styles.disabledText,
              ]}
            >
              {t("Confirm")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t("Close")}</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default AddCryptoModal;
