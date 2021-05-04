import UniV2FactoryABI from "lib/config/abi/UniV2Factory.json";
import { Contract } from "ethers";

export const UNIFACTORYAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

export class UniV2Factory extends Contract {
  constructor(provider) {
    super(UNIFACTORYAddress, UniV2FactoryABI, provider);
  }
}
