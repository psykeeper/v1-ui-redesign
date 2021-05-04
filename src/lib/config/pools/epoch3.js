import { Tranche, PoolType, Tokens, StakingType } from "../constant";

export const strategy3 = "0xF4aA3b60eaD8DF9768816F20710a99bBF372393c";

export const epoch3Pools = [
  {
    index: 0,
    name: "DAI/Compound",
    address: "0xbbDfc1f8B6e73B6751A098574D0172945beD2953",
    type: PoolType.Tranche,
    detail: [Tranche.S, Tranche.A],
    pair: [Tokens.Dai, Tokens.Comp],
  },
  {
    index: 1,
    name: "Uni SFI/ETH",
    address: "0xeb21CCf3469A48b78295E23ff9b945179F043379",
    type: PoolType.UniPool,
    pair: [Tokens.Sfi, Tokens.Eth],
  },
  {
    index: 2,
    name: "SFI Staking",
    address: "0x48EF0725F8A3b94FCDB509c8Ea0CA24e096D6bD4",
    type: PoolType.StakingPool,
    detail: StakingType.SFIStaking,
    pair: [Tokens.SfiStaking],
  },
  {
    index: 3,
    name: "UNI SFI/BTSE",
    address: "0xF1f68aC42324Af2f98267152cACD89C94dAB6B2E",
    type: PoolType.UniPool,
    pair: [Tokens.Btse, Tokens.Sfi],
  },
  {
    index: 5,
    name: "UNI SFI/GEEQ",
    address: "0xB90ecBa35df184cB65076e976586d4e0d2B30592",
    type: PoolType.UniPool,
    pair: [Tokens.Geeq, Tokens.Sfi],
  },
  {
    index: 6,
    name: "UNI SFI/ESD",
    address: "0xB0733E4b88321e740B867Aa2006cb4D3b696D036",
    type: PoolType.UniPool,
    pair: [Tokens.Esd, Tokens.Sfi],
  },
  {
    index: 7,
    name: "Sushi SFI/ETH",
    address: "0x6C2Ed0CED5CD8607088fb739eb45E058dEBb8f48",
    type: PoolType.SushiPool,
    pair: [Tokens.Sfi, Tokens.Eth],
  },
  {
    index: 8,
    name: "UNI ibETH/ALPHA",
    address: "0x8d248822904a0A32bB6e1a3a395d76c27549C034",
    type: PoolType.UniPool,
    pair: [Tokens.ibeth, Tokens.Alpha],
  },
];
