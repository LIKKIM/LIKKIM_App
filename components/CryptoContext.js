// CryptoContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../config/i18n";
import { initialAdditionalCryptos } from "../config/cryptosData";

export const CryptoContext = createContext();
export const DarkModeContext = createContext();

const NEW_EXCHANGE_RATE_API_URL =
  "https://df.likkim.com/api/market/exchange-rate";

const currencies = [
  { name: "Australian Dollar", shortName: "AUD" },
  { name: "Bahraini Dinar", shortName: "BHD" },
  { name: "Brazilian Real", shortName: "BRL" },
  { name: "British Pound", shortName: "GBP" },
  { name: "Canadian Dollar", shortName: "CAD" },
  { name: "Chilean Peso", shortName: "CLP" },
  { name: "Czech Koruna", shortName: "CZK" },
  { name: "Danish Krone", shortName: "DKK" },
  { name: "Emirati Dirham", shortName: "AED" },
  { name: "Euro", shortName: "EUR" },
  { name: "Hong Kong Dollar", shortName: "HKD" },
  { name: "Hungarian Forint", shortName: "HUF" },
  { name: "Indian Rupee", shortName: "INR" },
  { name: "Indonesian Rupiah", shortName: "IDR" },
  { name: "Israeli Shekel", shortName: "ILS" },
  { name: "Japanese Yen", shortName: "JPY" },
  { name: "Malaysian Ringgit", shortName: "MYR" },
  { name: "Mexico Peso", shortName: "MXN" },
  { name: "New Zealand Dollar", shortName: "NZD" },
  { name: "Nigerian Naira", shortName: "NGN" },
  { name: "Norwegian Krone", shortName: "NOK" },
  { name: "Pakistani Rupee", shortName: "PKR" },
  { name: "Philippine Peso", shortName: "PHP" },
  { name: "Polish Zloty", shortName: "PLN" },
  { name: "Russian Rouble", shortName: "RUB" },
  { name: "Singapore Dollar", shortName: "SGD" },
  { name: "South African Rand", shortName: "ZAR" },
  { name: "South Korean Won", shortName: "KRW" },
  { name: "Swedish Krona", shortName: "SEK" },
  { name: "Swiss Franc", shortName: "CHF" },
  { name: "Thai Baht", shortName: "THB" },
  { name: "Turkish Lira", shortName: "TRY" },
  { name: "US Dollar", shortName: "USD" },
  { name: "Ukrainian Hryvnia", shortName: "UAH" },
  { name: "Vietnamese Dong", shortName: "VND" },
  { name: "Chinese Yuan", shortName: "CNY" },
];

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

  const supportedChains = ["ETH", "BTC", "SOL"];

  const updateCryptoAddress = (shortName, newAddress) => {
    if (!supportedChains.includes(shortName)) {
      // Update address for unsupported chains without adding to wallet screen
      setInitialAdditionalCryptos((prevCryptos) => {
        const updatedCryptos = prevCryptos.map((crypto) =>
          crypto.shortName === shortName
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

    // For supported chains, update both address and crypto cards
    setInitialAdditionalCryptos((prevCryptos) => {
      const updatedCryptos = prevCryptos.map((crypto) =>
        crypto.shortName === shortName
          ? { ...crypto, address: newAddress }
          : crypto
      );

      AsyncStorage.setItem(
        "initialAdditionalCryptos",
        JSON.stringify(updatedCryptos)
      );

      setCryptoCards((prevCards) => {
        const updatedCards = prevCards.map((card) =>
          card.shortName === shortName ? { ...card, address: newAddress } : card
        );
        if (!prevCards.find((card) => card.shortName === shortName)) {
          updatedCards.push(
            updatedCryptos.find((crypto) => crypto.shortName === shortName)
          );
        }
        return updatedCards;
      });

      return updatedCryptos;
    });
  };

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

  const addCryptoCard = (chainName, walletAddress) => {
    setAddedCryptos((prevCards) => {
      const existingCard = prevCards.find(
        (card) => card.chainShortName === chainName
      );
      if (!existingCard) {
        const newCrypto = initialAdditionalCryptos.find(
          (crypto) => crypto.chainShortName === chainName
        );
        if (newCrypto) {
          return [
            ...prevCards,
            {
              name: newCrypto.name,
              shortName: newCrypto.shortName,
              balance: newCrypto.balance,
              icon: newCrypto.icon,
              cardImage: newCrypto.cardImage,
              address: walletAddress,
              chain: newCrypto.chain,
              chainShortName: newCrypto.chainShortName,
              chainIcon: newCrypto.chainIcon,
              queryChainShortName: newCrypto.queryChainShortName,
            },
          ];
        } else {
          console.warn(`No initial data found for chain: ${chainName}`);
        }
      }
      return prevCards;
    });
  };

  useEffect(() => {
    fetchAndStoreExchangeRates();
  }, []);

  const fetchAndStoreExchangeRates = async () => {
    try {
      const response = await fetch(NEW_EXCHANGE_RATE_API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.code === 0 && data.data) {
        setExchangeRates(data.data);
        await AsyncStorage.setItem("exchangeRates", JSON.stringify(data.data));
      } else {
        console.error("Failed to fetch exchange rates:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

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
        const screenLockPassword = await AsyncStorage.getItem(
          "screenLockPassword"
        );
        if (screenLockEnabled !== null)
          setIsScreenLockEnabled(JSON.parse(screenLockEnabled));
        if (screenLockPassword !== null)
          setScreenLockPassword(screenLockPassword);

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

  const toggleScreenLock = async (enabled) => {
    setIsAppLaunching(false);
    setIsScreenLockEnabled(enabled);
    await AsyncStorage.multiSet([
      ["screenLockEnabled", JSON.stringify(enabled)],
      ["isAppLaunching", JSON.stringify(false)],
    ]);
  };

  const changeScreenLockPassword = async (newPassword) => {
    setScreenLockPassword(newPassword);
    await AsyncStorage.setItem("screenLockPassword", newPassword);
  };

  useEffect(() => {
    const trxCrypto = initialAdditionalCryptosState.find(
      (crypto) => crypto.chainShortName === "TRX"
    );
    if (trxCrypto) {
      console.log(
        "TRX address in initialAdditionalCryptosState:",
        trxCrypto.address
      );
    } else {
      console.log("TRX address not found in initialAdditionalCryptosState.");
    }
    if (usdtCrypto.chainShortName === "TRX") {
      console.log("TRX address in usdtCrypto:", usdtCrypto.address);
    } else {
      console.log("TRX address not found in usdtCrypto.");
    }
  }, [initialAdditionalCryptosState]);

  return (
    <CryptoContext.Provider
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
        addCryptoCard,
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
      }}
    >
      <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </CryptoContext.Provider>
  );
};
