import { Tranche, PoolType, Tokens } from "../constant";

export const strategy0 = "0xf601912923D5Fc15AD10Bfdf5bbDE949363Fa703";

export const epoch0Pools = [
  {
    index: 0,
    name: "DAI/Compound",
    address: "0xdc41bbb87200d4e28a244e008cfe39a459a87fde",
    pair: [Tokens.Dai, Tokens.Comp],
    type: PoolType.Tranche,
    detail: [Tranche.S],
  },
];
