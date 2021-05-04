import styled from "styled-components";

const Highlight = styled.span`
  font-weight: 700;
  color: ${({ color, theme }) => (color ? color : theme.highlight)};
`;

export default Highlight;
