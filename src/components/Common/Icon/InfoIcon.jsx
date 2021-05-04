import styled, { withTheme } from "styled-components";

const StyledDiv = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  cursor: pointer;
`;

const InfoIcon = ({ theme }) => {
  return (
    <StyledDiv>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.25 1V13C0.25 13.4148 0.58525 13.75 1 13.75H13C13.4148 13.75 13.75 13.4148 13.75 13V1C13.75 0.586 13.4148 0.25 13 0.25H1C0.58525 0.25 0.25 0.586 0.25 1ZM6.25 3.25H7.75V4.75H6.25V3.25ZM6.25 6.25H7.75V10.75H6.25V6.25Z"
          fill={theme.icon.background}
        />
      </svg>
    </StyledDiv>
  );
};

export default withTheme(InfoIcon);
