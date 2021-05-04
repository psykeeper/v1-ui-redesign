import * as Icon from "components/Common/TokenIcon";
import { BigNumber } from "ethers";
require("dotenv").config();

export const Tranche = {
  S: 0,
  AA: 1,
  A: 2,
};

export const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

export const PoolType = {
  Tranche: "Tranche",
  UniPool: "Uni",
  SushiPool: "Sushi",
  StakingPool: "Staking",
};

export const StakingType = {
  SFIStaking: "SFIStaking",
};

export const Tokens = {
  Dai: {
    name: "DAI",
    tag: "dai",
    icon: Icon.Dai,
    decimals: 18,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  Comp: {
    name: "Compound",
    icon: Icon.Comp,
  },
  SfiStaking: {
    name: "SFI",
    tag: "saffron-finance",
    icon: Icon.SfiStaking,
    decimals: 18,
    address: "0xb753428af26e81097e7fd17f40c88aaa3e04902c",
  },
  Sfi: {
    name: "SFI",
    tag: "saffron-finance",
    icon: Icon.Sfi,
    decimals: 18,
    address: "0xb753428af26e81097e7fd17f40c88aaa3e04902c",
  },
  Eth: {
    name: "ETH",
    tag: "ethereum",
    icon: Icon.Eth,
    decimals: 18,
    address: WETH,
  },
  Btse: {
    name: "BTSE",
    tag: "btse-token",
    icon: Icon.Btse,
    decimals: 8,
    address: "0x666d875c600aa06ac1cf15641361dec3b00432ef",
  },
  Wbtc: {
    name: "WBTC",
    tag: "wrapped-bitcoin",
    icon: Icon.Wbtc,
    decimals: 8,
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  },
  Geeq: {
    name: "GEEQ",
    tag: "geeq",
    icon: Icon.Geeq,
    decimals: 18,
    address: "0x6B9f031D718dDed0d681c20cB754F97b3BB81b78",
  },
  Esd: {
    name: "ESD",
    tag: "empty-set-dollar",
    icon: Icon.Esd,
    decimals: 18,
    address: "0x36F3FD68E7325a35EB768F1AedaAe9EA0689d723",
  },
  ibeth: {
    name: "ibEth",
    tag: "interest-bearing-eth",
    icon: Icon.ibeth,
    decimals: 18,
    address: "0x67B66C99D3Eb37Fa76Aa3Ed1ff33E8e39F0b9c7A",
  },
  Alpha: {
    name: "ALPHA",
    tag: "alpha-finance",
    icon: Icon.Alpha,
    decimals: 18,
    address: "0xa1faa113cbe53436df28ff0aee54275c13b40975",
  },
  Rari: {
    name: "RARI",
    icon: Icon.Rari,
  },
  Prt: {
    name: "PRT",
    tag: "portion",
    icon: Icon.Prt,
    decimals: 18,
    address: "0x6D0F5149c502faf215C89ab306ec3E50b15e2892",
  },
  Usdt: {
    name: "USDT",
    tag: "tether",
    icon: Icon.Usdt,
    decimals: 6,
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  Usdc: {
    name: "USDC",
    tag: "usd-coin",
    icon: Icon.Usdc,
    decimals: 6,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
};

// const NETWORKID = process.env.NODE_ENV === "development" ? 4 : 1;
export const NETWORKID = 1;

export const MAXUINT256 = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
