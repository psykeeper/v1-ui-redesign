import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "nprogress/nprogress.css";
import rootReducer from "./reducers";
import * as serviceWorker from "./serviceWorker";
import BigNumber from "bignumber.js";
import "antd/dist/antd.less";
import "./styles/index.scss";
import "./styles/antd.scss";
import "remixicon/fonts/remixicon.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Transaction from "lib/config/i18n/translation.json";
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: Transaction,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindI18n: "languageChanged",
    },
  });

BigNumber.config({
  EXPONENTIAL_AT: [-100, 100],
});

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
