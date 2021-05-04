import styled, { css, withTheme } from "styled-components";
import { FlexBox } from "components/Common/Box";
import ConnectButton from "./Items/ConnectButton";
import { useResponsiveContext } from "lib/context";
import Brand from "components/Common/Brand";
import { Space } from "antd";
import { useState } from "react";
import { useDarkMode } from "lib/utils/hooks";
import { useSaffronContext } from "lib/context";
import BigNumber from "bignumber.js";
import ToggleButton from "./Items/ToggleButton";
import BalanceModal from "./Items/BalanceModal";
import { Button } from "components/Common/Button";
import { useWeb3React } from "@web3-react/core";
import GasPrice from "components/Common/GasPrice";
import LanguageSelect from "components/Common/LanaugeSelect";
import { useTranslation } from "react-i18next";

const StyledNavBar = styled.div`
  color: ${({ theme }) => theme.typo.primary};
  background: ${({ theme }) => theme.header.background};
  padding: 1.2rem 2rem;
  display: flex;
  z-index: 50;

  justify-content: space-between;
  margin-left: 230px;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  ${({ shadow, theme }) =>
    shadow &&
    css`
      box-shadow: 0 8px 20px 1px ${theme.header.boxShadow};
    `}
  @media (max-width: 1024px) {
    margin-left: 56px;
  }
  @media (max-width: 768px) {
    margin-left: 0px;
    padding-left: 0.6rem;
  }
`;

const Label = styled.span`
  color: ${({ theme }) => theme.typo.secondary};
`;
const Price = styled.span`
  color: ${({ theme }) => theme.highlight};
  margin-left: 5px;
`;

const PriceBox = ({ label, price, ...rest }) => {
  return (
    <FlexBox>
      <Label>{label}:</Label>
      <Price {...rest}>{price}</Price>
    </FlexBox>
  );
};

const NavBar = ({ theme: currentTheme, ...rest }) => {
  const { isLightTheme, isTablet, isMobile, isLaptop } = useResponsiveContext();
  const [theme, toggleTheme] = useDarkMode();
  const { library } = useWeb3React();
  const [modalVisible, setModalVisible] = useState(false);
  const { portfolio, saffronPrice, getPrice, balance } = useSaffronContext();
  const ethPrice = getPrice("ethereum");
  const { t } = useTranslation();

  const onBalanceClick = () => {
    setModalVisible(true);
  };

  return (
    <>
      <StyledNavBar {...rest}>
        {isTablet ? (
          <Brand iconSize={isMobile ? "16px" : "20px"} color={currentTheme.typo.primary} />
        ) : (
          <FlexBox gap={20} alignItems="center">
            <PriceBox label={t("home.portfolio")} price={`$${new BigNumber(portfolio).toFormat(0)}`} />
            {!isLaptop && (
              <>
                <PriceBox label="SFI" price={`$${new BigNumber(saffronPrice).toFormat(0)}`} />
                <PriceBox label="ETH" price={`$${new BigNumber(ethPrice).toFormat(0)}`} />
              </>
            )}
            {!isMobile && <GasPrice />}
          </FlexBox>
        )}
        <FlexBox>
          <Space size={10}>
            {isLaptop && !isTablet && <LanguageSelect />}
            <ToggleButton theme={theme} toggleTheme={toggleTheme} />
            {library && (
              <Button
                sm={isMobile}
                onClick={() => onBalanceClick()}
                bold
                {...(isLightTheme ? { primary: true } : { secondary: true })}
              >
                {new BigNumber(balance).toFormat(4)} SFI
              </Button>
            )}
            <ConnectButton />
          </Space>
        </FlexBox>
      </StyledNavBar>
      <BalanceModal setVisible={setModalVisible} visible={modalVisible} />
    </>
  );
};

export default withTheme(NavBar);
