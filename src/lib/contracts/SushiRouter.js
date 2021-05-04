import SushiV2RouterABI from "lib/config/abi/SushiV2Router.json";
import { Contract } from "ethers";

export const SUSHIROUTERAddress = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";

export class SushiRouter extends Contract {
  constructor(provider) {
    super(SUSHIROUTERAddress, SushiV2RouterABI, provider);
  }
}
