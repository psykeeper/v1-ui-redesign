import styled from "styled-components";
import { useResponsiveContext } from "lib/context";
import { RemixIcon } from "components/Common/Icon";
const ToggleContainer = styled.button`
  margin-top: 50px;
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  height: 30px;
  width: 30px;
  overflow: hidden;
  margin: auto;
  display: flex;
  &:focus,
  &:active {
    outline: none;
  }
  i {
    height: auto;
    transition: all 0.3s linear;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    &:first-child {
      color: ${({ theme, lightTheme }) => (lightTheme ? theme.typo.secondary : "white")};
      top: ${({ lightTheme }) => (lightTheme ? "50%" : "-50%")};
    }

    &:nth-child(2) {
      top: ${({ lightTheme }) => (lightTheme ? "150%" : "50%")};
    }
  }
`;

const ToggleButton = () => {
  const { isLightTheme, toggleTheme } = useResponsiveContext();
  return (
    <ToggleContainer lightTheme={isLightTheme} onClick={toggleTheme}>
      <RemixIcon icon="sun-fill" size={24} />
      <RemixIcon icon="moon-fill" size={24} />
    </ToggleContainer>
  );
};

export default ToggleButton;
