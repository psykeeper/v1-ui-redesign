import styled, { css } from "styled-components";
import Brand from "components/Common/Brand";
import SideBarItem from "./SideBarItem";
import ToggleSideBar from "./ToggleSideBar";
import { useState, useRef, useEffect } from "react";
import SidebarMask from "./SidebarMask";
import { useResponsiveContext } from "lib/context";
import { AddLiquidityIcon, CommunityIcon, DashboardIcon, DocsIcon, PortfolioIcon, RedeemIcon } from "./Icons";
import { useOuterClickNotifier } from "lib/utils/hooks";
import GasPrice from "components/Common/GasPrice";
import LanguageSelect from "components/Common/LanaugeSelect";
import { useTranslation } from "react-i18next";

const Divider = styled.div`
  width: 80%;
  height: 0;
  margin: 16px auto;
  border: 1px solid ${({ theme }) => theme.sidebar.divider};
`;
const StyledSideBar = styled.div`
  width: 230px;
  outline: 0;
  z-index: 100;
  position: fixed;
  top: 0;
  height: 100%;
  transition: all 0.2s ease 0s;
  background: ${({ theme }) => theme.sidebar.background};
  @media (max-width: 1024px) {
    width: 56px;
  }
  @media (max-width: 768px) {
    ${({ show }) =>
      show
        ? css`
            width: 230px;
            margin-left: 0px;
          `
        : css`
            width: 230px;
            margin-left: -230px;
          `}
  }
`;

const SideBar = () => {
  const sideMenuRef = useRef(null);
  const [isOpened, showSidebar] = useState(false);
  const { isTablet, isMobile, isLaptop } = useResponsiveContext();
  const { t } = useTranslation();

  useOuterClickNotifier(() => {
    showSidebar(false);
  }, [sideMenuRef]);

  useEffect(() => {
    if (!isTablet) showSidebar(false);
  }, [isTablet]);

  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [isOpened]);

  return (
    <>
      <StyledSideBar show={isOpened} ref={sideMenuRef}>
        <Brand />
        <SideBarItem to="/dashboard" showSidebar={showSidebar} icon={<DashboardIcon />}>
          {t("dashboard")}
        </SideBarItem>
        <SideBarItem to="/portfolio" showSidebar={showSidebar} icon={<PortfolioIcon />}>
          {t("home.portfolio")}
        </SideBarItem>
        <SideBarItem to="/addliquidity" showSidebar={showSidebar} icon={<AddLiquidityIcon />}>
          {t("addliquidity")}
        </SideBarItem>
        <SideBarItem to="/redeem" showSidebar={showSidebar} icon={<RedeemIcon />}>
          {t("redeem")}
        </SideBarItem>
        <Divider />
        <SideBarItem to="/docs" showSidebar={showSidebar} icon={<DocsIcon />}>
          {t("docs")}
        </SideBarItem>
        <SideBarItem to="/community" showSidebar={showSidebar} icon={<CommunityIcon />}>
          {t("community")}
        </SideBarItem>
        {isMobile && (
          <div style={{ padding: "1.2rem" }}>
            <GasPrice />
          </div>
        )}
        {(!isLaptop || isTablet) && <LanguageSelect />}
      </StyledSideBar>
      {!isOpened && <ToggleSideBar showSidebar={showSidebar} />}
      <SidebarMask isOpened={isOpened} />
    </>
  );
};
export default SideBar;
