import SushiV2FactoryABI from "lib/config/abi/SushiV2Factory.json";
import { Contract } from "ethers";

export const SUSHIFACTORYAddress = "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac";
export class SushiFactory extends Contract {
  constructor(provider) {
    super(SUSHIFACTORYAddress, SushiV2FactoryABI, provider);
  }
}
