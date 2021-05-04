import styled, { css } from "styled-components";
import { RippleBox } from "components/Common/Box";
import Loading from "./Loading";
const StyledButton = styled.button`
  ${({ ghost }) =>
    ghost
      ? css`
          background: transparent;
          border: 1px solid
            ${({ secondary, theme }) =>
              secondary ? theme.button.secondary.background : theme.button.primary.background};
          color: ${({ secondary, theme }) =>
            secondary ? theme.button.secondary.background : theme.button.primary.background};
        `
      : css`
          border: none;
          background: ${({ secondary, theme }) =>
            secondary ? theme.button.secondary.background : theme.button.primary.background};
          color: ${({ secondary, theme }) => (secondary ? theme.button.secondary.text : theme.button.primary.text)};
        `}
  padding: 5px 20px;
  ${({ bold }) =>
    bold &&
    css`
      font-weight: bold;
    `}
  border-radius: 0.2rem;
  white-space: nowrap;
  font-size: ${({ size }) => (size ? `${size}px` : "14px")};
  ${({ long }) =>
    long &&
    css`
      padding: 5px 32px;
    `}
  ${({ sm }) =>
    sm &&
    css`
      padding: 5px 8px;
      font-size: 11px;
    `}
  font-family: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  & > div {
    margin-right: 5px;
  }
  cursor: pointer;
  &:focus {
    outline: 0;
  }
  &:disabled {
    background: ${({ theme }) => theme.button.disabled.background};
    color: ${({ theme }) => theme.button.disabled.text};
    cursor: not-allowed;
  }
  &:hover:enabled {
    ${({ ghost }) =>
      ghost
        ? css`
            border: 1px solid
              ${({ secondary, theme }) => (secondary ? theme.button.secondary.hover : theme.button.primary.hover)};
            color: ${({ secondary, theme }) => (secondary ? theme.button.secondary.hover : theme.button.primary.hover)};
          `
        : css`
            background: ${({ secondary, theme }) =>
              secondary ? theme.button.secondary.hover : theme.button.primary.hover};
          `}
  }
`;

const Button = ({ size, loading, secondary, children, ...rest }) => {
  return (
    <RippleBox>
      <StyledButton size={size} secondary={secondary} {...rest}>
        {loading && <Loading />}
        {children}
      </StyledButton>
    </RippleBox>
  );
};

export default Button;
