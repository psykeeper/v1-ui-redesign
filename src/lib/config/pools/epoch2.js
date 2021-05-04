import { Tranche, PoolType, StakingType, Tokens } from "../constant";

export const strategy2 = "0x36f23BaB8c0D4B643e796E317E9C115FE9d6c3b8";
export const epoch2Pools = [
  {
    index: 0,
    name: "DAI/Compound",
    address: "0x2b4BAE932193a1Db00b3836121B60a149ec1a4D7",
    type: PoolType.Tranche,
    detail: [Tranche.S, Tranche.A],
    pair: [Tokens.Dai, Tokens.Comp],
  },
  {
    index: 1,
    name: "Uni SFI/ETH",
    address: "0x4b199eb661dA6BE4d595dDB9f2B1e03dFb07C9B4",
    type: PoolType.UniPool,
    pair: [Tokens.Sfi, Tokens.Eth],
  },
  {
    index: 2,
    name: "SFI Staking",
    address: "0x92d5521E29d4776a2FEe821B25c93D8f6Cc7D390",
    type: PoolType.StakingPool,
    detail: StakingType.SFIStaking,
    pair: [Tokens.SfiStaking],
  },
  {
    index: 3,
    name: "UNI SFI/BTSE",
    address: "0x951Ce65d69563601d33C2Bc0ad26fCb6568714a7",
    type: PoolType.UniPool,
    pair: [Tokens.Btse, Tokens.Sfi],
  },
];
