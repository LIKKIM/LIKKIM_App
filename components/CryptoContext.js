// CryptoContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../config/i18n";

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

const initialAdditionalCryptos = [
  {
    name: "Bitcoin",
    shortName: "BTC",
    balance: "0.0",
    icon: require("../assets/BitcoinIcon.png"),
    cardImage: require("../assets/Card3.png"),
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    chain: "Bitcoin",
    chainShortName: "BTC",
    chainIcon: require("../assets/icon/BTCIcon.png"), // Correct path for chain icon
  },
  {
    name: "Ethereum",
    shortName: "ETH",
    balance: "0.0",
    icon: require("../assets/EthereumIcon.png"),
    cardImage: require("../assets/Card54.png"),
    address: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    chain: "Ethereum",
    chainShortName: "ETH",
    chainIcon: require("../assets/icon/ETHIcon.png"), // Correct path for chain icon
  },
  {
    name: "USDT",
    shortName: "USDT",
    balance: "0.0",
    icon: require("../assets/USDTIcon.png"),
    cardImage: require("../assets/Card43.png"),
    address: "TZ7QDpUHbe6VLCv9bEPdAzrnNeu5zCuXg6",
    chain: "Tron",
    chainShortName: "TRX",
    chainIcon: require("../assets/icon/TRXIcon.png"), // Correct path for chain icon
  },
  {
    name: "Litecoin",
    shortName: "LTC",
    balance: "0.0",
    icon: require("../assets/LitecoinIcon.png"),
    cardImage: require("../assets/Card1.png"),
    address: "LcHKdCbbtGxDsN7BHyebDTrVKT4w3KpU5Z",
    chain: "Litecoin",
    chainShortName: "LTC",
    chainIcon: require("../assets/icon/LTCIcon.png"), // Correct path for chain icon
  },
  {
    name: "Bitcoin Cash",
    shortName: "BCH",
    balance: "0.0",
    icon: require("../assets/BitcoinCashIcon.png"),
    cardImage: require("../assets/Card2.png"),
    address: "qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
    chain: "Bitcoin Cash",
    chainShortName: "BCH",
    chainIcon: require("../assets/icon/BCHIcon.png"), // Correct path for chain icon
  },
  {
    name: "Cardano",
    shortName: "ADA",
    balance: "0.0",
    icon: require("../assets/CardanoIcon.png"),
    cardImage: require("../assets/Card5.png"),
    address: "DdzFFzCqrhsusgjmXKG9VeSvfhRUHqNNNLiFYB8HHR7",
    chain: "Cardano",
    chainShortName: "ADA",
    chainIcon: require("../assets/icon/ADAIcon.png"), // Correct path for chain icon
  },
  {
    name: "Polkadot",
    shortName: "DOT",
    balance: "0.0",
    icon: require("../assets/PolkadotIcon.png"),
    cardImage: require("../assets/Card6.png"),
    address: "14VSS98ov7KjJtyepigS65atjPjj73Fw4c8TyRjCnbhG",
    chain: "Polkadot",
    chainShortName: "DOT",
    chainIcon: require("../assets/icon/DOTIcon.png"), // Correct path for chain icon
  },
  {
    name: "Chainlink",
    shortName: "LINK",
    balance: "0.0",
    icon: require("../assets/ChainlinkIcon.png"),
    cardImage: require("../assets/Card7.png"),
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    chain: "Ethereum",
    chainShortName: "ETH",
    chainIcon: require("../assets/icon/ETHIcon.png"), // Correct path for chain icon
  },
  {
    name: "Stellar",
    shortName: "XLM",
    balance: "2.0",
    icon: require("../assets/StellarIcon.png"),
    cardImage: require("../assets/Card8.png"),
    address: "GAHPDQD4MGHVZFJYZN46EZB2XB4LGIOHBTVHQRJ7MF2PL4EY7I7U77CC",
    chain: "Stellar",
    chainShortName: "XLM",
    chainIcon: require("../assets/icon/XLMIcon.png"), // Correct path for chain icon
  },
  {
    name: "Dogecoin",
    shortName: "DOGE",
    balance: "1.0",
    icon: require("../assets/DogecoinIcon.png"),
    cardImage: require("../assets/Card9.png"),
    address: "D7Y55N4sFCw4KceCczPS3KhNWZ6o7pTPkd",
    chain: "Dogecoin",
    chainShortName: "DOGE",
    chainIcon: require("../assets/icon/DOGEIcon.png"), // Correct path for chain icon
  },
];

export const usdtCrypto = {
  name: "USDT",
  shortName: "USDT",
  balance: "0.0",
  icon: require("../assets/USDTIcon.png"),
  cardImage: require("../assets/Card43.png"),
  address: "TZ7QDpUHbe6VLCv9bEPdAzrnNeu5zCuXg6",
  chain: "Tron",
  chainShortName: "TRX",
  chainIcon: require("../assets/icon/TRXIcon.png"),
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

  const [addedCryptos, setAddedCryptos] = useState([]);
  const [isVerificationSuccessful, setIsVerificationSuccessful] =
    useState(false);
  const [verifiedDevices, setVerifiedDevices] = useState([]);

  const [isAppLaunching, setIsAppLaunching] = useState(true);

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
        addedCryptos,
        setAddedCryptos,
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
      }}
    >
      <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </CryptoContext.Provider>
  );
};
