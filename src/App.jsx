import React from "react";
import GlobalStyles from "components/Theme/globalStyle";
import MainWrapper from "./views/MainWrapper";
import { ResponsiveThemeProvider, SaffronContextProvider, GlobalContextProvider } from "./lib/context";
import ScrollToTop from "react-router-scroll-top";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
const getLibrary = (provider) => {
  return new Web3Provider(provider);
};

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ResponsiveThemeProvider>
        <SaffronContextProvider>
          <GlobalContextProvider>
            <GlobalStyles />
            <ScrollToTop>
              <MainWrapper />
            </ScrollToTop>
          </GlobalContextProvider>
        </SaffronContextProvider>
      </ResponsiveThemeProvider>
    </Web3ReactProvider>
  );
};

export default App;
