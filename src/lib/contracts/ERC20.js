import ERC20ABI from "lib/config/abi/ERC20.json";
import { Contract } from "ethers";

export class ERC20 extends Contract {
  constructor(address, provider) {
    super(address, ERC20ABI, provider);
  }
}
