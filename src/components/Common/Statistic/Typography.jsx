import styled, { css } from "styled-components";

const Typography = styled.div`
  font-weight: ${({ weight }) => (weight ? `${weight}` : "normal")};
  font-size: ${({ size }) => (size ? `${size}px` : "inherit")};
  ${({ underline }) =>
    underline &&
    css`
      text-decoration: underline;
    `}
  ${({ primary }) =>
    primary &&
    css`
      color: ${({ theme }) => theme.typo.primary};
    `}
  ${({ uppercase }) =>
    uppercase &&
    css`
      text-transform: uppercase;
    `}
  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
  ${({ secondary }) =>
    secondary &&
    css`
      color: ${({ theme }) => theme.typo.secondary};
    `}
  word-break: break-word;
`;

export default Typography;
