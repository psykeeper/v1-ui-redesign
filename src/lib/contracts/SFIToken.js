import SFIABI from "lib/config/abi/SFI.json";
import { Contract } from "ethers";

export const SFI_CONTRACT = "0xb753428af26e81097e7fd17f40c88aaa3e04902c";
export class SFIToken extends Contract {
  constructor(provider) {
    super(SFI_CONTRACT, SFIABI, provider);
  }
}
