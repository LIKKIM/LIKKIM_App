/**
 * DeviceContext.js
 * 本文件函数说明（定义与使用）：
 *
 * updateCryptoAddress：根据链名更新加密货币地址，支持链和非支持链分别处理，涉及本地存储和内存状态同步。
 * updateDevicePubHintKey：根据链名更新加密货币的公钥，并持久化到本地存储。
 * updateCryptoData：更新支持链的加密货币数据（如余额、地址等），并同步到本地存储。
 * fetchAndStoreConvertRates：从远程API获取最新汇率数据，并存储到本地。
 * toggleScreenLock：切换屏幕锁定功能的开关状态，并同步到本地存储。
 * changeScreenLockPassword：更改屏幕锁定密码，并保存到本地存储。
 * useEffect（加载交易历史）：组件挂载时从本地存储加载交易历史到内存。
 * useEffect（保存交易历史）：交易历史变更时自动保存到本地存储。
 * useEffect（保存addedCryptos）：addedCryptos变更时自动保存到本地存储。
 * useEffect（加载用户设置）：组件挂载时加载深色模式、货币单位、语言、已添加币种、验证状态、设备、屏幕锁等用户设置。
 * useEffect（保存用户设置）：相关设置变更时自动保存到本地存储。
 * useEffect（获取汇率）：组件挂载时自动获取最新汇率。
 *
 * 外部依赖函数/对象说明：
 * AsyncStorage：用于本地数据的持久化存储和读取。
 * i18n：用于多语言切换。
 * BleManager：蓝牙设备管理实例。
 * fetch：用于网络请求，获取远程数据。
 */

import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../config/i18n";
import { initialAdditionalCryptos } from "../config/assetInfo";
import currencies from "../config/currencies";
import { metricsAPII } from "../env/apiEndpoints";
import { BleManager } from "react-native-ble-plx";

// Create contexts
export const DeviceContext = createContext();
export const DarkModeContext = createContext();

// API URL for fetching exchange rates
const NEW_EXCHANGE_RATE_API_URL = metricsAPII.exchangeRate;

export const CryptoProvider = ({ children }) => {
  // 全局唯一BleManager实例
  const bleManagerRef = useRef(null);
  if (bleManagerRef.current === null) {
    bleManagerRef.current = new BleManager();
  }
  // State definitions
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isScreenLockEnabled, setIsScreenLockEnabled] = useState(false);
  const [screenLockPassword, setScreenLockPassword] = useState("");
  const [cryptoCount, setCryptoCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState("USD");
  const [ActivityLog, setActivityLog] = useState([]);
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
  const [exchangeRates, setConvertRates] = useState({});

  // Supported chains for address updates
  const supportedChains = ["ETH", "BTC", "SOL", "TRX"];

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
  const updateDevicePubHintKey = (queryChainName, publicKey) => {
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
  const fetchAndStoreConvertRates = async () => {
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
        setConvertRates(flattenedData);
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
    const loadActivityLog = async () => {
      try {
        const history = await AsyncStorage.getItem("ActivityLog");
        if (history !== null) {
          setActivityLog(JSON.parse(history));
        }
      } catch (error) {
        console.error("Failed to load transaction history:", error);
      }
    };
    loadActivityLog();
  }, []);

  // Save transaction history on change
  useEffect(() => {
    const saveActivityLog = async () => {
      try {
        await AsyncStorage.setItem("ActivityLog", JSON.stringify(ActivityLog));
      } catch (error) {
        console.error("Failed to save transaction history:", error);
      }
    };
    if (ActivityLog.length > 0) {
      saveActivityLog();
    }
  }, [ActivityLog]);

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
    fetchAndStoreConvertRates();
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        bleManagerRef, // 全局唯一BleManager实例
        verificationStatus,
        setVerificationStatus,
        updateCryptoData,
        cryptoCount,
        setCryptoCount,
        currencyUnit,
        setCurrencyUnit,
        currencies,
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
        exchangeRates,
        ActivityLog,
        setActivityLog,
        updateDevicePubHintKey,
      }}
    >
      <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </DeviceContext.Provider>
  );
};

export default CryptoProvider;
