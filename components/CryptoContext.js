// CryptoContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../config/i18n";
import { initialAdditionalCryptos } from "../config/cryptosData";

export const CryptoContext = createContext();
export const DarkModeContext = createContext();

// 汇率API的URL
const EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

const currencies = [
  { name: "Australian Dollar", shortName: "AUD" },
  { name: "Bahraini Dinar", shortName: "BHD" },
  { name: "Bitcoin", shortName: "BTC" },
  { name: "Brazilian Real", shortName: "BRL" },
  { name: "British Pound", shortName: "GBP" },
  { name: "Canadian Dollar", shortName: "CAD" },
  { name: "Chilean Peso", shortName: "CLP" },
  { name: "Czech Koruna", shortName: "CZK" },
  { name: "Danish Krone", shortName: "DKK" },
  { name: "Emirati Dirham", shortName: "AED" },
  { name: "Ethereum", shortName: "ETH" },
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
  { name: "Yuan or Chinese Renminbi", shortName: "CNY" },
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
  const [transactionHistory, setTransactionHistory] = useState([]); // 新增交易历史状态

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
  const [exchangeRates, setExchangeRates] = useState({}); // 添加汇率状态

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

  // 更新加密货币地址的函数
  const updateCryptoAddress = (shortName, newAddress) => {
    // 更新 initialAdditionalCryptos 的地址
    setInitialAdditionalCryptos((prevCryptos) => {
      // 只更新对应的加密货币卡片
      const updatedCryptos = prevCryptos.map((crypto) =>
        crypto.shortName === shortName
          ? { ...crypto, address: newAddress } // 只更新指定的 shortName 地址
          : crypto
      );

      // 持久化更新后的数据到 AsyncStorage
      AsyncStorage.setItem(
        "initialAdditionalCryptos",
        JSON.stringify(updatedCryptos)
      );

      // 更新 cryptoCards
      setCryptoCards((prevCards) => {
        // 找到对应 shortName 卡片并更新
        const updatedCards = prevCards.map((card) =>
          card.shortName === shortName
            ? { ...card, address: newAddress } // 只更新对应 shortName 的卡片
            : card
        );

        // 如果该卡片之前没有存在，则添加它
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
          const updatedCards = [
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
          return updatedCards;
        } else {
          console.warn(`未找到 ${chainName} 的初始加密货币信息`);
        }
      }
      return prevCards;
    });
  };

  // 汇率获取函数
  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(EXCHANGE_RATE_API_URL);
      const data = await response.json();
      setExchangeRates(data.rates); // 保存汇率数据
      await AsyncStorage.setItem("exchangeRates", JSON.stringify(data.rates)); // 保存到AsyncStorage
      //  console.log("最新汇率: ", data.rates);
    } catch (error) {
      console.error("获取汇率数据失败: ", error);
    }
  };

  // 加载本地存储的汇率数据
  const loadExchangeRates = async () => {
    try {
      const savedRates = await AsyncStorage.getItem("exchangeRates");
      if (savedRates !== null) {
        setExchangeRates(JSON.parse(savedRates)); // 从本地加载汇率
      }
    } catch (error) {
      console.error("加载汇率数据失败: ", error);
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
        console.error("加载交易历史失败:", error);
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
        console.error("保存交易历史失败:", error);
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
        console.error("Error saving addedCryptos: ", error);
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
          setAddedCryptos(JSON.parse(savedCryptos));
          setCryptoCount(JSON.parse(savedCryptos).length);
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

        // 加载本地汇率数据
        await loadExchangeRates();
      } catch (error) {
        console.error("Error loading settings: ", error);
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
        console.error("Error saving settings: ", error);
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

  // 每小时更新汇率
  useEffect(() => {
    fetchExchangeRates(); // 初次加载时获取汇率
    const intervalId = setInterval(fetchExchangeRates, 3600000); // 每小时更新汇率
    return () => clearInterval(intervalId); // 清理定时器
  }, []);

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
        "initialAdditionalCryptosState 中的 TRX 地址:",
        trxCrypto.address
      );
    } else {
      console.log("initialAdditionalCryptosState 中的 TRX 地址未找到。");
    }

    if (usdtCrypto.chainShortName === "TRX") {
      console.log("usdtCrypto 中的 TRX 地址:", usdtCrypto.address);
    } else {
      console.log("usdtCrypto 中的 TRX 地址未找到。");
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
        exchangeRates, // 提供汇率数据
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
