import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
`;
const SidebarMask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 60;
  height: 0;
  background-color: rgba(0, 0, 0, 0.45);
  opacity: 0;
  -webkit-transition: opacity 0.3s linear, height 0s ease 0.3s;
  transition: opacity 0.3s linear, height 0s ease 0.3s;
  pointer-events: none;
  ${({ isOpened }) =>
    isOpened &&
    css`
      height: 100vh;
      opacity: 1;
      -webkit-transition: none;
      transition: none;
      backdrop-filter: blur(4px);
      -webkit-animation: ${fadeIn} 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
      animation: ${fadeIn} 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
      pointer-events: auto;
    `}
`;

export default SidebarMask;
