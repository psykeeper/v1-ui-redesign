import UniV2RouterABI from "lib/config/abi/UniV2Router.json";
import { Contract } from "ethers";

export const UNIROUTERAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export class UniV2Router extends Contract {
  constructor(provider) {
    super(UNIROUTERAddress, UniV2RouterABI, provider);
  }
}
