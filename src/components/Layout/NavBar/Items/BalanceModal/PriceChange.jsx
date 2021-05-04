import { ArrowUp, ArrowDown } from "./Arrow";
import { useState } from "react";
import { Space } from "antd";
import styled from "styled-components";
import BigNumber from "bignumber.js";

const PeriodIndicator = styled.span`
  cursor: pointer;
  font-size: 12px;
  color: ${({ theme, active }) => (active ? theme.highlight : theme.typo.secondary)};
`;

const PriceIndicator = styled.span`
  cursor: pointer;
  font-size: 12px;
  color: ${({ theme, state }) => (state === 0 ? theme.typo.primary : state > 0 ? "#00F27D" : "red")};
`;

const PriceChange = ({ marketData }) => {
  const change_24h = marketData.price_change_percentage_24h;
  const change_7d = marketData.price_change_percentage_7d;
  const change_30d = marketData.price_change_percentage_30d;
  const [period, setPeriod] = useState(0);
  const [percent, setPercent] = useState(change_24h);
  const status = new BigNumber(percent).isZero() ? 0 : new BigNumber(percent).gt(0) ? 1 : -1;
  return (
    <Space size={4} align="center">
      {status >= 0 ? <ArrowUp /> : <ArrowDown />}
      <PriceIndicator state={status}>{new BigNumber(percent).toFormat(2)}%</PriceIndicator>
      <Space size={2} align="center">
        <PeriodIndicator
          active={period === 0}
          onClick={() => {
            setPeriod(0);
            setPercent(change_24h);
          }}
        >
          (24H)
        </PeriodIndicator>
        <PeriodIndicator
          active={period === 1}
          onClick={() => {
            setPeriod(1);
            setPercent(change_7d);
          }}
        >
          (7D)
        </PeriodIndicator>
        <PeriodIndicator
          active={period === 2}
          onClick={() => {
            setPeriod(2);
            setPercent(change_30d);
          }}
        >
          (30D)
        </PeriodIndicator>
      </Space>
    </Space>
  );
};

export default PriceChange;
