// config/mappingRegistry.js

// 用逗号分隔的“原始”链名列表
const evmRaw =
  "arbitrum,aurora,avalanchec,smartchain,ethereum,classic,fantom,gnosis,cronos,iotexevm,linea,okc,optimisim,polygon,zksync,ronin,celo";
const btcRaw = "bitcoin,bitcoincash,litecoin";
const tronRaw = "tron";
const aptosRaw = "aptos";
const cosmosRaw = "cosmos,celestia,cryptoorg,juno,osmosis";
const solRaw = "solana";
const suiRaw = "sui";
const xrpRaw = "ripple";
const dogeRaw = "doge";

// 运行时拆分函数
function decodeList(raw) {
  return raw.split(",").map((s) => s.trim());
}

// 导出各链家族数组
export const families = {
  evm: decodeList(evmRaw), // EVM 类链
  btc: decodeList(btcRaw), // 比特币类链
  tron: decodeList(tronRaw), // 波场
  aptos: decodeList(aptosRaw), // Aptos
  cosmos: decodeList(cosmosRaw), // Cosmos 生态
  sol: decodeList(solRaw), // Solana
  sui: decodeList(suiRaw), // Sui
  xrp: decodeList(xrpRaw), // Ripple
  doge: decodeList(dogeRaw), // Dogecoin
};
