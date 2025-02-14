// config/chainMapping.js

// BTC 类链映射
export const btcChainMapping = {
  bitcoin: "BTC",
  bitcoin_cash: "BCH",
  litecoin: "LTC",
  dogecoin: "DOGE",
  // 根据需要添加其他BTC生态的币种
};

// ETH 类（EVM链）映射（原有的 evmChainMapping）
export const evmChainMapping = {
  arbitrum: "ARB",
  aurora: "AURORA",
  avalanche: "AVAX",
  binance: "BSC",
  celo: "CELO",
  ethereum: ["ETH", "TEST"],
  ethereum_classic: "ETC",
  fantom: "FTM",
  gnosis: "GNO",
  huobi: "HTX",
  iotext: "IOTX",
  lina: "LINEA",
  OKT: "OKT",
  optimism: "OP",
  polygon: "POL",
  ronin: "RON",
  zksync: "ZKSYNC",
};

// Aptos 类链映射
export const aptosChainMapping = {
  aptos: "APT",
  // 如果有其他 Aptos 生态的链，可以在这里添加
};

// Cosmos 类链映射
export const cosmosChainMapping = {
  cosmos: "ATOM",
  osmosis: "OSMO",
  terra: "LUNA", // 注意：Terra 链近期发生了变化，可按实际情况调整
  // 根据需要添加其他 Cosmos 生态链
};

// Solana 类链映射
export const solChainMapping = {
  solana: "SOL",
  // 可扩展添加如 Serum 等基于 Solana 生态的其他标识
};

// Sui 类链映射
export const suiChainMapping = {
  sui: "SUI",
  // 根据实际情况补充其他 Sui 链映射
};

// XRP 类链映射
export const xrpChainMapping = {
  ripple: "XRP",
  // 如果有其他相关链，也可以添加在这里
};
