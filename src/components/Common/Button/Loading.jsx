import styled, { keyframes } from "styled-components";

const progressAnim = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  border: solid 2px transparent;
  border-top-color: #29d;
  border-left-color: #29d;
  border-radius: 50%;
  animation-name: ${progressAnim} 900ms linear infinite;
`;
const Loading = () => <LoadingSpinner />;
export default Loading;
