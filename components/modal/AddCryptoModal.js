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
  chainCategories, // 添加一个新的prop用于传递链分类标签
}) => {
  const [selectedChain, setSelectedChain] = useState("All");

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
                style={styles.addCryptoButton}
                onPress={() => handleAddCrypto(crypto)}
              >
                <ImageBackground
                  source={crypto.cardImage}
                  style={styles.addCryptoImage}
                  imageStyle={{
                    borderRadius: 12,
                    backgroundColor: "#ffffff10",
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

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t("Close")}</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default AddCryptoModal;
