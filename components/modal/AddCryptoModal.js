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
  const [selectedChain, setSelectedChain] = useState("All");
  const [selectedCryptos, setSelectedCryptos] = useState([]);

  const filteredByChain =
    selectedChain === "All"
      ? filteredCryptos
      : filteredCryptos.filter((crypto) => crypto.chain === selectedChain);

  useEffect(() => {
    if (visible) {
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.addCryptoModalView}>
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

          <ScrollView
            horizontal
            style={styles.chainScrollView}
            showsHorizontalScrollIndicator={false}
          >
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
            {[...new Set(chainCategories.map((chain) => chain.chain))].map(
              (chain) => (
                <TouchableOpacity
                  key={chain}
                  style={[
                    styles.chainTag,
                    selectedChain === chain && styles.selectedChainTag,
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
                          style={styles.TagChainIcon}
                        />
                      )}
                      <Text
                        style={[
                          styles.chainTagText,
                          selectedChain === chain &&
                            styles.selectedChainTagText,
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
                    <Text style={styles.chainCardText}>{crypto.chain}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[
              selectedCryptos.length > 0
                ? styles.addModalButton
                : styles.disabledButton,
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
