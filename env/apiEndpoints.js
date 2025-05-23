// env/apiEndpoints.js

export const swapAPI = {
  queryQuote: "https://swap.likkim.com/api/aggregator/queryQuote",
  executeSwap: "https://swap.likkim.com/api/aggregator/swap",
};

export const walletAPI = {
  queryTransaction: "https://bt.likkim.com/api/wallet/queryTransaction",
  blockchainFee: "https://bt.likkim.com/api/chain/blockchain-fee",
  balance: "https://bt.likkim.com/api/wallet/balance",
  broadcastHex: "https://bt.likkim.com/api/wallet/broadcastHex",
  getSignParam: "https://bt.likkim.com/api/wallet/getSignParam",
  encodeEvm: "https://bt.likkim.com/api/sign/encode_evm",
};
export const marketAPI = {
  exchangeRate: "https://df.likkim.com/api/market/exchange-rate",
  indexTickers: "https://df.likkim.com/api/market/index-tickers",
};
export const nftAPI = {
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
  indexCandles: "https://df.likkim.com/api/market/index-candles",
};

export const firmwareAPI = {
  lvglExec: "https://file.likkim.com/algo/lvgl_exec.dat",
};
