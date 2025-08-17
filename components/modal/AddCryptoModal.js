// AddCryptoModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const AddCryptoModal = ({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  filteredCryptos,
  handleAddCrypto,
  VaultScreenStyle,
  t,
  isDarkMode,
  chainCategories,
  cryptoCards,
}) => {
  const [selectedChain, setSelectedChain] = useState("All");
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const intensityAnim = useRef(new Animated.Value(0)).current;

  const filteredByChain =
    selectedChain === "All"
      ? filteredCryptos
      : filteredCryptos.filter((crypto) => crypto.chain === selectedChain);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.sequence([
        Animated.timing(intensityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(intensityAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
      const addedCryptos = cryptoCards.map(
        (crypto) => `${crypto.name}-${crypto.chain}`
      );
      const initiallySelected = filteredCryptos.filter((crypto) =>
        addedCryptos.includes(`${crypto.name}-${crypto.chain}`)
      );
      setSelectedCryptos(initiallySelected);
    } else if (showModal) {
      setShowModal(false);
      Animated.timing(intensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      });
    }
  }, [visible, cryptoCards, filteredCryptos]);

  const toggleSelectCrypto = (crypto) => {
    const cryptoIdentifier = `${crypto.name}-${crypto.chain}`;
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

  // 关闭动画并回调
  const handleClose = () => {
    setShowModal(false);
    Animated.timing(intensityAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      if (onClose) onClose();
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={handleClose}
    >
      <AnimatedBlurView
        intensity={intensityAnim}
        style={VaultScreenStyle.centeredView}
      >
        <View style={VaultScreenStyle.addCryptoModalView}>
          <View style={VaultScreenStyle.searchContainer}>
            <Icon name="search" size={20} style={VaultScreenStyle.searchIcon} />
            <TextInput
              style={VaultScreenStyle.searchInput}
              placeholder={t("Search Asset")}
              placeholderTextColor={isDarkMode ? "#ffffff" : "#21201E"}
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
          </View>

          <ScrollView
            horizontal
            style={VaultScreenStyle.chainScrollView}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              key="All"
              style={[
                VaultScreenStyle.chainTag,
                selectedChain === "All" && VaultScreenStyle.selectedChainTag,
              ]}
              onPress={() => setSelectedChain("All")}
            >
              <Text
                style={[
                  VaultScreenStyle.chainTagText,
                  selectedChain === "All" &&
                    VaultScreenStyle.selectedChainTagText,
                ]}
              >
                {t("All")}
              </Text>
            </TouchableOpacity>
            {[...new Set(chainCategories.map((chain) => chain.chain))].map(
              (chain) => (
                <TouchableOpacity
                  key={chain}
                  style={[
                    VaultScreenStyle.chainTag,
                    selectedChain === chain &&
                      VaultScreenStyle.selectedChainTag,
                  ]}
                  onPress={() => setSelectedChain(chain)}
                >
                  {chainCategories.some(
                    (category) => category.chain === chain
                  ) && (
                    <>
                      {chainCategories.filter(
                        (category) => category.chain === chain
                      )[0].chainIcon && (
                        <Image
                          source={
                            chainCategories.filter(
                              (category) => category.chain === chain
                            )[0].chainIcon
                          }
                          style={VaultScreenStyle.TagChainIcon}
                        />
                      )}
                      <Text
                        style={[
                          VaultScreenStyle.chainTagText,
                          selectedChain === chain &&
                            VaultScreenStyle.selectedChainTagText,
                        ]}
                      >
                        {chain}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          <ScrollView
            style={VaultScreenStyle.addCryptoScrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {filteredByChain.map((crypto) => (
              <TouchableOpacity
                key={`${crypto.name}-${crypto.chain}`}
                style={[
                  VaultScreenStyle.addCryptoButton,
                  {
                    borderWidth: 2,
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
                onPress={() => toggleSelectCrypto(crypto)}
              >
                <ImageBackground
                  source={crypto.cardImage}
                  style={VaultScreenStyle.addCryptoImage}
                  imageStyle={{
                    borderRadius: 12,
                    backgroundColor: "#ffffff50",
                  }}
                >
                  <View style={VaultScreenStyle.addCryptoOverlay} />
                  <View style={VaultScreenStyle.iconAndTextContainer}>
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
                      <Image
                        source={crypto.icon}
                        style={VaultScreenStyle.addCardIcon}
                      />
                    </View>
                    <Text style={VaultScreenStyle.addCryptoImageText}>
                      {crypto.shortName}
                    </Text>
                  </View>
                </ImageBackground>

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
                  <Text style={VaultScreenStyle.addCryptoText}>
                    {crypto.name}
                  </Text>
                  <View style={VaultScreenStyle.chainContainer}>
                    <Text style={VaultScreenStyle.chainCardText}>
                      {crypto.chain}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[
              selectedCryptos.length > 0
                ? VaultScreenStyle.addModalButton
                : VaultScreenStyle.disabledButton,
            ]}
            onPress={() => {
              if (selectedCryptos.length > 0) {
                console.log("提交了多少个卡片:", selectedCryptos.length);
                handleAddCrypto(selectedCryptos);
                setSelectedCryptos([]);
              }
            }}
            disabled={selectedCryptos.length === 0}
          >
            <Text
              style={[
                selectedCryptos.length > 0
                  ? VaultScreenStyle.confirmText
                  : VaultScreenStyle.disabledText,
              ]}
            >
              {t("Confirm")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={VaultScreenStyle.cancelButton}
            onPress={handleClose}
          >
            <Text style={VaultScreenStyle.cancelButtonText}>{t("Close")}</Text>
          </TouchableOpacity>
        </View>
      </AnimatedBlurView>
    </Modal>
  );
};

// Animated BlurView 封装
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default AddCryptoModal;
