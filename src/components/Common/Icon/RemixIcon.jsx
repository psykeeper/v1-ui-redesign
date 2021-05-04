import styled from "styled-components";
const StyledIcon = styled.i`
  color: ${({ active, color, theme }) => (active ? theme.icon.active : color ? color : theme.icon.color)};
  font-size: ${({ size }) => (size ? `${size}px` : "20px")};
`;
const RemixIcon = ({ icon, ...rest }) => {
  return <StyledIcon className={"ri-" + icon} {...rest}></StyledIcon>;
};

export default RemixIcon;
