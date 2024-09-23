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
}) => {
  const [selectedChain, setSelectedChain] = useState("All"); // 状态追踪选中的链标签
  const [selectedCryptos, setSelectedCryptos] = useState([]); // 用于存储选中的加密货币

  // 通过选中的链标签过滤加密货币
  const filteredByChain =
    selectedChain === "All"
      ? filteredCryptos
      : filteredCryptos.filter((crypto) => crypto.chain === selectedChain);

  // 当模态框打开时重置已选的加密货币项
  useEffect(() => {
    if (visible) {
      setSelectedCryptos([]); // 每次打开模态框时重置选择项
    }
  }, [visible]);

  // 处理多选功能
  const toggleSelectCrypto = (crypto) => {
    if (selectedCryptos.includes(crypto)) {
      // 如果已选中，取消选择
      setSelectedCryptos(selectedCryptos.filter((c) => c !== crypto));
    } else {
      // 如果未选中，添加到数组
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
              placeholderTextColor={isDarkMode ? "#ffffff" : "#24234C"}
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

            {chainCategories.map((chain) => (
              <TouchableOpacity
                key={chain.name}
                style={[
                  styles.chainTag,
                  selectedChain === chain.name && styles.selectedChainTag,
                ]}
                onPress={() => setSelectedChain(chain.name)}
              >
                {chain.chainIcon && (
                  <Image source={chain.chainIcon} style={styles.TagChainIcon} />
                )}
                <Text
                  style={[
                    styles.chainTagText,
                    selectedChain === chain.name && styles.selectedChainTagText,
                  ]}
                >
                  {chain.name}
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
                key={crypto.name}
                style={[
                  styles.addCryptoButton,
                  {
                    borderWidth: selectedCryptos.includes(crypto) ? 2 : 2, // 选中时增加边框宽度，未选中时无边框
                    borderColor: selectedCryptos.includes(crypto)
                      ? "#8E80F0"
                      : "transparent", // 选中时边框颜色为 #8E80F0
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
