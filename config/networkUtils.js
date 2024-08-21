// config/networkUtils.js

export const detectNetwork = (address) => {
  // Bitcoin
  if (/^(1|3|bc1|tb1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address)) {
    return "Bitcoin (BTC)";
  }
  // Ethereum
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Ethereum (ETH)";
  }
  // BNB Smart Chain
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "BNB Smart Chain (BSC)";
  }
  // Solana
  else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return "Solana (SOL)";
  }
  // Polygon
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Polygon (MATIC)";
  }
  // Fantom
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Fantom (FTM)";
  }
  // Arbitrum
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Arbitrum (ARB)";
  }
  // Avalanche
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Avalanche (AVAX)";
  }
  // Huobi ECO Chain
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Huobi ECO Chain (HECO)";
  }
  // OKX Chain
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "OKX Chain (OKT)";
  }
  // Optimism
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Optimism (OP)";
  }
  // Gnosis Chain
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Gnosis Chain (xDAI)";
  }
  // Starcoin
  else if (/^stc1[0-9a-z]{39}$/.test(address)) {
    return "Starcoin (STC)";
  }
  // Ripple
  else if (/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) {
    return "Ripple (XRP)";
  }
  // SUI
  else if (/^0x[0-9a-fA-F]{64}$/.test(address)) {
    return "SUI (SUI)";
  }
  // Secret Network
  else if (/^secret1[0-9a-z]{38}$/.test(address)) {
    return "Secret Network (SCRT)";
  }
  // Tron
  else if (/^T[A-Za-z1-9]{33}$/.test(address)) {
    return "Tron (TRX)";
  }
  // zkSync Era Mainnet
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "zkSync Era Mainnet (zkSync)";
  }
  // Kaspa
  else if (/^kaspa:[a-zA-Z0-9]{50}$/.test(address)) {
    return "Kaspa (KAS)";
  }
  // Kusama
  else if (/^[C-FH-NP-TV-Z1-9]{47,48}$/.test(address)) {
    return "Kusama (KSM)";
  }
  // Linea
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Linea (Linea)";
  }
  // Litecoin
  else if (/^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(address)) {
    return "Litecoin (LTC)";
  }
  // Manta Atlantic
  else if (/^[a-zA-Z0-9]{47,48}$/.test(address)) {
    return "Manta Atlantic (Manta)";
  }
  // Manta Pacific Mainnet
  else if (/^[a-zA-Z0-9]{47,48}$/.test(address)) {
    return "Manta Pacific Mainnet (Manta)";
  }
  // Mantle
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Mantle (Mantle)";
  }
  // Mixin Virtual Machine
  else if (/^MV[a-zA-Z0-9]{42}$/.test(address)) {
    return "Mixin Virtual Machine (MVM)";
  }
  // Monero
  else if (/^[48][0-9AB][a-zA-Z0-9]{93}$/.test(address)) {
    return "Monero (XMR)";
  }
  // Near
  else if (/^[a-z0-9._-]{5,32}\.near$/.test(address)) {
    return "Near (NEAR)";
  }
  // Nervos
  else if (/^ckb1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{42}$/.test(address)) {
    return "Nervos (CKB)";
  }
  // Neurai
  else if (/^N[A-Za-z0-9]{33}$/.test(address)) {
    return "Neurai (XNA)";
  }
  // Nexa
  else if (/^nexa:[a-zA-Z0-9]{42}$/.test(address)) {
    return "Nexa (NEXA)";
  }
  // OctaSpace
  else if (/^os[a-zA-Z0-9]{42}$/.test(address)) {
    return "OctaSpace (OCTA)";
  }
  // Cosmos
  else if (/^cosmos1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Cosmos (ATOM)";
  }
  // Cronos
  else if (/^cro1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Cronos (CRO)";
  }
  // Crypto.org
  else if (/^cro1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Crypto.org (CRO)";
  }
  // DIS CHAIN
  else if (/^dis1[a-zA-Z0-9]{38}$/.test(address)) {
    return "DIS CHAIN (DIS)";
  }
  // Dogecoin
  else if (/^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(address)) {
    return "Dogecoin (DOGE)";
  }
  // Dynex
  else if (/^dynex:[a-zA-Z0-9]{42}$/.test(address)) {
    return "Dynex (DNX)";
  }
  // Ethereum Classic
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Ethereum Classic (ETC)";
  }
  // EthereumPoW
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "EthereumPoW (ETHW)";
  }
  // Fetch.ai
  else if (/^fetch1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Fetch.ai (FET)";
  }
  // Filecoin
  else if (/^f[a-zA-Z0-9]{41}$/.test(address)) {
    return "Filecoin (FIL)";
  }
  // Filecoin FEVM
  else if (/^f[a-zA-Z0-9]{41}$/.test(address)) {
    return "Filecoin FEVM (FIL)";
  }
  // IoTeX Network Mainnet
  else if (/^io1[a-zA-Z0-9]{38}$/.test(address)) {
    return "IoTeX Network Mainnet (IOTX)";
  }
  // Joystream
  else if (/^5[a-zA-Z0-9]{47}$/.test(address)) {
    return "Joystream (JOY)";
  }
  // Juno
  else if (/^juno1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Juno (JUNO)";
  }
  // Conflux
  else if (/^cfx:[a-zA-Z0-9]{42}$/.test(address)) {
    return "Conflux (CFX)";
  }
  // Algorand
  else if (/^algo1[a-zA-Z0-9]{58}$/.test(address)) {
    return "Algorand (ALGO)";
  }
  // Celo
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Celo (CELO)";
  }
  // Akash
  else if (/^akash1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Akash (AKT)";
  }
  // Aptos
  else if (/^0x[a-fA-F0-9]{64}$/.test(address)) {
    return "Aptos (APT)";
  }
  // Astar
  else if (/^5[a-zA-Z0-9]{47}$/.test(address)) {
    return "Astar (ASTR)";
  }
  // Aurora
  else if (/^aurora[a-zA-Z0-9]{38}$/.test(address)) {
    return "Aurora (AURORA)";
  }
  // Base
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Base (BASE)";
  }
  // Bitcoin Cash
  else if (/^bitcoincash:q[a-zA-Z0-9]{41}$/.test(address)) {
    return "Bitcoin Cash (BCH)";
  }
  // Blast
  else if (/^blast[a-zA-Z0-9]{38}$/.test(address)) {
    return "Blast (BLAST)";
  }
  // Boba Network
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Boba Network (BOBA)";
  }
  // Cardano
  else if (/^(addr1|Ae2)[a-zA-Z0-9]{58}$/.test(address)) {
    return "Cardano (ADA)";
  }
  // Celestia
  else if (/^celestia1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Celestia (TIA)";
  }
  // Conflux eSpace
  else if (/^cfx[a-zA-Z0-9]{42}$/.test(address)) {
    return "Conflux eSpace (CFX)";
  }
  // Lightning Network
  else if (/^lnbc[a-zA-Z0-9]{30,80}$/.test(address)) {
    return "Lightning Network (LN)";
  }
  // zkSync Era Mainnet
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "zkSync Era Mainnet (zkSync)";
  } else {
    return "Unknown Network";
  }
};
