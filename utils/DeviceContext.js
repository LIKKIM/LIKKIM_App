// DeviceContext.js

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../config/i18n";
import { initialAdditionalCryptos } from "../config/assetInfo";
import currencies from "../config/currencies";
import { marketAPI } from "../env/apiEndpoints";

// Create contexts
export const DeviceContext = createContext();
export const DarkModeContext = createContext();

// API URL for fetching exchange rates
const NEW_EXCHANGE_RATE_API_URL = marketAPI.exchangeRate;

// Default USDT crypto data
export const usdtCrypto = {
  name: "USDT",
  shortName: "USDT",
  balance: "0.0",
  icon: require("../assets/USDTIcon.png"),
  cardImage: require("../assets/Card43.png"),
  address: "TN121JdH9t2y7qjuExHrYMdJA5RHJXdaZK",
  chain: "Tron",
  chainShortName: "TRX",
  queryChainShortName: "TRON",
  chainIcon: require("../assets/icon/TRXIcon.png"),
  tokenType: "TRC20",
  fee: "2.0",
  valueUsd: "0.0",
  priceUsd: "1.0",
};

export const CryptoProvider = ({ children }) => {
  // State definitions
  const [isScreenLockEnabled, setIsScreenLockEnabled] = useState(false);
  const [screenLockPassword, setScreenLockPassword] = useState("");
  const [cryptoCount, setCryptoCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState("USD");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [initialAdditionalCryptosState, setInitialAdditionalCryptos] = useState(
    initialAdditionalCryptos
  );
  const [additionalCryptos, setAdditionalCryptos] = useState(
    initialAdditionalCryptosState
  );
  const [isVerificationSuccessful, setIsVerificationSuccessful] =
    useState(false);
  const [verifiedDevices, setVerifiedDevices] = useState([]);
  const [isAppLaunching, setIsAppLaunching] = useState(true);
  const [cryptoCards, setCryptoCards] = useState([]);
  const [addedCryptos, setAddedCryptos] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});

  // Supported chains for address updates
  const supportedChains = ["ETH", "BTC", "SOL", "TRX"];

  // Update cryptoCards state: update if exists, otherwise add new card
  const handleUpdateCryptoCards = (newCrypto) => {
    setCryptoCards((prevCards) => {
      const cardExists = prevCards.some(
        (card) =>
          card.shortName === newCrypto.shortName &&
          card.chainShortName === newCrypto.chainShortName
      );
      if (cardExists) {
        return prevCards.map((card) =>
          card.shortName === newCrypto.shortName &&
          card.chainShortName === newCrypto.chainShortName
            ? newCrypto
            : card
        );
      }
      const updatedCards = [...prevCards, newCrypto];
      setAddedCryptos(updatedCards);
      return updatedCards;
    });
  };

  // Update crypto address based on chain
  const updateCryptoAddress = (chainShortName, newAddress) => {
    if (!supportedChains.includes(chainShortName)) {
      // For unsupported chains, only update initialAdditionalCryptos
      setInitialAdditionalCryptos((prevCryptos) => {
        const updatedCryptos = prevCryptos.map((crypto) =>
          crypto.chainShortName === chainShortName
            ? { ...crypto, address: newAddress }
            : crypto
        );
        AsyncStorage.setItem(
          "initialAdditionalCryptos",
          JSON.stringify(updatedCryptos)
        );
        return updatedCryptos;
      });
      return;
    }

    // For supported chains, update both initialAdditionalCryptos and cryptoCards
    setInitialAdditionalCryptos((prevCryptos) => {
      const updatedCryptos = prevCryptos.map((crypto) =>
        crypto.chainShortName === chainShortName
          ? { ...crypto, address: newAddress }
          : crypto
      );

      AsyncStorage.setItem(
        "initialAdditionalCryptos",
        JSON.stringify(updatedCryptos)
      );

      setCryptoCards((prevCards) => {
        const updatedCards = prevCards.map((card) =>
          card.chainShortName === chainShortName
            ? { ...card, address: newAddress }
            : card
        );
        if (!prevCards.find((card) => card.chainShortName === chainShortName)) {
          updatedCards.push(
            updatedCryptos.find(
              (crypto) => crypto.chainShortName === chainShortName
            )
          );
        }
        return updatedCards;
      });

      return updatedCryptos;
    });
  };

  // Update crypto public key
  const updateCryptoPublicKey = (queryChainName, publicKey) => {
    setInitialAdditionalCryptos((prevCryptos) => {
      const updatedCryptos = prevCryptos.map((crypto) =>
        crypto.queryChainName === queryChainName
          ? { ...crypto, publicKey }
          : crypto
      );
      AsyncStorage.setItem(
        "initialAdditionalCryptos",
        JSON.stringify(updatedCryptos)
      ).catch((error) => {
        console.error("Failed to persist initialAdditionalCryptos:", error);
      });
      return updatedCryptos;
    });
  };

  // Update crypto data for supported chains
  const updateCryptoData = (shortName, newData) => {
    if (supportedChains.includes(shortName)) {
      setInitialAdditionalCryptos((prevCryptos) => {
        const updatedCryptos = prevCryptos.map((crypto) =>
          crypto.shortName === shortName ? { ...crypto, ...newData } : crypto
        );
        AsyncStorage.setItem(
          "initialAdditionalCryptos",
          JSON.stringify(updatedCryptos)
        );
        return updatedCryptos;
      });
    }
  };

  // Fetch and store exchange rates from API
  const fetchAndStoreExchangeRates = async () => {
    try {
      const response = await fetch(NEW_EXCHANGE_RATE_API_URL);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      const data = await response.json();
      //  console.log("Fetched data:", data);

      if (data.code === 0 && data.data) {
        const flattenedData = {};
        for (const [currency, rateArray] of Object.entries(data.data)) {
          if (Array.isArray(rateArray) && rateArray.length > 0) {
            flattenedData[currency] = rateArray[0];
          }
        }
        setExchangeRates(flattenedData);
        await AsyncStorage.setItem(
          "exchangeRates",
          JSON.stringify(flattenedData)
        );
      } else {
        console.error("Failed to fetch exchange rates:", data.msg);
      }
    } catch (error) {
      console.log("Error fetching exchange rates:", error);
    }
  };

  // Load transaction history from storage
  useEffect(() => {
    const loadTransactionHistory = async () => {
      try {
        const history = await AsyncStorage.getItem("transactionHistory");
        if (history !== null) {
          setTransactionHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error("Failed to load transaction history:", error);
      }
    };
    loadTransactionHistory();
  }, []);

  // Save transaction history on change
  useEffect(() => {
    const saveTransactionHistory = async () => {
      try {
        await AsyncStorage.setItem(
          "transactionHistory",
          JSON.stringify(transactionHistory)
        );
      } catch (error) {
        console.error("Failed to save transaction history:", error);
      }
    };
    if (transactionHistory.length > 0) {
      saveTransactionHistory();
    }
  }, [transactionHistory]);

  // Save added cryptos when they change
  useEffect(() => {
    const saveAddedCryptos = async () => {
      try {
        await AsyncStorage.setItem(
          "addedCryptos",
          JSON.stringify(addedCryptos)
        );
      } catch (error) {
        console.error("Error saving addedCryptos:", error);
      }
    };
    if (addedCryptos.length > 0) {
      saveAddedCryptos();
    }
  }, [addedCryptos]);

  // Load user settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const darkModeValue = await AsyncStorage.getItem("darkMode");
        if (darkModeValue !== null) setIsDarkMode(JSON.parse(darkModeValue));

        const currencyValue = await AsyncStorage.getItem("currencyUnit");
        if (currencyValue !== null) setCurrencyUnit(currencyValue);

        const languageValue = await AsyncStorage.getItem("language");
        if (languageValue !== null) i18n.changeLanguage(languageValue);

        const savedCryptos = await AsyncStorage.getItem("addedCryptos");
        if (savedCryptos !== null) {
          const parsedCryptos = JSON.parse(savedCryptos);
          setAddedCryptos(parsedCryptos);
          setCryptoCount(parsedCryptos.length);
        }

        const storedStatus = await AsyncStorage.getItem(
          "isVerificationSuccessful"
        );
        if (storedStatus !== null) {
          setIsVerificationSuccessful(JSON.parse(storedStatus));
        }

        const savedDevices = await AsyncStorage.getItem("verifiedDevices");
        if (savedDevices !== null) {
          setVerifiedDevices(JSON.parse(savedDevices));
        }

        const screenLockEnabled = await AsyncStorage.getItem(
          "screenLockEnabled"
        );
        const storedScreenLockPassword = await AsyncStorage.getItem(
          "screenLockPassword"
        );
        if (screenLockEnabled !== null)
          setIsScreenLockEnabled(JSON.parse(screenLockEnabled));
        if (storedScreenLockPassword !== null)
          setScreenLockPassword(storedScreenLockPassword);

        const savedInitialCryptos = await AsyncStorage.getItem(
          "initialAdditionalCryptos"
        );
        if (savedInitialCryptos !== null) {
          setInitialAdditionalCryptos(JSON.parse(savedInitialCryptos));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsAppLaunching(true);
      }
    };
    loadSettings();
  }, []);

  // Save user settings whenever dependencies change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem("darkMode", JSON.stringify(isDarkMode));
        await AsyncStorage.setItem("currencyUnit", currencyUnit);
        await AsyncStorage.setItem("language", i18n.language);
        await AsyncStorage.setItem(
          "addedCryptos",
          JSON.stringify(addedCryptos)
        );
        await AsyncStorage.setItem(
          "isVerificationSuccessful",
          JSON.stringify(isVerificationSuccessful)
        );
        await AsyncStorage.setItem(
          "verifiedDevices",
          JSON.stringify(verifiedDevices)
        );
        await AsyncStorage.setItem(
          "screenLockEnabled",
          JSON.stringify(isScreenLockEnabled)
        );
        await AsyncStorage.setItem("screenLockPassword", screenLockPassword);
        await AsyncStorage.setItem(
          "initialAdditionalCryptos",
          JSON.stringify(initialAdditionalCryptosState)
        );
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    };
    saveSettings();
  }, [
    isDarkMode,
    currencyUnit,
    i18n.language,
    addedCryptos,
    isVerificationSuccessful,
    verifiedDevices,
    isScreenLockEnabled,
    screenLockPassword,
    initialAdditionalCryptosState,
  ]);

  // Toggle screen lock functionality
  const toggleScreenLock = async (enabled) => {
    setIsAppLaunching(false);
    setIsScreenLockEnabled(enabled);
    await AsyncStorage.multiSet([
      ["screenLockEnabled", JSON.stringify(enabled)],
      ["isAppLaunching", JSON.stringify(false)],
    ]);
  };

  // Change screen lock password
  const changeScreenLockPassword = async (newPassword) => {
    setScreenLockPassword(newPassword);
    await AsyncStorage.setItem("screenLockPassword", newPassword);
  };

  // Fetch exchange rates when component mounts
  useEffect(() => {
    fetchAndStoreExchangeRates();
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        updateCryptoData,
        cryptoCount,
        setCryptoCount,
        currencyUnit,
        setCurrencyUnit,
        currencies,
        usdtCrypto,
        initialAdditionalCryptos: initialAdditionalCryptosState,
        setInitialAdditionalCryptos,
        additionalCryptos,
        setAdditionalCryptos,
        setAddedCryptos,
        updateCryptoAddress,
        isVerificationSuccessful,
        setIsVerificationSuccessful,
        verifiedDevices,
        setVerifiedDevices,
        isScreenLockEnabled,
        setIsScreenLockEnabled,
        toggleScreenLock,
        screenLockPassword,
        changeScreenLockPassword,
        isAppLaunching,
        setIsAppLaunching,
        cryptoCards,
        addedCryptos,
        setCryptoCards,
        handleUpdateCryptoCards,
        exchangeRates,
        transactionHistory,
        setTransactionHistory,
        updateCryptoPublicKey,
      }}
    >
      <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </DeviceContext.Provider>
  );
};

export default CryptoProvider;
