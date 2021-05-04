import styled from "styled-components";
const StyledIconGroupContainer = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    &:not(:first-child) {
      margin-left: ${({ offset }) => (offset !== undefined ? `${offset}px` : "-20px")};
    }
  }
`;

const IconGroupWrapper = ({ icons, ...rest }) => {
  return (
    <StyledIconGroupContainer {...rest}>
      {icons &&
        icons.map((elem, index) => {
          return <img src={elem} alt={index} key={index} />;
        })}
    </StyledIconGroupContainer>
  );
};
export default IconGroupWrapper;
