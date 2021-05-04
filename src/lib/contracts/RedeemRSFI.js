import RedeemRSFIABI from "lib/config/abi/RedeemRSFI.json";
import { Contract } from "ethers";

export const REDEEMRSFIAddress = "0x710c4147bE2F21e4229AAa0DFA8b64689cbBd9C9";
export class RedeemRSFI extends Contract {
  constructor(provider) {
    super(REDEEMRSFIAddress, RedeemRSFIABI, provider);
  }
}
