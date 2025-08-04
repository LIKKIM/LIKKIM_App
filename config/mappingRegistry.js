// config/mappingRegistry.js

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

function decodeList(raw) {
  return raw.split(",").map((s) => s.trim());
}

export const families = {
  evm: decodeList(evmRaw),
  btc: decodeList(btcRaw),
  tron: decodeList(tronRaw),
  aptos: decodeList(aptosRaw),
  cosmos: decodeList(cosmosRaw),
  sol: decodeList(solRaw),
  sui: decodeList(suiRaw),
  xrp: decodeList(xrpRaw),
  doge: decodeList(dogeRaw),
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
};
