// AddCryptoModal.js
import React, { useState } from "react";
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
  const [selectedCrypto, setSelectedCrypto] = useState(null); // 状态追踪用户选中的加密货币

  // 通过选中的链标签过滤加密货币
  const filteredByChain =
    selectedChain === "All"
      ? filteredCryptos
      : filteredCryptos.filter((crypto) => crypto.chain === selectedChain);

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
                key={chain}
                style={[
                  styles.chainTag,
                  selectedChain === chain && styles.selectedChainTag,
                ]}
                onPress={() => setSelectedChain(chain)}
              >
                {/* 显示链的图标 */}
                <Image source={chain.chainIcon} style={styles.TagChainIcon} />
                <Text
                  style={[
                    styles.chainTagText,
                    selectedChain === chain && styles.selectedChainTagText,
                  ]}
                >
                  {chain}
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
                    //     backgroundColor:
                    //       selectedCrypto === crypto ? "#E5E1E9" : "#f0f0f0", // 动态改变背景颜色
                    borderWidth: selectedCrypto === crypto ? 2 : 2, // 选中时增加边框宽度，未选中时无边框
                    borderColor:
                      selectedCrypto === crypto ? "#8E80F0" : "transparent", // 选中时边框颜色为 #8E80F0
                  },
                ]}
                onPress={() => setSelectedCrypto(crypto)} // 设置选中的货币
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
              selectedCrypto ? styles.addModalButton : styles.disabledButton, // 按选择状态改变按钮样式
            ]}
            onPress={() => {
              if (selectedCrypto) {
                handleAddCrypto(selectedCrypto); // 仅当选中了货币才执行添加
                setSelectedCrypto(null); // 重置选中的货币
              }
            }}
            disabled={!selectedCrypto} // 如果未选择数字货币，禁用按钮
          >
            <Text
              style={[
                selectedCrypto ? styles.confirmText : styles.disabledText,
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
