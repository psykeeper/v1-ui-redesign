import SaffronPoolABI from "lib/config/abi/SaffronPool.json";
import { Contract } from "ethers";
export class SaffronPool extends Contract {
  constructor(address, provider) {
    super(address, SaffronPoolABI, provider);
  }
}
