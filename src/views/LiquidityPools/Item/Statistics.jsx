import { Typography, Highlight } from "components/Common/Statistic";
import styled from "styled-components";
import { StatisticBox, FlexBox } from "components/Common/Box";
import { useSaffronContext } from "lib/context";
import BigNumber from "bignumber.js";
import { Row, Col } from "antd";
import { useResponsiveContext } from "lib/context";
import { useTranslation } from "react-i18next";
import { printNode } from "lib/utils/helper";

const StyledRow = styled(Row)`
  background: ${({ theme }) => theme.statistic.background};
  color: ${({ theme }) => theme.statistic.text};
  font-size: 16px;
  padding: 0.5rem 1rem;
`;

const Statistics = ({ width }) => {
  const { t } = useTranslation();
  const { pools, saffronTVL, highApyIndex, highApy, currentEpoch } = useSaffronContext();
  const { isDesktop } = useResponsiveContext();
  const tvl = saffronTVL && saffronTVL[currentEpoch] ? saffronTVL[currentEpoch].toFormat(2) : 0;

  return (
    <FlexBox alignItems="center" justifyContent="center">
      <StyledRow gutter={[20, 10]} justify="center" align="middle" style={{ maxWidth: width, width: "100%" }}>
        <Col xl={16} md={24} xs={24} style={{ textAlign: !isDesktop ? "center" : "left" }}>
          <Typography>{printNode(t("addliquidity.statistic"), <Highlight>${tvl}</Highlight>, currentEpoch)}</Typography>
        </Col>
        <Col xl={4} md={12} xs={12}>
          <StatisticBox highlight title={t("highapy")}>
            {new BigNumber(highApy).toFormat(2) ?? 0}%
          </StatisticBox>
        </Col>
        <Col xl={4} md={12} xs={12}>
          <StatisticBox title={t("dashboard.statistic.inpool")}>
            <b>{pools[highApyIndex].name ?? "---"}</b>
          </StatisticBox>
        </Col>
      </StyledRow>
    </FlexBox>
  );
};
export default Statistics;
