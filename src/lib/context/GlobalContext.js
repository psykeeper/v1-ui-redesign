import { createContext, useContext, useState } from "react";

export const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
  const [activePool, setActivePool] = useState();
  return (
    <GlobalContext.Provider
      value={{
        activePool,
        setActivePool,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
