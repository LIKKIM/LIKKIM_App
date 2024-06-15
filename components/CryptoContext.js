// CryptoContext.js
import React, { createContext, useState } from "react";

export const CryptoContext = createContext();
export const DarkModeContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [cryptoCount, setCryptoCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currencyUnit, setCurrencyUnit] = useState("USD"); // 新增

  return (
    <CryptoContext.Provider
      value={{ cryptoCount, setCryptoCount, currencyUnit, setCurrencyUnit }}
    >
      <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </CryptoContext.Provider>
  );
};
