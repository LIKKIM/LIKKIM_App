// env/apiEndpoints.js

export const convertAPI = {
  queryQuote: "https://swap.likkim.com/api/aggregator/queryQuote",
  executeConvert: "https://swap.likkim.com/api/aggregator/swap",
};

export const accountAPI = {
  queryTransaction: "https://bt.likkim.com/api/wallet/queryTransaction",
  blockchainFee: "https://bt.likkim.com/api/chain/blockchain-fee",
  balance: "https://bt.likkim.com/api/wallet/balance",
  broadcastHex: "https://bt.likkim.com/api/wallet/broadcastHex",
  getSignParam: "https://bt.likkim.com/api/wallet/getSignParam",
  encodeEvm: "https://bt.likkim.com/api/sign/encode_evm",
};
export const metricsAPII = {
  exchangeRate: "market.lukkey.ch/api/market/exchange-rate",
  indexTickers: "market.lukkey.ch/api/market/index-tickers",
};
export const galleryAPI = {
  queryNFTBalance: "https://bt.likkim.com/api/nfts/query-address-balance-fills",
  queryNFTDetails: "https://bt.likkim.com/api/nfts/query-nft-details",
};

export const externalLinks = {
  privacyPolicy: "https://likkim.com/privacy-policy",
  aboutPage: "https://www.likkim.com",
};

export const meridianAPI = {
  queryBlockList: "https://bt.likkim.com/meridian/address/queryBlockList",
};
export const chartAPI = {
  indexCandles: "market.lukkey.ch/api/market/index-candles",
};

export const firmwareAPI = {
  lvglExec: "https://file.likkim.com/algo/lvgl_exec.dat",
};

export const signAPI = {
  encode_btc: "https://bt.likkim.com/api/sign/encode_btc",
  encode_evm: "https://bt.likkim.com/api/sign/encode_evm",
  encode_aptos: "https://bt.likkim.com/api/sign/encode_aptos",
  encode_cosmos: "https://bt.likkim.com/api/sign/encode_cosmos",
  encode_solana: "https://bt.likkim.com/api/sign/encode_solana",
  encode_sui: "https://bt.likkim.com/api/sign/encode_sui",
  encode_xrp: "https://bt.likkim.com/api/sign/encode_xrp",
  aptos_broadcast: "https://bt.likkim.com/api/sign/aptos_broadcast",
  cosmos_broadcast: "https://bt.likkim.com/api/sign/cosmos_broadcast",
  solana_broadcast: "https://bt.likkim.com/api/sign/solana_broadcast",
  sui_broadcast: "https://bt.likkim.com/api/sign/sui_broadcast",
};
