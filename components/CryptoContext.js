// CryptoContext.js
import React, { createContext, useState } from "react";

export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [cryptoCount, setCryptoCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <CryptoContext.Provider
      value={{ cryptoCount, setCryptoCount, isDarkMode, setIsDarkMode }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
