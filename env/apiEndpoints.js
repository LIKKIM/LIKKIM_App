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
