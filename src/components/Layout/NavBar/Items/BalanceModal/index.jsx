import { Modal } from "antd";
import styled from "styled-components";
import sfiImage from "static/tokens/big-saffron.png";
import { useSaffronContext } from "lib/context";
import { Typography } from "components/Common/Statistic";
import { FlexBox, RippleBox } from "components/Common/Box";
import PriceChange from "./PriceChange";
import { useMemo, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { SaffronLPToken } from "lib/contracts";
import { useWeb3React } from "@web3-react/core";
import { useMarketData } from "lib/utils/hooks";
import { useTranslation } from "react-i18next";

const StyledModal = styled(Modal)`
  .ant-modal-header {
    border-bottom: none;
    padding: 0.8rem 1rem;
    background: transparent;
  }
  .ant-modal-content {
    background: ${({ theme }) => theme.balanceModal.background};
    color: ${({ theme }) => theme.balanceModal.color};
  }
  .ant-modal-body {
    border: 1px solid ${({ theme }) => theme.balanceModal.border};
    background: ${({ theme }) => theme.balanceModal.container};
    margin: 0 1rem;
    overflow: auto;
    max-height: 600px;
  }
  .ant-modal-title {
    font-size: 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: ${({ theme }) => theme.balanceModal.color};
  }
  .ant-modal-footer {
    border-top: none;
    padding: 1rem;
    background: transparent;
    background: ${({ theme }) => theme.balanceModal.container};
    font-size: 11px;
  }
`;

const Container = styled(FlexBox)`
  width: 100%;
  font-size: 16px;
  .sub_container {
    margin-top: 32px;
    width: 100%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const Divider = styled.div`
  height: 0px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.balanceModal.divider};
`;

const ExplorerButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.balanceModal.button.background};
  border: 1px solid ${({ theme }) => theme.balanceModal.button.border};
  color: ${({ theme }) => theme.balanceModal.button.color};
  cursor: pointer;
  width: 250px;
  font-size: 12px;
  text-align: center;
  &:hover {
    background: ${({ theme }) => theme.balanceModal.button.hover};
  }
  &:focus,
  &:active {
    outline: none;
  }
`;

const StyledFooter = styled(FlexBox)`
  border: 1px solid ${({ theme }) => theme.balanceModal.border};
  padding: 0.6rem 24px;
  a {
    text-decoration: underline;
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  return (
    <StyledFooter flexDirection="row" justifyContent="space-between" alignItems="center">
      <a
        rel="noreferrer"
        target="_blank"
        href="https://app.uniswap.org/#/swap?outputCurrency=0xb753428af26e81097e7fd17f40c88aaa3e04902c"
      >
        {t("modal.view.uniswap")}
      </a>
      <a
        rel="noreferrer"
        target="_blank"
        href="https://app.sushi.com/swap?outputCurrency=0xb753428af26e81097e7fd17f40c88aaa3e04902c"
      >
        {t("modal.view.sushiswap")}
      </a>
      <a href="https://www.dharma.io/token/0xb753428af26e81097e7fd17f40c88aaa3e04902c" rel="noreferrer" target="_blank">
        {t("modal.view.dharma")}
      </a>
    </StyledFooter>
  );
};

const BalanceModal = ({ setVisible, visible }) => {
  const marketData = useMarketData();
  const { balance, saffronPrice, pools, currentEpoch } = useSaffronContext();
  const { account, library } = useWeb3React();
  const [sfiStaked, setSfiStaked] = useState(0);
  const { t } = useTranslation();

  const sfiPrincipal = useMemo(() => {
    const STAKING_POOL_ID = 2;
    if (!pools || !pools[STAKING_POOL_ID].principal_token) return;
    const sfi_principal_address = pools[STAKING_POOL_ID].principal_token[currentEpoch];
    if (sfi_principal_address && library) return new SaffronLPToken(sfi_principal_address, library);
  }, [library, currentEpoch, pools]);

  useEffect(() => {
    if (!sfiPrincipal) return;
    sfiPrincipal.balanceOf(account).then((amount) => setSfiStaked(new BigNumber(amount.toString()).toFormat(2)));
  }, [sfiPrincipal, account]);
  const onExplorerClicked = () => {
    window.open("https://info.uniswap.org/token/0xb753428af26e81097e7fd17f40c88aaa3e04902c");
  };

  return (
    <StyledModal
      visible={visible}
      width={450}
      height={640}
      centered
      closable={false}
      maskClosable={true}
      title={[
        <span key="sfi_balance">{t("modal.sfibreakdown")}</span>,
        marketData && <PriceChange key="market_data" marketData={marketData} />,
      ]}
      footer={<Footer />}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      <Container flexDirection="column" alignItems="center" justifyContent="center" gap={12}>
        <img src={sfiImage} alt="sfi" style={{ marginBottom: 5 }} />
        <Typography size={30}>{new BigNumber(balance).toFormat(4)}</Typography>
        <FlexBox flexDirection="column" alignItems="center" justifyContent="center" gap={12} className="sub_container">
          <Row>
            <Typography>{t("balance")}</Typography>
            <Typography>{new BigNumber(balance).toFormat(4)} SFI</Typography>
          </Row>
          <Row>
            <Typography>{t("sfistaked")}</Typography>
            <Typography>{sfiStaked} SFI</Typography>
          </Row>
          <Divider />
          <Row>
            <Typography>SFI {t("price")}</Typography>
            <Typography>${saffronPrice}</Typography>
          </Row>
          {marketData && (
            <>
              <Row>
                <Typography>{t("circulating_supply")}</Typography>
                <Typography>{new BigNumber(marketData.circulating_supply).toFormat(0)}</Typography>
              </Row>
              <Row>
                <Typography>{t("total_supply")}</Typography>
                <Typography>{new BigNumber(marketData.total_supply).toFormat(0)}</Typography>
              </Row>
              <Row>
                <Typography>{t("max_supply")}</Typography>
                <Typography>{new BigNumber(marketData.max_supply).toFormat(0)}</Typography>
              </Row>
            </>
          )}
          <RippleBox style={{ marginTop: 16 }}>
            <ExplorerButton onClick={() => onExplorerClicked()}>{t("modal.view.explorer")}</ExplorerButton>
          </RippleBox>
        </FlexBox>
      </Container>
    </StyledModal>
  );
};

export default BalanceModal;
