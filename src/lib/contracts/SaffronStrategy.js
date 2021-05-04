import SaffronStrategyABI from "lib/config/abi/SaffronStrategy.json";
import { Contract } from "ethers";
export class SaffronStrategy extends Contract {
  constructor(address, provider) {
    super(address, SaffronStrategyABI, provider);
  }
}
