// cryptosData.js
// Bitcoin, Ethereum, BNB Smart Chain, Polygon, Fantom, Arbitrum, Avalanche, Huobi ECO Chain, OKX Chain, Cardano, Optimism, Gnosis Chain, zkSync Era Mainnet, Linea, Mantle, Ethereum Classic, EthereumPoW, Base, Boba Network, Celo, Tron, Solana, Ripple, SUI, Aptos,Secret Network, Kasp, Kusama, Astar, Litecoin,Manta Atlantic, Manta Pacific Mainnet, Mixin Virtual Machine，Monero (XMR), Near (NEAR), Nervos (CKB), Neurai (XNA), Nexa (NEXA), OctaSpace (OCTA), Cosmos (ATOM)/Cronos (CRO)/Crypto.org (CRO)/DIS CHAIN (DIS)/Juno (JUNO), Dogecoin (DOGE), Dynex (DNX), Fetch.ai (FET), Filecoin (FIL)/Filecoin FEVM (FIL), IoTeX Network Mainnet (IOTX), Joystream (JOY), Conflux (CFX)/Conflux eSpace (CFX), Algorand (ALGO), Akash (AKT), Aurora (AURORA), Bitcoin Cash (BCH), Blast (BLAST), Celestia (TIA), opBNB, Osmosis, PulseChain, Polygon Zkevm, Ronin, Scroll, Taiko, WEMIX3.0, zkLink Nova, Zora, ZetaChain, Zircuit, Bitcoin Testnet, Bitcoin Signet, Ethereum Sepolia Testnet, Garnet Holesky, Lightning Network Testnet, Endurance, Flare, Harmony, Moonbeam, Mobe, Metis, Merlin, Nostr, Klaytn, Kava, Dymension, B2 Mainnet, BounceBit, Bitlayer, BOB, Cyber

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
    icon: require("../assets/icon/DOTIcon.png"),
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
  /* {
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
  }, */
  {
    name: "Dogecoin",
    shortName: "DOGE",
    balance: "1.0",
    icon: require("../assets/icon/DOGEIcon.png"),
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
  // 新增卡片，部分资源已注释

  // Polygon (MATIC)
  {
    name: "Polygon",
    shortName: "MATIC",
    balance: "0.0",
    icon: require("../assets/icon/PolygonIcon.png"),
    cardImage: require("../assets/Card7.png"),
    address: "0xxyz...",
    chain: "Polygon",
    chainShortName: "MATIC",
    queryChainShortName: "MATIC",
    chainIcon: require("../assets/icon/PolygonIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },
  {
    name: "Solana",
    shortName: "SOL",
    balance: "0.0",
    icon: require("../assets/icon/SOLIcon.png"),
    cardImage: require("../assets/Card8.png"),
    address: "sol1xyz...",
    chain: "Solana",
    chainShortName: "SOL",
    queryChainShortName: "SOL",
    chainIcon: require("../assets/icon/SOLIcon.png"),
    tokenType: "SOL",
    fee: "0.00001",
    valueUsd: "0.0",
    priceUsd: "25.0",
  },

  // BNB Smart Chain (BEP20)
  {
    name: "BNB",
    shortName: "BNB",
    balance: "0.0",
    icon: require("../assets/icon/BNBIcon.png"),
    // cardImage: require("../assets/CardBNB.png"),
    address: "bnb1xyz...",
    chain: "BNB Smart Chain",
    chainShortName: "BNB",
    queryChainShortName: "BNB",
    chainIcon: require("../assets/icon/BNBIcon.png"),
    tokenType: "BEP20",
    fee: "0.005",
    valueUsd: "0.0",
    priceUsd: "300.0",
  },

  // Fantom (FTM)
  {
    name: "Fantom",
    shortName: "FTM",
    balance: "0.0",
    icon: require("../assets/icon/FTMIcon.png"),
    // cardImage: require("../assets/CardFantom.png"),
    address: "0xxyz...",
    chain: "Fantom",
    chainShortName: "FTM",
    queryChainShortName: "FTM",
    chainIcon: require("../assets/icon/FTMIcon.png"),
    tokenType: "ERC20",
    fee: "0.01",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Avalanche (AVAX)
  {
    name: "Avalanche",
    shortName: "AVAX",
    balance: "0.0",
    icon: require("../assets/icon/AVAXIcon.png"),
    // cardImage: require("../assets/CardAvalanche.png"),
    address: "avax1xyz...",
    chain: "Avalanche",
    chainShortName: "AVAX",
    queryChainShortName: "AVAX",
    chainIcon: require("../assets/icon/AVAXIcon.png"),
    tokenType: "AVAX",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "10.0",
  },

  // Tron (TRX)
  {
    name: "Tron",
    shortName: "TRX",
    balance: "0.0",
    icon: require("../assets/icon/TRXIcon.png"),
    // cardImage: require("../assets/CardTron.png"),
    address: "Txyz...",
    chain: "Tron",
    chainShortName: "TRX",
    queryChainShortName: "TRX",
    chainIcon: require("../assets/icon/TRXIcon.png"),
    tokenType: "TRC20",
    fee: "0.1",
    valueUsd: "0.0",
    priceUsd: "0.05",
  },

  // Arbitrum (ARB)
  {
    name: "Arbitrum",
    shortName: "ARB",
    balance: "0.0",
    icon: require("../assets/icon/ARBIcon.png"),
    // cardImage: require("../assets/CardArbitrum.png"),
    address: "0xxyz...",
    chain: "Arbitrum",
    chainShortName: "ARB",
    queryChainShortName: "ARB",
    chainIcon: require("../assets/icon/ARBIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.2",
  },

  // Huobi ECO Chain (HT)
  {
    name: "Huobi Token",
    shortName: "HT",
    balance: "0.0",
    icon: require("../assets/icon/HTIcon.png"),
    // cardImage: require("../assets/CardHuobi.png"),
    address: "0xxyz...",
    chain: "Huobi ECO Chain",
    chainShortName: "HT",
    queryChainShortName: "HT",
    chainIcon: require("../assets/icon/HTIcon.png"),
    tokenType: "ERC20",
    fee: "0.002",
    valueUsd: "0.0",
    priceUsd: "7.0",
  },

  // OKX Chain (OKB)
  {
    name: "OKB",
    shortName: "OKB",
    balance: "0.0",
    icon: require("../assets/icon/OKBIcon.png"),
    // cardImage: require("../assets/CardOKB.png"),
    address: "0xxyz...",
    chain: "OKX Chain",
    chainShortName: "OKB",
    queryChainShortName: "OKB",
    chainIcon: require("../assets/icon/OKBIcon.png"),
    tokenType: "ERC20",
    fee: "0.003",
    valueUsd: "0.0",
    priceUsd: "20.0",
  },

  // Optimism (OP)
  {
    name: "Optimism",
    shortName: "OP",
    balance: "0.0",
    icon: require("../assets/icon/OPIcon.png"),
    // cardImage: require("../assets/CardOptimism.png"),
    address: "0xxyz...",
    chain: "Optimism",
    chainShortName: "OP",
    queryChainShortName: "OP",
    chainIcon: require("../assets/icon/OPIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "2.0",
  },

  // Gnosis Chain (GNO)
  {
    name: "Gnosis",
    shortName: "GNO",
    balance: "0.0",
    icon: require("../assets/icon/GNOIcon.png"),
    // cardImage: require("../assets/CardGnosis.png"),
    address: "0xxyz...",
    chain: "Gnosis Chain",
    chainShortName: "GNO",
    queryChainShortName: "GNO",
    chainIcon: require("../assets/icon/GNOIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "100.0",
  },

  // zkSync Era Mainnet (ZKS)
  {
    name: "zkSync",
    shortName: "ZKS",
    balance: "0.0",
    // icon: require("../assets/icon/ZKSIcon.png"),
    // cardImage: require("../assets/CardZKS.png"),
    address: "0xxyz...",
    chain: "zkSync Era Mainnet",
    chainShortName: "ZKS",
    queryChainShortName: "ZKS",
    // chainIcon: require("../assets/icon/ZKSIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Linea (LINA)
  {
    name: "Linea",
    shortName: "LINA",
    balance: "0.0",
    // icon: require("../assets/icon/LINAIcon.png"),
    // cardImage: require("../assets/CardLinea.png"),
    address: "0xxyz...",
    chain: "Linea",
    chainShortName: "LINA",
    queryChainShortName: "LINA",
    // chainIcon: require("../assets/icon/LINAIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.3",
  },

  // Mantle (MNT)
  {
    name: "Mantle",
    shortName: "MNT",
    balance: "0.0",
    icon: require("../assets/icon/MNTIcon.png"),
    // cardImage: require("../assets/CardMantle.png"),
    address: "0xxyz...",
    chain: "Mantle",
    chainShortName: "MNT",
    queryChainShortName: "MNT",
    chainIcon: require("../assets/icon/MNTIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.4",
  },

  // Ethereum Classic (ETC)
  {
    name: "Ethereum Classic",
    shortName: "ETC",
    balance: "0.0",
    icon: require("../assets/icon/ETCIcon.png"),
    // cardImage: require("../assets/CardETC.png"),
    address: "0xxyz...",
    chain: "Ethereum Classic",
    chainShortName: "ETC",
    queryChainShortName: "ETC",
    chainIcon: require("../assets/icon/ETCIcon.png"),
    tokenType: "ETC",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "15.0",
  },
  // Base (BASE)
  {
    name: "Base",
    shortName: "BASE",
    balance: "0.0",
    // icon: require("../assets/icon/BASEIcon.png"),
    // cardImage: require("../assets/CardBase.png"),
    address: "0xxyz...",
    chain: "Base",
    chainShortName: "BASE",
    queryChainShortName: "BASE",
    // chainIcon: require("../assets/icon/BASEIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Ripple (XRP)
  {
    name: "Ripple",
    shortName: "XRP",
    balance: "0.0",
    icon: require("../assets/icon/XRPIcon.png"),
    // cardImage: require("../assets/CardRipple.png"),
    address: "rxyz...",
    chain: "Ripple",
    chainShortName: "XRP",
    queryChainShortName: "XRP",
    chainIcon: require("../assets/icon/XRPIcon.png"),
    tokenType: "XRP",
    fee: "0.00001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // SUI (SUI)
  {
    name: "SUI",
    shortName: "SUI",
    balance: "0.0",
    icon: require("../assets/icon/SUIIcon.png"),
    // cardImage: require("../assets/CardSUI.png"),
    address: "sui1xyz...",
    chain: "SUI",
    chainShortName: "SUI",
    queryChainShortName: "SUI",
    chainIcon: require("../assets/icon/SUIIcon.png"),
    tokenType: "SUI",
    fee: "0.00001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Aptos (APT)
  {
    name: "Aptos",
    shortName: "APT",
    balance: "0.0",
    icon: require("../assets/icon/APTIcon.png"),
    // cardImage: require("../assets/CardAptos.png"),
    address: "aptos1xyz...",
    chain: "Aptos",
    chainShortName: "APT",
    queryChainShortName: "APT",
    chainIcon: require("../assets/icon/APTIcon.png"),
    tokenType: "APT",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "7.0",
  },
  // Monero (XMR)
  {
    name: "Monero",
    shortName: "XMR",
    balance: "0.0",
    icon: require("../assets/icon/XMRIcon.png"),
    // cardImage: require("../assets/CardMonero.png"),
    address: "43xyz...",
    chain: "Monero",
    chainShortName: "XMR",
    queryChainShortName: "XMR",
    chainIcon: require("../assets/icon/XMRIcon.png"),
    tokenType: "XMR",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "150.0",
  },

  // Kusama (KSM)
  {
    name: "Kusama",
    shortName: "KSM",
    balance: "0.0",
    icon: require("../assets/icon/KSMIcon.png"),
    // cardImage: require("../assets/CardKusama.png"),
    address: "kusama1xyz...",
    chain: "Kusama",
    chainShortName: "KSM",
    queryChainShortName: "KSM",
    chainIcon: require("../assets/icon/KSMIcon.png"),
    tokenType: "KSM",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "20.0",
  },

  // Astar (ASTR)
  {
    name: "Astar",
    shortName: "ASTR",
    balance: "0.0",
    icon: require("../assets/icon/ASTRIcon.png"),
    // cardImage: require("../assets/CardAstar.png"),
    address: "astar1xyz...",
    chain: "Astar",
    chainShortName: "ASTR",
    queryChainShortName: "ASTR",
    chainIcon: require("../assets/icon/ASTRIcon.png"),
    tokenType: "ASTR",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.1",
  },
  // Filecoin (FIL)
  {
    name: "Filecoin",
    shortName: "FIL",
    balance: "0.0",
    icon: require("../assets/icon/FILIcon.png"),
    // cardImage: require("../assets/CardFilecoin.png"),
    address: "fxyz...",
    chain: "Filecoin",
    chainShortName: "FIL",
    queryChainShortName: "FIL",
    chainIcon: require("../assets/icon/FILIcon.png"),
    tokenType: "FIL",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "5.0",
  },

  // Cosmos (ATOM)
  {
    name: "Cosmos",
    shortName: "ATOM",
    balance: "0.0",
    icon: require("../assets/icon/ATOMIcon.png"),
    // cardImage: require("../assets/CardCosmos.png"),
    address: "cosmos1xyz...",
    chain: "Cosmos",
    chainShortName: "ATOM",
    queryChainShortName: "ATOM",
    chainIcon: require("../assets/icon/ATOMIcon.png"),
    tokenType: "ATOM",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "10.0",
  },
  // Cronos (CRO)
  {
    name: "Cronos",
    shortName: "CRO",
    balance: "0.0",
    icon: require("../assets/icon/CronosIcon.png"),
    // cardImage: require("../assets/CardCronos.png"),
    address: "cro1xyz...",
    chain: "Cronos",
    chainShortName: "CRO",
    queryChainShortName: "CRO",
    chainIcon: require("../assets/icon/CronosIcon.png"),
    tokenType: "ERC20",
    fee: "0.01",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Crypto.org (CRO)
  {
    name: "Crypto.org",
    shortName: "CRO",
    balance: "0.0",
    // icon: require("../assets/icon/CROIcon.png"),
    // cardImage: require("../assets/CardCryptoOrg.png"),
    address: "cro1xyz...",
    chain: "Crypto.org",
    chainShortName: "CRO",
    queryChainShortName: "CRO",
    // chainIcon: require("../assets/icon/CROIcon.png"),
    tokenType: "CRO",
    fee: "0.01",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // DIS CHAIN (DIS)
  {
    name: "DIS CHAIN",
    shortName: "DIS",
    balance: "0.0",
    // icon: require("../assets/icon/DISIcon.png"),
    // cardImage: require("../assets/CardDIS.png"),
    address: "dis1xyz...",
    chain: "DIS CHAIN",
    chainShortName: "DIS",
    queryChainShortName: "DIS",
    // chainIcon: require("../assets/icon/DISIcon.png"),
    tokenType: "DIS",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.1",
  },
  // Juno (JUNO)
  {
    name: "Juno",
    shortName: "JUNO",
    balance: "0.0",
    icon: require("../assets/icon/JUNOIcon.png"),
    // cardImage: require("../assets/CardJuno.png"),
    address: "juno1xyz...",
    chain: "Juno",
    chainShortName: "JUNO",
    queryChainShortName: "JUNO",
    chainIcon: require("../assets/icon/JUNOIcon.png"),
    tokenType: "JUNO",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // Dynex (DNX)
  {
    name: "Dynex",
    shortName: "DNX",
    balance: "0.0",
    // icon: require("../assets/icon/DNXIcon.png"),
    // cardImage: require("../assets/CardDynex.png"),
    address: "dnx1xyz...",
    chain: "Dynex",
    chainShortName: "DNX",
    queryChainShortName: "DNX",
    // chainIcon: require("../assets/icon/DNXIcon.png"),
    tokenType: "DNX",
    fee: "0.0001",
    valueUsd: "0.0",
    priceUsd: "0.2",
  },

  // Fetch.ai (FET)
  {
    name: "Fetch.ai",
    shortName: "FET",
    balance: "0.0",
    // icon: require("../assets/icon/FETIcon.png"),
    // cardImage: require("../assets/CardFetch.png"),
    address: "fet1xyz...",
    chain: "Fetch.ai",
    chainShortName: "FET",
    queryChainShortName: "FET",
    // chainIcon: require("../assets/icon/FETIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.4",
  },

  // Filecoin FEVM (FIL)
  {
    name: "Filecoin FEVM",
    shortName: "FIL",
    balance: "0.0",
    // icon: require("../assets/icon/FILIcon.png"),
    // cardImage: require("../assets/CardFilecoinFEVM.png"),
    address: "fil1xyz...",
    chain: "Filecoin FEVM",
    chainShortName: "FIL",
    queryChainShortName: "FIL",
    // chainIcon: require("../assets/icon/FILIcon.png"),
    tokenType: "FIL",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "5.0",
  },

  // IoTeX Network Mainnet (IOTX)
  {
    name: "IoTeX",
    shortName: "IOTX",
    balance: "0.0",
    icon: require("../assets/icon/IOTXIcon.png"),
    // cardImage: require("../assets/CardIoTeX.png"),
    address: "io1xyz...",
    chain: "IoTeX Network Mainnet",
    chainShortName: "IOTX",
    queryChainShortName: "IOTX",
    chainIcon: require("../assets/icon/IOTXIcon.png"),
    tokenType: "IOTX",
    fee: "0.01",
    valueUsd: "0.0",
    priceUsd: "0.05",
  },

  // Joystream (JOY)
  {
    name: "Joystream",
    shortName: "JOY",
    balance: "0.0",
    // icon: require("../assets/icon/JOYIcon.png"),
    // cardImage: require("../assets/CardJoystream.png"),
    address: "joy1xyz...",
    chain: "Joystream",
    chainShortName: "JOY",
    queryChainShortName: "JOY",
    // chainIcon: require("../assets/icon/JOYIcon.png"),
    tokenType: "JOY",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.2",
  },

  // Conflux (CFX)
  {
    name: "Conflux",
    shortName: "CFX",
    balance: "0.0",
    icon: require("../assets/icon/CFXIcon.png"),
    // cardImage: require("../assets/CardConflux.png"),
    address: "cfx1xyz...",
    chain: "Conflux",
    chainShortName: "CFX",
    queryChainShortName: "CFX",
    chainIcon: require("../assets/icon/CFXIcon.png"),
    tokenType: "CFX",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.2",
  },

  // Conflux eSpace (CFX)
  {
    name: "Conflux eSpace",
    shortName: "CFX",
    balance: "0.0",
    // icon: require("../assets/icon/CFXIcon.png"),
    // cardImage: require("../assets/CardConfluxESpace.png"),
    address: "cfx1xyz...",
    chain: "Conflux eSpace",
    chainShortName: "CFX",
    queryChainShortName: "CFX",
    // chainIcon: require("../assets/icon/CFXIcon.png"),
    tokenType: "CFX",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.2",
  },

  // Algorand (ALGO)
  {
    name: "Algorand",
    shortName: "ALGO",
    balance: "0.0",
    icon: require("../assets/icon/ALGOIcon.png"),
    // cardImage: require("../assets/CardAlgorand.png"),
    address: "algo1xyz...",
    chain: "Algorand",
    chainShortName: "ALGO",
    queryChainShortName: "ALGO",
    chainIcon: require("../assets/icon/ALGOIcon.png"),
    tokenType: "ALGO",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Akash (AKT)
  {
    name: "Akash",
    shortName: "AKT",
    balance: "0.0",
    icon: require("../assets/icon/AKTIcon.png"),
    // cardImage: require("../assets/CardAkash.png"),
    address: "akt1xyz...",
    chain: "Akash",
    chainShortName: "AKT",
    queryChainShortName: "AKT",
    chainIcon: require("../assets/icon/AKTIcon.png"),
    tokenType: "AKT",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.8",
  },

  // Aurora (AURORA)
  {
    name: "Aurora",
    shortName: "AURORA",
    balance: "0.0",
    icon: require("../assets/icon/AURORAIcon.png"),
    // cardImage: require("../assets/CardAurora.png"),
    address: "aurora1xyz...",
    chain: "Aurora",
    chainShortName: "AURORA",
    queryChainShortName: "AURORA",
    chainIcon: require("../assets/icon/AURORAIcon.png"),
    tokenType: "AURORA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.3",
  },
  // Blast (BLAST)
  {
    name: "Blast",
    shortName: "BLAST",
    balance: "0.0",
    // icon: require("../assets/icon/BLASTIcon.png"),
    // cardImage: require("../assets/CardBlast.png"),
    address: "blast1xyz...",
    chain: "Blast",
    chainShortName: "BLAST",
    queryChainShortName: "BLAST",
    // chainIcon: require("../assets/icon/BLASTIcon.png"),
    tokenType: "BLAST",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.05",
  },
  // Celestia (TIA)
  {
    name: "Celestia",
    shortName: "TIA",
    balance: "0.0",
    icon: require("../assets/icon/TIAIcon.png"),
    // cardImage: require("../assets/CardCelestia.png"),
    address: "tia1xyz...",
    chain: "Celestia",
    chainShortName: "TIA",
    queryChainShortName: "TIA",
    chainIcon: require("../assets/icon/TIAIcon.png"),
    tokenType: "TIA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },
  // EthereumPoW (ETHW)
  {
    name: "EthereumPoW",
    shortName: "ETHW",
    balance: "0.0",
    icon: require("../assets/icon/ETHWIcon.png"),
    // cardImage: require("../assets/CardETHW.png"),
    address: "0xxyz...",
    chain: "EthereumPoW",
    chainShortName: "ETHW",
    queryChainShortName: "ETHW",
    chainIcon: require("../assets/icon/ETHWIcon.png"),
    tokenType: "ETHW",
    fee: "0.01",
    valueUsd: "0.0",
    priceUsd: "3.0",
  },

  // Boba Network (BOBA)
  {
    name: "Boba Network",
    shortName: "BOBA",
    balance: "0.0",
    // icon: require("../assets/icon/BOBAIcon.png"),
    // cardImage: require("../assets/CardBoba.png"),
    address: "0xxyz...",
    chain: "Boba Network",
    chainShortName: "BOBA",
    queryChainShortName: "BOBA",
    // chainIcon: require("../assets/icon/BOBAIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.3",
  },

  // Celo (CELO)
  {
    name: "Celo",
    shortName: "CELO",
    balance: "0.0",
    icon: require("../assets/icon/CELOIcon.png"),
    // cardImage: require("../assets/CardCelo.png"),
    address: "0xxyz...",
    chain: "Celo",
    chainShortName: "CELO",
    queryChainShortName: "CELO",
    chainIcon: require("../assets/icon/CELOIcon.png"),
    tokenType: "ERC20",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "2.0",
  },

  // Starcoin (STC)
  {
    name: "Starcoin",
    shortName: "STC",
    balance: "0.0",
    // icon: require("../assets/icon/STCIcon.png"),
    // cardImage: require("../assets/CardStarcoin.png"),
    address: "stc1xyz...",
    chain: "Starcoin",
    chainShortName: "STC",
    queryChainShortName: "STC",
    // chainIcon: require("../assets/icon/STCIcon.png"),
    tokenType: "STC",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.05",
  },

  // Secret Network (SCRT)
  {
    name: "Secret Network",
    shortName: "SCRT",
    balance: "0.0",
    icon: require("../assets/icon/SCRTIcon.png"),
    // cardImage: require("../assets/CardSecret.png"),
    address: "scrt1xyz...",
    chain: "Secret Network",
    chainShortName: "SCRT",
    queryChainShortName: "SCRT",
    chainIcon: require("../assets/icon/SCRTIcon.png"),
    tokenType: "SCRT",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // Kasp (KAS)
  {
    name: "Kasp",
    shortName: "KAS",
    balance: "0.0",
    icon: require("../assets/icon/KASIcon.png"),
    // cardImage: require("../assets/CardKasp.png"),
    address: "kas1xyz...",
    chain: "Kasp",
    chainShortName: "KAS",
    queryChainShortName: "KAS",
    chainIcon: require("../assets/icon/KASIcon.png"),
    tokenType: "KAS",
    fee: "0.0001",
    valueUsd: "0.0",
    priceUsd: "0.02",
  },

  // Manta Atlantic
  {
    name: "Manta Atlantic",
    shortName: "MANTA",
    balance: "0.0",
    // icon: require("../assets/icon/MANTAIcon.png"),
    // cardImage: require("../assets/CardMantaAtlantic.png"),
    address: "manta1xyz...",
    chain: "Manta Atlantic",
    chainShortName: "MANTA",
    queryChainShortName: "MANTA",
    // chainIcon: require("../assets/icon/MANTAIcon.png"),
    tokenType: "MANTA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.2",
  },

  // Manta Pacific Mainnet
  {
    name: "Manta Pacific Mainnet",
    shortName: "MANTA",
    balance: "0.0",
    // icon: require("../assets/icon/MANTAIcon.png"),
    // cardImage: require("../assets/CardMantaPacific.png"),
    address: "manta1xyz...",
    chain: "Manta Pacific Mainnet",
    chainShortName: "MANTA",
    queryChainShortName: "MANTA",
    // chainIcon: require("../assets/icon/MANTAIcon.png"),
    tokenType: "MANTA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.2",
  },

  // Mixin Virtual Machine (MVM)
  {
    name: "Mixin Virtual Machine",
    shortName: "MVM",
    balance: "0.0",
    // icon: require("../assets/icon/MVMIcon.png"),
    // cardImage: require("../assets/CardMixin.png"),
    address: "mvm1xyz...",
    chain: "Mixin Virtual Machine",
    chainShortName: "MVM",
    queryChainShortName: "MVM",
    // chainIcon: require("../assets/icon/MVMIcon.png"),
    tokenType: "MVM",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.1",
  },

  // Near (NEAR)
  {
    name: "Near",
    shortName: "NEAR",
    balance: "0.0",
    icon: require("../assets/icon/NEARIcon.png"),
    // cardImage: require("../assets/CardNear.png"),
    address: "near1xyz...",
    chain: "Near",
    chainShortName: "NEAR",
    queryChainShortName: "NEAR",
    chainIcon: require("../assets/icon/NEARIcon.png"),
    tokenType: "NEAR",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // Nervos (CKB)
  {
    name: "Nervos",
    shortName: "CKB",
    balance: "0.0",
    icon: require("../assets/icon/NervosIcon.png"),
    // cardImage: require("../assets/CardNervos.png"),
    address: "ckb1xyz...",
    chain: "Nervos",
    chainShortName: "CKB",
    queryChainShortName: "CKB",
    chainIcon: require("../assets/icon/NervosIcon.png"),
    tokenType: "CKB",
    fee: "0.0001",
    valueUsd: "0.0",
    priceUsd: "0.02",
  },

  // Neurai (XNA)
  {
    name: "Neurai",
    shortName: "XNA",
    balance: "0.0",
    // icon: require("../assets/icon/XNAIcon.png"),
    // cardImage: require("../assets/CardNeurai.png"),
    address: "xna1xyz...",
    chain: "Neurai",
    chainShortName: "XNA",
    queryChainShortName: "XNA",
    // chainIcon: require("../assets/icon/XNAIcon.png"),
    tokenType: "XNA",
    fee: "0.0001",
    valueUsd: "0.0",
    priceUsd: "0.01",
  },
  // Nexa (NEXA)
  {
    name: "Nexa",
    shortName: "NEXA",
    balance: "0.0",
    // icon: require("../assets/icon/NEXAIcon.png"),
    // cardImage: require("../assets/CardNexa.png"),
    address: "nexa1xyz...",
    chain: "Nexa",
    chainShortName: "NEXA",
    queryChainShortName: "NEXA",
    // chainIcon: require("../assets/icon/NEXAIcon.png"),
    tokenType: "NEXA",
    fee: "0.0001",
    valueUsd: "0.0",
    priceUsd: "0.01",
  },

  // OctaSpace (OCTA)
  {
    name: "OctaSpace",
    shortName: "OCTA",
    balance: "0.0",
    // icon: require("../assets/icon/OCTAIcon.png"),
    // cardImage: require("../assets/CardOcta.png"),
    address: "octa1xyz...",
    chain: "OctaSpace",
    chainShortName: "OCTA",
    queryChainShortName: "OCTA",
    // chainIcon: require("../assets/icon/OCTAIcon.png"),
    tokenType: "OCTA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.03",
  },
  // opBNB
  {
    name: "opBNB",
    shortName: "opBNB",
    balance: "0.0",
    // icon: require("../assets/icon/opBNBIcon.png"),
    // cardImage: require("../assets/CardOpBNB.png"),
    address: "opbnb1xyz...",
    chain: "opBNB",
    chainShortName: "opBNB",
    queryChainShortName: "opBNB",
    // chainIcon: require("../assets/icon/opBNBIcon.png"),
    tokenType: "opBNB",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Osmosis
  {
    name: "Osmosis",
    shortName: "OSMO",
    balance: "0.0",
    icon: require("../assets/icon/OSMOIcon.png"),
    // cardImage: require("../assets/CardOsmosis.png"),
    address: "osmo1xyz...",
    chain: "Osmosis",
    chainShortName: "OSMO",
    queryChainShortName: "OSMO",
    chainIcon: require("../assets/icon/OSMOIcon.png"),
    tokenType: "OSMO",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // PulseChain
  {
    name: "PulseChain",
    shortName: "PLS",
    balance: "0.0",
    // icon: require("../assets/icon/PulseChainIcon.png"),
    // cardImage: require("../assets/CardPulseChain.png"),
    address: "pls1xyz...",
    chain: "PulseChain",
    chainShortName: "PLS",
    queryChainShortName: "PLS",
    // chainIcon: require("../assets/icon/PulseChainIcon.png"),
    tokenType: "PLS",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.1",
  },

  // Polygon Zkevm
  {
    name: "Polygon Zkevm",
    shortName: "MATIC-ZKEVM",
    balance: "0.0",
    // icon: require("../assets/icon/PolygonZkevmIcon.png"),
    // cardImage: require("../assets/CardPolygonZkevm.png"),
    address: "zkevm1xyz...",
    chain: "Polygon Zkevm",
    chainShortName: "MATIC-ZKEVM",
    queryChainShortName: "MATIC-ZKEVM",
    // chainIcon: require("../assets/icon/PolygonZkevmIcon.png"),
    tokenType: "MATIC-ZKEVM",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // Ronin
  {
    name: "Ronin",
    shortName: "RON",
    balance: "0.0",
    icon: require("../assets/icon/RONIcon.png"),
    // cardImage: require("../assets/CardRonin.png"),
    address: "ronin1xyz...",
    chain: "Ronin",
    chainShortName: "RON",
    queryChainShortName: "RON",
    chainIcon: require("../assets/icon/RONIcon.png"),
    tokenType: "RON",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // Scroll
  {
    name: "Scroll",
    shortName: "SCRL",
    balance: "0.0",
    // icon: require("../assets/icon/ScrollIcon.png"),
    // cardImage: require("../assets/CardScroll.png"),
    address: "scrl1xyz...",
    chain: "Scroll",
    chainShortName: "SCRL",
    queryChainShortName: "SCRL",
    // chainIcon: require("../assets/icon/ScrollIcon.png"),
    tokenType: "SCRL",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Taiko
  {
    name: "Taiko",
    shortName: "TAIKO",
    balance: "0.0",
    // icon: require("../assets/icon/TaikoIcon.png"),
    // cardImage: require("../assets/CardTaiko.png"),
    address: "taiko1xyz...",
    chain: "Taiko",
    chainShortName: "TAIKO",
    queryChainShortName: "TAIKO",
    // chainIcon: require("../assets/icon/TaikoIcon.png"),
    tokenType: "TAIKO",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // WEMIX3.0
  {
    name: "WEMIX3.0",
    shortName: "WEMIX",
    balance: "0.0",
    // icon: require("../assets/icon/WEMIXIcon.png"),
    // cardImage: require("../assets/CardWEMIX.png"),
    address: "wemix1xyz...",
    chain: "WEMIX3.0",
    chainShortName: "WEMIX",
    queryChainShortName: "WEMIX",
    // chainIcon: require("../assets/icon/WEMIXIcon.png"),
    tokenType: "WEMIX",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "2.0",
  },

  // zkLink Nova
  {
    name: "zkLink Nova",
    shortName: "ZKL-NOVA",
    balance: "0.0",
    // icon: require("../assets/icon/ZkLinkNovaIcon.png"),
    // cardImage: require("../assets/CardZkLinkNova.png"),
    address: "zkl-nova1xyz...",
    chain: "zkLink Nova",
    chainShortName: "ZKL-NOVA",
    queryChainShortName: "ZKL-NOVA",
    // chainIcon: require("../assets/icon/ZkLinkNovaIcon.png"),
    tokenType: "ZKL-NOVA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Zora
  {
    name: "Zora",
    shortName: "ZORA",
    balance: "0.0",
    // icon: require("../assets/icon/ZoraIcon.png"),
    // cardImage: require("../assets/CardZora.png"),
    address: "zora1xyz...",
    chain: "Zora",
    chainShortName: "ZORA",
    queryChainShortName: "ZORA",
    // chainIcon: require("../assets/icon/ZoraIcon.png"),
    tokenType: "ZORA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.4",
  },

  // ZetaChain
  {
    name: "ZetaChain",
    shortName: "ZETA",
    balance: "0.0",
    // icon: require("../assets/icon/ZetaChainIcon.png"),
    // cardImage: require("../assets/CardZetaChain.png"),
    address: "zeta1xyz...",
    chain: "ZetaChain",
    chainShortName: "ZETA",
    queryChainShortName: "ZETA",
    // chainIcon: require("../assets/icon/ZetaChainIcon.png"),
    tokenType: "ZETA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.6",
  },

  // Zircuit
  {
    name: "Zircuit",
    shortName: "ZIRC",
    balance: "0.0",
    // icon: require("../assets/icon/ZircuitIcon.png"),
    // cardImage: require("../assets/CardZircuit.png"),
    address: "zirc1xyz...",
    chain: "Zircuit",
    chainShortName: "ZIRC",
    queryChainShortName: "ZIRC",
    // chainIcon: require("../assets/icon/ZircuitIcon.png"),
    tokenType: "ZIRC",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.05",
  },

  // Bitcoin Testnet
  {
    name: "Bitcoin Testnet",
    shortName: "TBTC",
    balance: "0.0",
    // icon: require("../assets/icon/BitcoinTestnetIcon.png"),
    // cardImage: require("../assets/CardBitcoinTestnet.png"),
    address: "tb1xyz...",
    chain: "Bitcoin Testnet",
    chainShortName: "TBTC",
    queryChainShortName: "TBTC",
    // chainIcon: require("../assets/icon/BitcoinTestnetIcon.png"),
    tokenType: "TBTC",
    fee: "0.0001",
    valueUsd: "0.0",
    priceUsd: "0.0",
  },

  // Bitcoin Signet
  {
    name: "Bitcoin Signet",
    shortName: "SBTC",
    balance: "0.0",
    // icon: require("../assets/icon/BitcoinSignetIcon.png"),
    // cardImage: require("../assets/CardBitcoinSignet.png"),
    address: "sb1xyz...",
    chain: "Bitcoin Signet",
    chainShortName: "SBTC",
    queryChainShortName: "SBTC",
    // chainIcon: require("../assets/icon/BitcoinSignetIcon.png"),
    tokenType: "SBTC",
    fee: "0.0001",
    valueUsd: "0.0",
    priceUsd: "0.0",
  },

  // Ethereum Sepolia Testnet
  {
    name: "Ethereum Sepolia",
    shortName: "SEPOLIA",
    balance: "0.0",
    // icon: require("../assets/icon/EthereumSepoliaIcon.png"),
    // cardImage: require("../assets/CardEthereumSepolia.png"),
    address: "sepolia1xyz...",
    chain: "Ethereum Sepolia Testnet",
    chainShortName: "SEPOLIA",
    queryChainShortName: "SEPOLIA",
    // chainIcon: require("../assets/icon/EthereumSepoliaIcon.png"),
    tokenType: "SEPOLIA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.0",
  },

  // Garnet Holesky
  {
    name: "Garnet Holesky",
    shortName: "HOLESKY",
    balance: "0.0",
    // icon: require("../assets/icon/GarnetHoleskyIcon.png"),
    // cardImage: require("../assets/CardGarnetHolesky.png"),
    address: "holesky1xyz...",
    chain: "Garnet Holesky",
    chainShortName: "HOLESKY",
    queryChainShortName: "HOLESKY",
    // chainIcon: require("../assets/icon/GarnetHoleskyIcon.png"),
    tokenType: "HOLESKY",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.0",
  },

  // Lightning Network Testnet
  {
    name: "Lightning Network Testnet",
    shortName: "TLN",
    balance: "0.0",
    // icon: require("../assets/icon/LightningNetworkTestnetIcon.png"),
    // cardImage: require("../assets/CardLightningNetworkTestnet.png"),
    address: "lntb1xyz...",
    chain: "Lightning Network Testnet",
    chainShortName: "TLN",
    queryChainShortName: "TLN",
    // chainIcon: require("../assets/icon/LightningNetworkTestnetIcon.png"),
    tokenType: "TLN",
    fee: "0.00001",
    valueUsd: "0.0",
    priceUsd: "0.0",
  },

  // Endurance
  {
    name: "Endurance",
    shortName: "END",
    balance: "0.0",
    // icon: require("../assets/icon/EnduranceIcon.png"),
    // cardImage: require("../assets/CardEndurance.png"),
    address: "end1xyz...",
    chain: "Endurance",
    chainShortName: "END",
    queryChainShortName: "END",
    // chainIcon: require("../assets/icon/EnduranceIcon.png"),
    tokenType: "END",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.1",
  },

  // Flare
  {
    name: "Flare",
    shortName: "FLR",
    balance: "0.0",
    icon: require("../assets/icon/FlareIcon.png"),
    // cardImage: require("../assets/CardFlare.png"),
    address: "flr1xyz...",
    chain: "Flare",
    chainShortName: "FLR",
    queryChainShortName: "FLR",
    chainIcon: require("../assets/icon/FlareIcon.png"),
    tokenType: "FLR",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Harmony
  {
    name: "Harmony",
    shortName: "ONE",
    balance: "0.0",
    icon: require("../assets/icon/HarmonyIcon.png"),
    // cardImage: require("../assets/CardHarmony.png"),
    address: "one1xyz...",
    chain: "Harmony",
    chainShortName: "ONE",
    queryChainShortName: "ONE",
    chainIcon: require("../assets/icon/HarmonyIcon.png"),
    tokenType: "ONE",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.2",
  },

  // Moonbeam
  {
    name: "Moonbeam",
    shortName: "GLMR",
    balance: "0.0",
    icon: require("../assets/icon/MoonbeamIcon.png"),
    // cardImage: require("../assets/CardMoonbeam.png"),
    address: "glmr1xyz...",
    chain: "Moonbeam",
    chainShortName: "GLMR",
    queryChainShortName: "GLMR",
    chainIcon: require("../assets/icon/MoonbeamIcon.png"),
    tokenType: "GLMR",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.3",
  },

  // Mobe
  {
    name: "Mobe",
    shortName: "MOBE",
    balance: "0.0",
    // icon: require("../assets/icon/MobeIcon.png"),
    // cardImage: require("../assets/CardMobe.png"),
    address: "mobe1xyz...",
    chain: "Mobe",
    chainShortName: "MOBE",
    queryChainShortName: "MOBE",
    // chainIcon: require("../assets/icon/MobeIcon.png"),
    tokenType: "MOBE",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.1",
  },

  // Metis
  {
    name: "Metis",
    shortName: "METIS",
    balance: "0.0",
    icon: require("../assets/icon/MetisIcon.png"),
    // cardImage: require("../assets/CardMetis.png"),
    address: "metis1xyz...",
    chain: "Metis",
    chainShortName: "METIS",
    queryChainShortName: "METIS",
    chainIcon: require("../assets/icon/MetisIcon.png"),
    tokenType: "METIS",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // Merlin
  {
    name: "Merlin",
    shortName: "MERL",
    balance: "0.0",
    // icon: require("../assets/icon/MerlinIcon.png"),
    // cardImage: require("../assets/CardMerlin.png"),
    address: "merl1xyz...",
    chain: "Merlin",
    chainShortName: "MERL",
    queryChainShortName: "MERL",
    //  chainIcon: require("../assets/icon/MerlinIcon.png"),
    tokenType: "MERL",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // Nostr
  {
    name: "Nostr",
    shortName: "NOSTR",
    balance: "0.0",
    // icon: require("../assets/icon/NostrIcon.png"),
    // cardImage: require("../assets/CardNostr.png"),
    address: "nostr1xyz...",
    chain: "Nostr",
    chainShortName: "NOSTR",
    queryChainShortName: "NOSTR",
    // chainIcon: require("../assets/icon/NostrIcon.png"),
    tokenType: "NOSTR",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.05",
  },

  // Klaytn
  {
    name: "Klaytn",
    shortName: "KLAY",
    balance: "0.0",
    icon: require("../assets/icon/KlaytnIcon.png"),
    // cardImage: require("../assets/CardKlaytn.png"),
    address: "klaytn1xyz...",
    chain: "Klaytn",
    chainShortName: "KLAY",
    queryChainShortName: "KLAY",
    chainIcon: require("../assets/icon/KlaytnIcon.png"),
    tokenType: "KLAY",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.8",
  },

  // Kava
  {
    name: "Kava",
    shortName: "KAVA",
    balance: "0.0",
    icon: require("../assets/icon/KavaIcon.png"),
    // cardImage: require("../assets/CardKava.png"),
    address: "kava1xyz...",
    chain: "Kava",
    chainShortName: "KAVA",
    queryChainShortName: "KAVA",
    chainIcon: require("../assets/icon/KavaIcon.png"),
    tokenType: "KAVA",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // Dymension
  {
    name: "Dymension",
    shortName: "DYM",
    balance: "0.0",
    // icon: require("../assets/icon/DymensionIcon.png"),
    // cardImage: require("../assets/CardDymension.png"),
    address: "dym1xyz...",
    chain: "Dymension",
    chainShortName: "DYM",
    queryChainShortName: "DYM",
    // chainIcon: require("../assets/icon/DymensionIcon.png"),
    tokenType: "DYM",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.2",
  },

  // B2 Mainnet
  {
    name: "B2 Mainnet",
    shortName: "B2",
    balance: "0.0",
    // icon: require("../assets/icon/B2Icon.png"),
    // cardImage: require("../assets/CardB2.png"),
    address: "b21xyz...",
    chain: "B2 Mainnet",
    chainShortName: "B2",
    queryChainShortName: "B2",
    // chainIcon: require("../assets/icon/B2Icon.png"),
    tokenType: "B2",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.5",
  },

  // BounceBit
  {
    name: "BounceBit",
    shortName: "BOUNCE",
    balance: "0.0",
    // icon: require("../assets/icon/BounceBitIcon.png"),
    // cardImage: require("../assets/CardBounceBit.png"),
    address: "bounce1xyz...",
    chain: "BounceBit",
    chainShortName: "BOUNCE",
    queryChainShortName: "BOUNCE",
    // chainIcon: require("../assets/icon/BounceBitIcon.png"),
    tokenType: "BOUNCE",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.1",
  },

  // Bitlayer
  {
    name: "Bitlayer",
    shortName: "BITLAYER",
    balance: "0.0",
    // icon: require("../assets/icon/BitlayerIcon.png"),
    // cardImage: require("../assets/CardBitlayer.png"),
    address: "bitlayer1xyz...",
    chain: "Bitlayer",
    chainShortName: "BITLAYER",
    queryChainShortName: "BITLAYER",
    // chainIcon: require("../assets/icon/BitlayerIcon.png"),
    tokenType: "BITLAYER",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.3",
  },

  // BOB
  {
    name: "BOB",
    shortName: "BOB",
    balance: "0.0",
    // icon: require("../assets/icon/BOBIcon.png"),
    // cardImage: require("../assets/CardBOB.png"),
    address: "bob1xyz...",
    chain: "BOB",
    chainShortName: "BOB",
    queryChainShortName: "BOB",
    // chainIcon: require("../assets/icon/BOBIcon.png"),
    tokenType: "BOB",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "1.0",
  },

  // Cyber
  {
    name: "Cyber",
    shortName: "CYBER",
    balance: "0.0",
    // icon: require("../assets/icon/CyberIcon.png"),
    // cardImage: require("../assets/CardCyber.png"),
    address: "cyber1xyz...",
    chain: "Cyber",
    chainShortName: "CYBER",
    queryChainShortName: "CYBER",
    // chainIcon: require("../assets/icon/CyberIcon.png"),
    tokenType: "CYBER",
    fee: "0.001",
    valueUsd: "0.0",
    priceUsd: "0.8",
  },
];

// 1. Bitcoin
// 2. Ethereum
// 3. BNB Smart Chain
// 4. Polygon
// 5. Arbitrum
// 6. Avalanche
// 7. Fantom
// 8. Optimism
// 9. Tron
// 10. Solana
// 11. Ripple
// 12. Cardano
// 13. Base
// 14. zkSync Era Mainnet
// 15. Linea
// 16. Mantle
// 17. OKX Chain
// 18. Huobi ECO Chain
// 19. Gnosis Chain
// 20. Celo
// 21. Aurora
// 22. Moonbeam
// 23. Kava
// 24. Klaytn
// 25. Harmony
// 26. Cronos (CRO)
// 27. Cosmos (ATOM)
// 28. Filecoin / Filecoin FEVM
// 29. Aptos
// 30. SUI
// 31. Secret Network
// 32. Conflux / Conflux eSpace
// 33. Osmosis
// 34. Ronin
// 35. zkLink Nova
// 36. Zora
// 37. PulseChain
// 38. Scroll
// 39. Taiko
// 40. WEMIX3.0
// 41. ZetaChain
// 42. Celestia (TIA)
// 43. opBNB
// 44. Manta Atlantic
// 45. Manta Pacific Mainnet
// 46. Mixin Virtual Machine
// 47. Joystream (JOY)
// 48. Akash (AKT)
// 49. Fetch.ai (FET)
// 50. IoTeX Network Mainnet (IOTX)
// 51. Dymension
// 52. Merlin
// 53. Nervos (CKB)
// 54. OctaSpace (OCTA)
// 55. Neurai (XNA)
// 56. Nexa (NEXA)
// 57. Bitcoin Cash (BCH)
// 58. Litecoin
// 59. Dogecoin (DOGE)
// 60. Astar
// 61. Kusama
// 62. Kasp
// 63. Blast (BLAST)
// 64. Dynex (DNX)
// 65. Zircuit
// 66. Zora
// 67. ZetaChain
// 68. Neurai (XNA)
// 69. Bitcoin Testnet
// 70. Bitcoin Signet
// 71. Ethereum Classic
// 72. EthereumPoW
// 73. Ethereum Sepolia Testnet
// 74. Garnet Holesky
// 75. Lightning Network Testnet
// 76. Endurance
// 77. Flare
// 78. Nostr
// 79. B2 Mainnet
// 80. BounceBit
// 81. Bitlayer
// 82. BOB
// 83. Cyber
