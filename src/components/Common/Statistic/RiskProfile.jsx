import styled, { css } from "styled-components";

const Highlight = styled.span`
  ${({ theme, highlight }) =>
    highlight &&
    css`
      color: ${theme.table.risk};
    `};
`;

export default Highlight;
