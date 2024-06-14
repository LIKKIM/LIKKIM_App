import React, { createContext, useState } from "react";

export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [cryptoCount, setCryptoCount] = useState(0);

  return (
    <CryptoContext.Provider value={{ cryptoCount, setCryptoCount }}>
      {children}
    </CryptoContext.Provider>
  );
};
