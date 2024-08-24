export const detectNetwork = (address) => {
  // Bitcoin
  if (/^(1|3|bc1|tb1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address)) {
    return "Bitcoin (BTC)";
  }

  // Ethereum, BNB Smart Chain, Polygon, Fantom, Arbitrum, Avalanche, Huobi ECO Chain, OKX Chain, Optimism, Gnosis Chain, zkSync Era Mainnet, Linea, Mantle, Ethereum Classic, EthereumPoW, Base, Boba Network, Celo
  else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Ethereum (ETH)/BNB Smart Chain (BSC)/Polygon (MATIC)/Fantom (FTM)/Arbitrum (ARB)/Avalanche (AVAX)/Huobi ECO Chain (HECO)/OKX Chain (OKT)/Optimism (OP)/Gnosis Chain (xDAI)/zkSync Era Mainnet (zkSync)/Linea (Linea)/Mantle (Mantle)/Ethereum Classic (ETC)/EthereumPoW (ETHW)/Base (BASE)/Boba Network (BOBA)/Celo (CELO)";
  }

  // Tron
  else if (/^T[A-Za-z1-9]{33}$/.test(address)) {
    return "Tron (TRX)";
  }

  // Solana
  else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return "Solana (SOL)";
  }

  // Starcoin
  else if (/^stc1[0-9a-z]{39}$/.test(address)) {
    return "Starcoin (STC)";
  }

  // Ripple
  else if (/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) {
    return "Ripple (XRP)";
  }

  // SUI, Aptos
  else if (/^0x[0-9a-fA-F]{64}$/.test(address)) {
    return "SUI (SUI)/Aptos (APT)";
  }

  // Secret Network
  else if (/^secret1[0-9a-z]{38}$/.test(address)) {
    return "Secret Network (SCRT)";
  }

  // Kaspa
  else if (/^kaspa:[a-zA-Z0-9]{50}$/.test(address)) {
    return "Kaspa (KAS)";
  }

  // Kusama, Astar
  else if (/^[C-FH-NP-TV-Z1-9]{47,48}$/.test(address)) {
    return "Kusama (KSM)/Astar (ASTR)";
  }

  // Litecoin
  else if (/^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(address)) {
    return "Litecoin (LTC)";
  }

  // Manta Atlantic, Manta Pacific Mainnet
  else if (/^[a-zA-Z0-9]{47,48}$/.test(address)) {
    return "Manta Atlantic (Manta)/Manta Pacific Mainnet (Manta)";
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

  // Cosmos, Cronos, Crypto.org, DIS CHAIN, Juno
  else if (/^(cosmos1|cro1|dis1|juno1)[a-zA-Z0-9]{38}$/.test(address)) {
    return "Cosmos (ATOM)/Cronos (CRO)/Crypto.org (CRO)/DIS CHAIN (DIS)/Juno (JUNO)";
  }

  // Dogecoin
  else if (/^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(address)) {
    return "Dogecoin (DOGE)";
  }

  // Dynex
  else if (/^dynex:[a-zA-Z0-9]{42}$/.test(address)) {
    return "Dynex (DNX)";
  }

  // Fetch.ai
  else if (/^fetch1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Fetch.ai (FET)";
  }

  // Filecoin, Filecoin FEVM
  else if (/^f[a-zA-Z0-9]{41}$/.test(address)) {
    return "Filecoin (FIL)/Filecoin FEVM (FIL)";
  }

  // IoTeX Network Mainnet
  else if (/^io1[a-zA-Z0-9]{38}$/.test(address)) {
    return "IoTeX Network Mainnet (IOTX)";
  }

  // Joystream
  else if (/^5[a-zA-Z0-9]{47}$/.test(address)) {
    return "Joystream (JOY)";
  }

  // Conflux, Conflux eSpace
  else if (/^cfx[a-zA-Z0-9]{42}$/.test(address)) {
    return "Conflux (CFX)/Conflux eSpace (CFX)";
  }

  // Algorand
  else if (/^algo1[a-zA-Z0-9]{58}$/.test(address)) {
    return "Algorand (ALGO)";
  }

  // Akash
  else if (/^akash1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Akash (AKT)";
  }

  // Aurora
  else if (/^aurora[a-zA-Z0-9]{38}$/.test(address)) {
    return "Aurora (AURORA)";
  }

  // Bitcoin Cash
  else if (/^bitcoincash:q[a-zA-Z0-9]{41}$/.test(address)) {
    return "Bitcoin Cash (BCH)";
  }

  // Blast
  else if (/^blast[a-zA-Z0-9]{38}$/.test(address)) {
    return "Blast (BLAST)";
  }

  // Celestia
  else if (/^celestia1[a-zA-Z0-9]{38}$/.test(address)) {
    return "Celestia (TIA)";
  }

  // Lightning Network
  else if (/^lnbc[a-zA-Z0-9]{30,80}$/.test(address)) {
    return "Lightning Network (LN)";
  } // Invalid address
  else if (
    /[^a-zA-Z0-9]/.test(address) ||
    address.length < 26 ||
    address.length > 90
  ) {
    return "Invalid address";
  }

  // Unknown Network
  else {
    return "Unknown Network";
  }
};
