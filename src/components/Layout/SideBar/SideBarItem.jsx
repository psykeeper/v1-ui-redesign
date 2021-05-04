import styled from "styled-components";
import { RippleBox } from "components/Common/Box";
import { useHistory } from "react-router-dom";
import React from "react";
import { useResponsiveContext } from "lib/context";

const StyledSideBarItem = styled.button`
  background: ${({ active, theme }) => (active ? theme.sidebar.active.background : theme.sidebar.background)};
  &:hover {
    background: ${({ theme, active }) => (!active ? theme.sidebar.hover : theme.sidebar.active.background)};
  }
  width: 100%;
  color: ${({ active, theme }) => (active ? theme.sidebar.active.text : theme.sidebar.text)};
  padding: 1rem;
  @media (max-width: 1024px) and (min-width: 768px) {
    padding: 1.2rem 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  border: none;
  font-size: 13px;
  display: flex;
  text-decoration: none;
  font-family: inherit;
  align-items: center;
  cursor: pointer;

  &:focus,
  &:active {
    outline: 0;
  }
  span {
    margin-left: 1rem;
  }
`;
const SideBarItem = ({ to, icon, href, showSidebar, children }) => {
  const history = useHistory();
  const { isLaptop, isTablet, isLightTheme } = useResponsiveContext();

  const navigate = () => {
    showSidebar(false);
    if (to) history.push(to);
    else if (href) {
      window.open(href);
    }
  };

  return (
    <RippleBox color={isLightTheme ? "#00000032" : "#ffffff32"}>
      <StyledSideBarItem active={history.location.pathname === to} onClick={navigate}>
        {React.cloneElement(icon, { active: history.location.pathname === to })}
        {(!isLaptop || isTablet) && <span>{children}</span>}
      </StyledSideBarItem>
    </RippleBox>
  );
};

export default SideBarItem;
