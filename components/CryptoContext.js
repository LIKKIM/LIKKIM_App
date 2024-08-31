// CryptoContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../config/i18n";
import { initialAdditionalCryptos } from "../config/cryptosData";
export const CryptoContext = createContext();
export const DarkModeContext = createContext();

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
  queryChainShortName: "TRON", // 用于查询的字段
  chainIcon: require("../assets/icon/TRXIcon.png"),
  tokenType: "TRC20", // 代币类型
  fee: "2.0", // 手续费
  valueUsd: "0.0", // 总美元价值
  priceUsd: "1.0", // 每个代币的美元价格
};

export const CryptoProvider = ({ children }) => {
  const [isScreenLockEnabled, setIsScreenLockEnabled] = useState(false);
  const [screenLockPassword, setScreenLockPassword] = useState("");
  const [cryptoCount, setCryptoCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState("USD");

  // 状态管理 initialAdditionalCryptos
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
  const handleUpdateCryptoCards = (newCrypto) => {
    setCryptoCards((prevCards) => {
      // 检查是否已存在相同的卡片
      const cardExists = prevCards.some(
        (card) =>
          card.shortName === newCrypto.shortName &&
          card.chainShortName === newCrypto.chainShortName
      );

      // 如果存在相同的卡片，用新卡片替换旧卡片
      if (cardExists) {
        return prevCards.map((card) =>
          card.shortName === newCrypto.shortName &&
          card.chainShortName === newCrypto.chainShortName
            ? newCrypto
            : card
        );
      }

      // 否则，将新卡片添加到列表中
      const updatedCards = [...prevCards, newCrypto];
      setAddedCryptos(updatedCards); // 更新 addedCryptos 状态
      return updatedCards;
    });
  };

  const updateCryptoData = (shortName, newData) => {
    setInitialAdditionalCryptos((prevCryptos) => {
      const updatedCryptos = prevCryptos.map((crypto) =>
        crypto.shortName === shortName ? { ...crypto, ...newData } : crypto
      );

      // 持久化更新后的数据
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

        // 载入 initialAdditionalCryptos 的状态
        const savedInitialCryptos = await AsyncStorage.getItem(
          "initialAdditionalCryptos"
        );
        if (savedInitialCryptos !== null) {
          setInitialAdditionalCryptos(JSON.parse(savedInitialCryptos));
        }
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

        // 持久化保存 initialAdditionalCryptos 的状态
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
    initialAdditionalCryptosState, // 监控这个状态的变化
  ]);

  // 切换锁屏状态
  const toggleScreenLock = async (enabled) => {
    setIsAppLaunching(false); // 先设置 isAppLaunching 为 false
    setIsScreenLockEnabled(enabled);
    await AsyncStorage.multiSet([
      ["screenLockEnabled", JSON.stringify(enabled)],
      ["isAppLaunching", JSON.stringify(false)], // 持久化 isAppLaunching 状态
    ]);
  };

  // 更改锁屏密码
  const changeScreenLockPassword = async (newPassword) => {
    setScreenLockPassword(newPassword);
    await AsyncStorage.setItem("screenLockPassword", newPassword);
  };

  // 在启动时打印 TRX 地址
  useEffect(() => {
    // 从 initialAdditionalCryptosState 查找 TRX 地址
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

    // 检查 usdtCrypto 中的 TRX 地址
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
        initialAdditionalCryptos: initialAdditionalCryptosState, // 提供更新后的 initialAdditionalCryptos
        setInitialAdditionalCryptos, // 提供 setInitialAdditionalCryptos
        additionalCryptos,
        setAdditionalCryptos,

        setAddedCryptos,
        addCryptoCard, // 提供 addCryptoCard 方法
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
      }}
    >
      <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </CryptoContext.Provider>
  );
};
