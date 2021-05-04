import StyledRow from "./StyledRow";
import { Col } from "antd";
import EpochWrapper from "./EpochWrapper";
import PoolInfo from "./PoolInfo";
import { useSaffronContext } from "lib/context";
import BigNumber from "bignumber.js";
import { useResponsiveContext } from "lib/context";
import { useTranslation } from "react-i18next";

export const RedeemOverview = () => {
  const { t } = useTranslation();
  const { saffronTVL, interestEarnedTotal, sfiEarnedTotal } = useSaffronContext();
  const { isMobile } = useResponsiveContext();

  return (
    <StyledRow gutter={[15, 15]} style={{ width: "100%" }}>
      <Col xl={6} md={24} xs={24}>
        <EpochWrapper />
      </Col>
      <Col xl={6} md={8} xs={24} style={{ textAlign: isMobile ? "center" : "left" }}>
        <PoolInfo title={t("dashboard.chart.tvl")} content={`$${new BigNumber(saffronTVL.total ?? 0).toFormat(2)}`} />
      </Col>
      <Col xl={6} md={8} xs={24} style={{ textAlign: isMobile ? "center" : "left" }}>
        <PoolInfo
          title={t("portfolio.chart.interestearned")}
          content={`$${new BigNumber(interestEarnedTotal).toFormat(2)}`}
        />
      </Col>
      <Col xl={6} md={8} xs={24} style={{ textAlign: isMobile ? "center" : "left" }}>
        <PoolInfo title={t("portfolio.chart.sfiearned")} content={`$${new BigNumber(sfiEarnedTotal).toFormat(2)}`} />
      </Col>
    </StyledRow>
  );
};
