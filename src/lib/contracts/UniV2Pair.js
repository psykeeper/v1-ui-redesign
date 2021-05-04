import UniV2PairABI from "lib/config/abi/UniV2Pair.json";
import { Contract } from "ethers";
export class UniV2Pair extends Contract {
  constructor(address, provider) {
    super(address, UniV2PairABI, provider);
    this.library = provider;
  }
}
