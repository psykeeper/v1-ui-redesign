import { Button } from "components/Common/Button";
import { useState } from "react";
import { Web3Modal } from "components/Common/Web3Modal";
import { useWeb3React } from "@web3-react/core";
import { useResponsiveContext } from "lib/context";
const ConnectButton = () => {
  const [isOpened, setOpened] = useState(false);
  const { account, deactivate } = useWeb3React();
  const { isMobile } = useResponsiveContext();
  const compressAddress = (address) =>
    address.substr(0, 6) + "..." + address.substr(address.length - 4, address.length);
  return (
    <>
      {account ? (
        <Button ghost sm={isMobile} onClick={() => deactivate()}>
          {compressAddress(account)}
        </Button>
      ) : (
        <Button onClick={() => setOpened(true)} sm={isMobile}>
          Connect Wallet
        </Button>
      )}
      <Web3Modal visible={isOpened} setVisible={setOpened} />
    </>
  );
};

export default ConnectButton;
