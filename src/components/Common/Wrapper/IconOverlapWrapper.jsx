import styled from "styled-components";
const StyledIconGroupContainer = styled.div`
  position: relative;
  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 0;

    &:nth-child(2) {
      position: absolute;
      width: 19px;
      height: 19px;
      left: 12px;
      top: 12px;
    }
  }
`;

const IconOverlapWrapper = ({ icons }) => {
  return (
    <StyledIconGroupContainer>
      {icons &&
        icons.map((elem, index) => {
          return <img src={elem} alt={index} key={index} />;
        })}
    </StyledIconGroupContainer>
  );
};
export default IconOverlapWrapper;
