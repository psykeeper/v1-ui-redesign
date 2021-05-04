import styled from "styled-components";
import { Typography, Highlight } from "components/Common/Statistic";

export const ChartBox = styled.div`
  width: 400px;
  max-width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  .center-label-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const StyledValueBox = styled.div`
  padding: 1.5rem;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    width: 100%;
    &:nth-child(2) {
      text-align: right;
    }
    @media (max-width: 500px) {
      font-size: 15px;
    }
  }
  border: 1px solid ${({ theme }) => theme.chartBox.border};
  background: ${({ theme }) => theme.chartBox.background};
`;

export const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
  .left-container {
    width: calc(50% - 200px);
    max-width: 400px;
    display: flex;
    flex-direction: column;
    @media (max-width: 1000px) {
      flex-direction: row;
      width: 100%;
      max-width: 100%;
      margin-bottom: 16px;
    }
    @media (max-width: 400px) {
      flex-direction: column;
    }
    .top-box {
      margin-bottom: 16px;
      margin-right: 16px;
      width: 100%;
      @media (max-width: 1000px) {
        margin: 8px;
      }
    }
    .bottom-box {
      margin-left: 16px;
      width: 100%;
      @media (max-width: 1000px) {
        margin: 8px;
      }
    }
  }
  .right-container {
    width: calc(50% - 200px);
    max-width: 400px;
    display: flex;
    flex-direction: column;
    @media (max-width: 1000px) {
      flex-direction: row;
      width: 100%;
      max-width: 100%;
      margin-top: 16px;
    }
    @media (max-width: 400px) {
      flex-direction: column;
    }
    .top-box {
      margin-bottom: 16px;
      margin-left: 16px;
      width: 100%;
      @media (max-width: 1000px) {
        margin: 8px;
      }
    }
    .bottom-box {
      margin-right: 16px;
      width: 100%;
      @media (max-width: 1000px) {
        margin: 8px;
      }
    }
  }
`;

export const ValueBox = ({ title, value, ...rest }) => {
  return (
    <StyledValueBox {...rest}>
      <Typography size={16} style={{ marginBottom: 10 }}>
        {title}
      </Typography>
      <Typography size={20}>
        <Highlight>{value}</Highlight>
      </Typography>
    </StyledValueBox>
  );
};
