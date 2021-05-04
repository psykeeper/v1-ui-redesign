import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { LedgerConnector } from "@web3-react/ledger-connector";
import { AuthereumConnector } from "@web3-react/authereum-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { TorusConnector } from "@web3-react/torus-connector";
require("dotenv").config();

const POLLING_INTERVAL = 12000;

const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
  4: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
};

export const injected = new InjectedConnector({
  supportedChainIds: [1],
});

export const ledger = new LedgerConnector({
  chainId: 1,
  url: RPC_URLS[1],
  pollingInterval: POLLING_INTERVAL,
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: "Saffron",
  appLogoUrl: "https://app.saffron.finance/assets/images/saffron.png",
});

export const authereum = new AuthereumConnector({ chainId: 42 });

export const fortmatic = new FortmaticConnector({
  apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
  chainId: 1,
});

export const portis = new PortisConnector({
  dAppId: process.env.REACT_APP_PORTIS_DAPP_ID,
  networks: [1, 100],
});

export const torus = new TorusConnector({ chainId: 1 });
