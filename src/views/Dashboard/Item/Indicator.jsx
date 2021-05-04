import styled from "styled-components";

const Indicator = styled.div`
  width: 10px;
  height: 10px;
  border: 1px solid ${({ theme }) => theme.indicator.border};
  background: ${({ theme, fillBackground }) => (fillBackground ? theme.indicator.hover : theme.indicator.background)};
  margin: auto;
  border-radius: 50%;
  &:hover {
    background: ${({ theme }) => theme.indicator.hover};
  }
`;

export default Indicator;
