import { Typography, Highlight } from "components/Common/Statistic";
import styled from "styled-components";
import { StatisticBox, FlexBox } from "components/Common/Box";
import { Button } from "components/Common/Button";
import { useSaffronContext } from "lib/context";
import { Row, Col } from "antd";
import { useResponsiveContext } from "lib/context";
import { useHistory } from "react-router-dom";
import { useGlobalContext } from "lib/context";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";
import { printNode } from "lib/utils/helper";

const StyledRow = styled(Row)`
  background: ${({ theme }) => theme.statistic.background};
  color: ${({ theme }) => theme.statistic.text};
  font-size: 16px;
  padding: 0.5rem 1rem;
`;

const Statistics = ({ width }) => {
  const { pools, highApyIndex, saffronTVL, highApy } = useSaffronContext();
  const history = useHistory();
  const { setActivePool } = useGlobalContext();
  const { t } = useTranslation();

  const onDeposit = () => {
    setActivePool(pools[highApyIndex]);
    history.push("/addliquidity");
  };

  const tvl = saffronTVL ? saffronTVL.total.toFormat(2) : 0;
  const { isLaptop, isLightTheme } = useResponsiveContext();

  return (
    <FlexBox alignItems="center" justifyContent="center">
      <StyledRow gutter={[20, 10]} justify="center" align="middle" style={{ maxWidth: width, width: "100%" }}>
        <Col xl={12} md={24} xs={24}>
          <Typography align={isLaptop ? "center" : "left"}>
            {printNode(t("dashboard.statistic"), <Highlight>${tvl}</Highlight>)}
          </Typography>
        </Col>
        <Col xl={4} md={8} xs={12}>
          <StatisticBox highlight title={t("highapy")}>
            {new BigNumber(highApy).toFormat(2) ?? 0}%
          </StatisticBox>
        </Col>
        <Col xl={4} md={8} xs={12}>
          <StatisticBox title={t("dashboard.statistic.inpool")}>
            <b>{pools[highApyIndex].name ?? "---"}</b>
          </StatisticBox>
        </Col>
        <Col xl={4} md={8} xs={12}>
          <FlexBox justifyContent="center" alignItems="center">
            <Button
              onClick={() => onDeposit()}
              long={true}
              {...(isLightTheme ? { primary: true } : { secondary: true })}
              bold
            >
              {t("deposit")}
            </Button>
          </FlexBox>
        </Col>
      </StyledRow>
    </FlexBox>
  );
};
export default Statistics;
