import SaffronERC20StakingPoolABI from "lib/config/abi/SaffronERC20StakingPool.json";
import { Contract } from "ethers";
export class SaffronERC20StakingPool extends Contract {
  constructor(address, provider) {
    super(address, SaffronERC20StakingPoolABI, provider);
  }
}
