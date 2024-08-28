// cryptosData.js
export const initialAdditionalCryptos = [
  {
    name: "Bitcoin",
    shortName: "BTC",
    balance: "0.0",
    icon: require("../assets/icon/BTCIcon.png"),
    cardImage: require("../assets/Card3.png"),
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    chain: "Bitcoin",
    chainShortName: "BTC",
    queryChainShortName: "BTC", // 用于查询的字段
    chainIcon: require("../assets/icon/BTCIcon.png"),
    tokenType: "BTC", // 代币类型
    fee: "0.0001", // 手续费
    valueUsd: "0.0", // 总美元价值
    priceUsd: "30000.0", // 每个代币的美元价格
  },
  {
    name: "Ethereum",
    shortName: "ETH",
    balance: "0.0",
    icon: require("../assets/icon/ETHIcon.png"),
    cardImage: require("../assets/Card54.png"),
    address: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    chain: "Ethereum",
    chainShortName: "ETH",
    queryChainShortName: "ETH", // 用于查询的字段
    chainIcon: require("../assets/icon/ETHIcon.png"),
    tokenType: "ERC20", // 代币类型
    fee: "0.01", // 手续费
    valueUsd: "0.0", // 总美元价值
    priceUsd: "2000.0", // 每个代币的美元价格
  },
  {
    name: "USDT",
    shortName: "USDT",
    balance: "0.0",
    icon: require("../assets/USDTIcon.png"),
    cardImage: require("../assets/Card43.png"),
    address: "TXAq2qZCAdgAbQmbaYhx213P2JjhKQbbTZ",
    chain: "Tron",
    chainShortName: "TRX",
    queryChainShortName: "TRON", // 用于查询的字段
    chainIcon: require("../assets/icon/TRXIcon.png"),
    tokenType: "TRC20", // 代币类型
    fee: "2.0", // 手续费
    valueUsd: "0.0", // 总美元价值
    priceUsd: "1.0", // 每个代币的美元价格
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
    queryChainShortName: "LTC", // 用于查询的字段
    chainIcon: require("../assets/icon/LTCIcon.png"),
    tokenType: "LTC", // 代币类型
    fee: "0.001", // 手续费
    valueUsd: "0.0", // 总美元价值
    priceUsd: "150.0", // 每个代币的美元价格
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
    queryChainShortName: "BCH", // 用于查询的字段
    chainIcon: require("../assets/icon/BCHIcon.png"),
    tokenType: "BCH", // 代币类型
    fee: "0.001", // 手续费
    valueUsd: "0.0", // 总美元价值
    priceUsd: "300.0", // 每个代币的美元价格
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
    queryChainShortName: "ADA", // 用于查询的字段
    chainIcon: require("../assets/icon/ADAIcon.png"),
    tokenType: "ADA", // 代币类型
    fee: "0.17", // 手续费
    valueUsd: "0.0", // 总美元价值
    priceUsd: "1.5", // 每个代币的美元价格
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
    queryChainShortName: "DOT", // 用于查询的字段
    chainIcon: require("../assets/icon/DOTIcon.png"),
    tokenType: "DOT", // 代币类型
    fee: "0.01", // 手续费
    valueUsd: "0.0", // 总美元价值
    priceUsd: "4.5", // 每个代币的美元价格
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
    queryChainShortName: "ETH", // 用于查询的字段
    chainIcon: require("../assets/icon/ETHIcon.png"),
    tokenType: "ERC20", // 代币类型
    fee: "0.01", // 手续费
    valueUsd: "0.0", // 总美元价值
    priceUsd: "7.0", // 每个代币的美元价格
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
    queryChainShortName: "XLM", // 用于查询的字段
    chainIcon: require("../assets/icon/XLMIcon.png"),
    tokenType: "XLM", // 代币类型
    fee: "0.00001", // 手续费
    valueUsd: "2.0", // 总美元价值
    priceUsd: "0.3", // 每个代币的美元价格
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
    queryChainShortName: "DOGE", // 用于查询的字段
    chainIcon: require("../assets/icon/DOGEIcon.png"),
    tokenType: "DOGE", // 代币类型
    fee: "0.01", // 手续费
    valueUsd: "1.0", // 总美元价值
    priceUsd: "0.07", // 每个代币的美元价格
  },
];
