import SaffronLpTokenABI from "lib/config/abi/SaffronLpToken.json";
import { Contract } from "ethers";

export class SaffronLPToken extends Contract {
  constructor(address, provider) {
    super(address, SaffronLpTokenABI, provider);
  }
}
