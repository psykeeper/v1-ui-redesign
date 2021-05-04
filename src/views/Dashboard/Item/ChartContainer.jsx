import { ChartWrapper, ValueBox, ChartBox } from "components/Common/Chart";
import { Doughnut } from "@reactchartjs/react-chart.js";
import { useSaffronContext, useResponsiveContext } from "lib/context";
import BigNumber from "bignumber.js";
import { Typography, Highlight } from "components/Common/Statistic";
import { FlexBox } from "components/Common/Box";
import { useTranslation } from "react-i18next";

export const ChartContainer = () => {
  const { interestEstimatedTotal, sfiEstimatedTotal, saffronTVL, currentEpoch, highApy } = useSaffronContext();
  const tvl = saffronTVL?.total;
  const currentTVL = saffronTVL && saffronTVL[currentEpoch] ? saffronTVL[currentEpoch] : 0;
  const { isLightTheme } = useResponsiveContext();
  const { t } = useTranslation();
  let data;
  if (new BigNumber(tvl).isZero() && new BigNumber(currentTVL).isZero()) {
    data = {
      labels: ["TVL"],
      datasets: [
        {
          data: [100],
          backgroundColor: [isLightTheme ? "#e7eaed" : "#191530"],
          borderWidth: 0,
          weight: 200,
        },
      ],
    };
  } else {
    const currentTVLRate = new BigNumber(currentTVL).dividedBy(tvl).multipliedBy(100).toFixed(0);
    const restRate = new BigNumber(tvl).minus(currentTVL).dividedBy(tvl).multipliedBy(100).toFixed(0);
    data = {
      datasets: [
        {
          data: [restRate, currentTVLRate],
          backgroundColor: [isLightTheme ? "#f0f4f8" : "#191530", "#C44536"],
          borderWidth: 0,
          weight: 200,
        },
      ],
    };
  }

  return (
    <ChartWrapper>
      <div className="left-container">
        <ValueBox
          title={t("dashboard.chart.tvlinepoch")}
          value={`$${new BigNumber(currentTVL).toFormat(0)}`}
          color={isLightTheme ? "#e03827" : "#FFEC75"}
          className="top-box"
        />
        <ValueBox
          title={t("highapy")}
          value={`${new BigNumber(highApy).toFormat(2) ?? 0}%`}
          color={isLightTheme ? "#e03827" : "#FFEC75"}
          className="bottom-box"
        />
      </div>
      <ChartBox>
        <Doughnut data={data} options={{ tooltips: { enabled: false }, legend: false, cutoutPercentage: 92 }} />
        <FlexBox className="center-label-box" flexDirection="column" alignItems="center" justifyContent="center">
          <Typography size={14} primary>
            {t("dashboard.chart.tvl")}
          </Typography>
          <Typography size={24}>
            <Highlight>${new BigNumber(tvl).toFormat(0)}</Highlight>
          </Typography>
        </FlexBox>
      </ChartBox>
      <div className="right-container">
        <ValueBox
          title={t("dashboard.chart.interestestimate")}
          value={`$${new BigNumber(interestEstimatedTotal).toFormat(2)}`}
          color={isLightTheme ? "#11b367" : "#01E077"}
          className="top-box"
        />
        <ValueBox
          title={t("dashboard.chart.sfiestimate")}
          value={`$${new BigNumber(sfiEstimatedTotal).toFormat(2)}`}
          color="#795CF1"
          className="bottom-box"
        />
      </div>
    </ChartWrapper>
  );
};
