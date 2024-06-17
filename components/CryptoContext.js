// CryptoContext.js
import React, { createContext, useState, useContext } from "react";

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
  },
  {
    name: "Ethereum",
    shortName: "ETH",
    balance: "1.0",
    icon: require("../assets/EthereumIcon.png"),
    cardImage: require("../assets/Card54.png"),
    address: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
  },
  {
    name: "USDT",
    shortName: "USDT",
    balance: "2.0",
    icon: require("../assets/USDTIcon.png"),
    cardImage: require("../assets/Card43.png"),
    address: "1KAt6STtisWMMVo5XGdos9P7DBNNsFfjx7",
  },
  {
    name: "Litecoin",
    shortName: "LTC",
    balance: "0.0",
    icon: require("../assets/LitecoinIcon.png"),
    cardImage: require("../assets/Card1.png"),
    address: "LcHKdCbbtGxDsN7BHyebDTrVKT4w3KpU5Z",
  },
  {
    name: "Bitcoin Cash",
    shortName: "BCH",
    balance: "0.0",
    icon: require("../assets/BitcoinCashIcon.png"),
    cardImage: require("../assets/Card2.png"),
    address: "qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
  },
  {
    name: "Dash",
    shortName: "DASH",
    balance: "0.0",
    icon: require("../assets/DashIcon.png"),
    cardImage: require("../assets/Card22.png"),
    address: "Xr3ar5bWQ5Me6EF1scu6P5tA7L5mje9XDL",
  },
  {
    name: "Cardano",
    shortName: "ADA",
    balance: "0.0",
    icon: require("../assets/CardanoIcon.png"),
    cardImage: require("../assets/Card5.png"),
    address: "DdzFFzCqrhsusgjmXKG9VeSvfhRUHqNNNLiFYB8HHR7",
  },
  {
    name: "Polkadot",
    shortName: "DOT",
    balance: "0.0",
    icon: require("../assets/PolkadotIcon.png"),
    cardImage: require("../assets/Card6.png"),
    address: "14VSS98ov7KjJtyepigS65atjPjj73Fw4c8TyRjCnbhG",
  },
  {
    name: "Chainlink",
    shortName: "LINK",
    balance: "0.0",
    icon: require("../assets/ChainlinkIcon.png"),
    cardImage: require("../assets/Card7.png"),
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
  },
  {
    name: "Stellar",
    shortName: "XLM",
    balance: "0.0",
    icon: require("../assets/StellarIcon.png"),
    cardImage: require("../assets/Card8.png"),
    address: "GAHPDQD4MGHVZFJYZN46EZB2XB4LGIOHBTVHQRJ7MF2PL4EY7I7U77CC",
  },
  {
    name: "Dogecoin",
    shortName: "DOGE",
    balance: "0.0",
    icon: require("../assets/DogecoinIcon.png"),
    cardImage: require("../assets/Card9.png"),
    address: "D7Y55N4sFCw4KceCczPS3KhNWZ6o7pTPkd",
  },
];
export const usdtCrypto = {
  name: "USDT",
  shortName: "USDT",
  balance: "2.0",
  icon: require("../assets/USDTIcon.png"),
  cardImage: require("../assets/Card43.png"),
  address: "1KAt6STtisWMMVo5XGdos9P7DBNNsFfjx7",
};
export const CryptoProvider = ({ children }) => {
  const [cryptoCount, setCryptoCount] = useState(0); // 初始为0
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState("USD");
  const [additionalCryptos, setAdditionalCryptos] = useState(
    initialAdditionalCryptos
  );
  const [addedCryptos, setAddedCryptos] = useState([]); // 用于跟踪已添加的加密货币

  return (
    <CryptoContext.Provider
      value={{
        cryptoCount,
        setCryptoCount,
        currencyUnit,
        setCurrencyUnit,
        currencies,
        additionalCryptos,
        setAdditionalCryptos,
        addedCryptos, // 确保提供 addedCryptos
        setAddedCryptos, // 确保提供修改 addedCryptos 的方法
      }}
    >
      <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </CryptoContext.Provider>
  );
};
