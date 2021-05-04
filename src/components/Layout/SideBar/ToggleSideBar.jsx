import styled, { withTheme } from "styled-components";
import { RemixIcon } from "components/Common/Icon";
import { useResponsiveContext } from "lib/context";
const StyledToggle = styled.div`
  position: fixed;
  top: 60px;
  left: 0px;
  box-shadow: 0 0px 8px 0px rgba(69, 65, 78, 0.5);
  border-radius: 5px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;
  padding: 3px 5px;
  background: ${({ theme }) => theme.sidebarToggle.background};
  z-index: 20;
  &:hover {
    background: ${({ theme }) => theme.sidebarToggle.hover};
  }
`;
const ToggleSideBar = ({ theme, showSidebar, ...rest }) => {
  const { isTablet } = useResponsiveContext();
  const toggleSidebar = () => {
    showSidebar(true);
  };
  return (
    <>
      {isTablet && (
        <StyledToggle {...rest} onClick={toggleSidebar}>
          <RemixIcon icon="align-left" color={theme.typo.primary} />
        </StyledToggle>
      )}
    </>
  );
};

export default withTheme(ToggleSideBar);
