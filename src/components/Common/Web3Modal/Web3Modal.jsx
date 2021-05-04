import { Modal } from "components/Common";
import { Row, Col } from "antd";
import { useState, useEffect } from "react";
import PrivacyBox from "./Privacy";
import {
  MetamaskIcon,
  WalletConnectIcon,
  TorusIcon,
  PortisIcon,
  LedgerWhiteIcon,
  LedgerIcon,
  FortmaticIcon,
  AuthereumIcon,
  WalletLinkIcon,
} from "./Icons";
import ConnectorItem from "./ConnectorItem";
import toast from "react-hot-toast";
import { useResponsiveContext } from "lib/context";
import { injected, walletconnect, authereum, portis, ledger, walletlink, torus, fortmatic } from "./Connectors";
import { useWeb3React } from "@web3-react/core";
import { NETWORKID } from "lib/config/constant";
import { useEagerConnect, useInactiveListener } from "./useEagerConnect";

const Web3Modal = ({ visible, setVisible }) => {
  const { isLightTheme } = useResponsiveContext();
  const [agreement, setAgreement] = useState(false);
  const itemList = [
    {
      icon: MetamaskIcon,
      title: "Metamask",
      connector: injected,
    },
    {
      icon: WalletConnectIcon,
      title: "Wallet Connect",
      connector: walletconnect,
    },
    {
      icon: PortisIcon,
      title: "Portis",
      connector: portis,
    },
    {
      icon: WalletLinkIcon,
      title: "Coinbase",
      connector: walletlink,
    },
    {
      icon: isLightTheme ? LedgerIcon : LedgerWhiteIcon,
      title: "Ledger",
      connector: ledger,
    },
    {
      icon: FortmaticIcon,
      title: "Fortmatic",
      connector: fortmatic,
    },
    {
      icon: TorusIcon,
      title: "Torus",
      connector: torus,
    },
    {
      icon: AuthereumIcon,
      title: "Authereum",
      connector: authereum,
    },
  ];
  const [activatingConnector, setActivatingConnector] = useState();
  const { connector, activate, deactivate, error, account, chainId } = useWeb3React();
  useEffect(() => {
    if (chainId && chainId !== NETWORKID) {
      toast.error("Please change to the Mainnet");
      deactivate();
    }
  }, [chainId, deactivate]);
  const onConnectClick = (web3connector) => {
    if (connector === web3connector) {
      deactivate();
    } else {
      setActivatingConnector(web3connector);
      activate(web3connector);
    }
  };

  useEffect(() => {
    if (account) setVisible(false);
  }, [account, setVisible]);

  useEffect(() => {
    if (activatingConnector && error) {
      if (connector && connector.walletConnectProvider) {
        connector.walletConnectProvider = undefined;
      }
      deactivate();
    }

    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector, deactivate, error]);
  const { ethereum } = window;
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);
  return (
    <Modal
      visible={visible}
      width={650}
      centered
      footer={false}
      border={false}
      title="Connect Wallet"
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      <PrivacyBox setChecked={setAgreement} />
      <Row gutter={[10, 10]}>
        {itemList.map(({ icon, title, connector: web3connector }, index) => {
          const currentConnector = web3connector;
          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          return (
            <Col xl={8} md={8} xs={24} key={index}>
              <ConnectorItem
                icon={icon}
                disabled={!agreement || (title === "Metamask" && !ethereum)}
                title={title}
                loading={activating}
                connected={connected}
                onClick={() => onConnectClick(web3connector)}
              />
            </Col>
          );
        })}
      </Row>
    </Modal>
  );
};

export default Web3Modal;
