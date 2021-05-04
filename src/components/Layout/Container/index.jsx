import styled from "styled-components";
const StyledContainer = styled.div`
  z-index: 0;
  margin-left: 230px;
  margin-top: 60px;
  padding: 2rem;
  @media (max-width: 1024px) {
    margin-left: 56px;
  }
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Container = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

export default Container;
