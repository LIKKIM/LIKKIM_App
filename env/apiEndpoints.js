// env/apiEndpoints.js

export const convertAPI = {
  queryQuote: "https://convert.lukkey.ch/api/aggregator/queryQuote",
  executeConvert: "https://convert.lukkey.ch/api/aggregator/swap",
};

export const accountAPI = {
  queryTransaction: "https://chain.lukkey.ch/api/wallet/queryTransaction",
  blockchainFee: "https://chain.lukkey.ch/api/chain/blockchain-fee",
  balance: "https://chain.lukkey.ch/api/wallet/balance",
  broadcastHex: "https://chain.lukkey.ch/api/wallet/broadcastHex",
  getSignParam: "https://chain.lukkey.ch/api/wallet/getSignParam",
  encodeEvm: "https://chain.lukkey.ch/api/sign/encode_evm",
};
export const metricsAPII = {
  exchangeRate: "market.lukkey.ch/api/market/exchange-rate",
  indexTickers: "market.lukkey.ch/api/market/index-tickers",
};
export const galleryAPI = {
  queryNFTBalance:
    "https://chain.lukkey.ch/api/nfts/query-address-balance-fills",
  queryNFTDetails: "https://chain.lukkey.ch/api/nfts/query-nft-details",
};

export const externalLinks = {
  privacyPolicy: "https://likkim.com/privacy-policy",
  aboutPage: "https://www.likkim.com",
};

export const meridianAPI = {
  queryBlockList: "https://chain.lukkey.ch/meridian/address/queryBlockList",
};
export const chartAPI = {
  indexCandles: "market.lukkey.ch/api/market/index-candles",
};

export const firmwareAPI = {
  lvglExec: "https://file.likkim.com/algo/lvgl_exec.dat",
};

export const signAPI = {
  encode_btc: "https://chain.lukkey.ch/api/sign/encode_btc",
  encode_evm: "https://chain.lukkey.ch/api/sign/encode_evm",
  encode_aptos: "https://chain.lukkey.ch/api/sign/encode_aptos",
  encode_cosmos: "https://chain.lukkey.ch/api/sign/encode_cosmos",
  encode_solana: "https://chain.lukkey.ch/api/sign/encode_solana",
  encode_sui: "https://chain.lukkey.ch/api/sign/encode_sui",
  encode_xrp: "https://chain.lukkey.ch/api/sign/encode_xrp",
  aptos_broadcast: "https://chain.lukkey.ch/api/sign/aptos_broadcast",
  cosmos_broadcast: "https://chain.lukkey.ch/api/sign/cosmos_broadcast",
  solana_broadcast: "https://chain.lukkey.ch/api/sign/solana_broadcast",
  sui_broadcast: "https://chain.lukkey.ch/api/sign/sui_broadcast",
};
