// config/mappingRegistry.js
/*
 * Supported Chains:
 *   - ethereum
 *   - arbitrum
 *   - aptos
 *   - aurora
 *   - avalanchec
 *   - bitcoin
 *   - bitcoincash
 *   - smartchain
 *   - celo
 *   - cosmos
 *   - cryptoorg
 *   - classic
 *   - fantom
 *   - iotexevm
 *   - juno
 *   - litecoin
 *   - okc
 *   - optimism
 *   - osmosis
 *   - polygon
 *   - ripple
 *   - ronin
 *   - solana
 *   - sui
 *   - tron
 *   - zksync
 *   - cronos
 *   - doge
 */

// BTC 类链映射
export const btcChainMapping = {
  bitcoin: "BTC",
  bitcoincash: "BCH",
  litecoin: "LTC",
};
// EVM 类链映射
export const evmChainMapping = {
  arbitrum: "ARB",
  aurora: "AURORA",
  avalanchec: "AVAX",
  smartchain: "BSC",
  ethereum: "ETH",
  classic: "ETC",
  fantom: "FTM",
  gnosis: "GNO",
  cronos: "HTX",
  iotexevm: "IOTX",
  linea: "LINEA",
  okc: "OKT",
  optimisim: "OP",
  polygon: "POL",
  zksync: "ZKSYNC",
  ronin: "RON",
  gnosis: "GNO",
  celo: "CELO",
};
// Tron 类链映射
export const tronChainMapping = {
  tron: "TRX",
};
// Aptos 类链映射
export const aptosChainMapping = {
  aptos: "APT",
};
// Cosmos 类链映射
export const cosmosChainMapping = {
  cosmos: "ATOM",
  celestia: "CEL",
  cryptoorg: "CRO",
  juno: "JUNO",
  osmosis: "OSMO",
};
// Solana 类链映射
export const solChainMapping = {
  solana: "SOL",
};
// Sui 类链映射
export const suiChainMapping = {
  sui: "SUI",
};
// XRP 类链映射
export const xrpChainMapping = {
  ripple: "XRP",
};

export const chainGroups = {
  ethereum: [
    "arbitrum",
    "aurora",
    "avalanchec",
    "smartchain",
    "ethereum",
    "classic",
    "fantom",
    "gnosis",
    "cronos",
    "iotexevm",
    "linea",
    "okc",
    "optimisim",
    "polygon",
    "zksync",
    "ronin",
    "celo",
  ],
  bitcoin: ["bitcoin", "bitcoincash", "litecoin"],
  tron: ["tron"],
  aptos: ["aptos"],
  cosmos: ["cosmos", "celestia", "cryptoorg", "juno", "osmosis"],
  solana: ["solana"],
  sui: ["sui"],
  ripple: ["ripple"],
  doge: ["doge"],
};
