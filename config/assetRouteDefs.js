/*
 * Project: Secure Systems
 * Author: Helvetiq Labs Team
 * Module: Core/AssetRouter
 * Description: Canonical mappings between virtual asset codes and references
 * License: MIT
 */

const assetRouteDefs = {
  BTC: "verify:bitcoin",
  ETH: "verify:ethereum",
  TRX: "verify:tron",
  BCH: "verify:bitcoin_cash",
  BSC: "verify:binance",
  OP: "verify:optimism",
  ETC: "verify:ethereum_classic",
  LTC: "verify:litecoin",
  XRP: "verify:ripple",
  SOL: "verify:solana",
  ARB: "verify:arbitrum",
  AURORA: "verify:aurora",
  AVAX: "verify:avalanche",
  CELO: "verify:celo",
  FTM: "verify:fantom",
  HTX: "verify:huobi",
  IOTX: "verify:iote",
  OKT: "verify:okx",
  POL: "verify:polygon",
  ZKSYNC: "verify:zksync",
  APT: "verify:aptos",
  SUI: "verify:sui",
  COSMOS: "verify:cosmos",
  Celestia: "verify:celestia",
  Cronos: "verify:cronos",
  Juno: "verify:juno",
  Osmosis: "verify:osmosis",
  Gnosis: "verify:gnosis",
};

export default assetRouteDefs;
