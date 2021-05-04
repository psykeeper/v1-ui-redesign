import { ChartWrapper, ValueBox, ChartBox } from "components/Common/Chart";
import { Doughnut } from "@reactchartjs/react-chart.js";
import { useSaffronContext, useResponsiveContext } from "lib/context";
import BigNumber from "bignumber.js";
import { Typography, Highlight } from "components/Common/Statistic";
import { FlexBox } from "components/Common/Box";
import { useTranslation } from "react-i18next";

export const ChartContainer = () => {
  const { t } = useTranslation();
  const { sfiEarnedTotal, interestEarnedTotal, portfolio, highApy } = useSaffronContext();
  const { isLightTheme } = useResponsiveContext();
  let data;
  if (
    new BigNumber(portfolio).isZero() &&
    new BigNumber(interestEarnedTotal).isZero() &&
    new BigNumber(sfiEarnedTotal).isZero()
  ) {
    data = {
      labels: ["Portfolio"],
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
    const portfolioRate = new BigNumber(portfolio)
      .dividedBy(new BigNumber(portfolio).plus(interestEarnedTotal).plus(sfiEarnedTotal))
      .multipliedBy(100)
      .toFixed(0);
    const interestRate = new BigNumber(interestEarnedTotal)
      .dividedBy(new BigNumber(portfolio).plus(interestEarnedTotal).plus(sfiEarnedTotal))
      .multipliedBy(100)
      .toFixed(0);
    const sfiRate = new BigNumber(sfiEarnedTotal)
      .dividedBy(new BigNumber(portfolio).plus(interestEarnedTotal).plus(sfiEarnedTotal))
      .multipliedBy(100)
      .toFixed(0);
    data = {
      labels: ["Portfolio", "Interest Earned", "SFI Earned"],
      datasets: [
        {
          data: [portfolioRate, interestRate, sfiRate],
          backgroundColor: ["#01E077", isLightTheme ? "#f0f4f8" : "#191530", "#C44536"],
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
          title={t("portfolio.chart.value")}
          value={`$${new BigNumber(portfolio).toFormat(2)}`}
          className="top-box"
        />
        <ValueBox
          title={t("portfolio.chart.highestyield")}
          value={`${new BigNumber(highApy).toFormat(2) ?? 0}%`}
          className="bottom-box"
        />
      </div>
      <ChartBox>
        <Doughnut data={data} options={{ tooltips: { enabled: false }, legend: false, cutoutPercentage: 92 }} />
        <FlexBox className="center-label-box" flexDirection="column" alignItems="center" justifyContent="center">
          <Typography size={14} primary>
            {t("portfolio.chart.portfoliovalue")}
          </Typography>
          <Typography size={24}>
            <Highlight>${new BigNumber(portfolio).toFormat(0)}</Highlight>
          </Typography>
        </FlexBox>
      </ChartBox>
      <div className="right-container">
        <ValueBox
          title={t("portfolio.chart.interestearned")}
          value={`$${new BigNumber(interestEarnedTotal).toFormat(2)}`}
          className="top-box"
        />
        <ValueBox
          title={t("portfolio.chart.sfiearned")}
          value={`$${new BigNumber(sfiEarnedTotal).toFormat(2)}`}
          className="bottom-box"
        />
      </div>
    </ChartWrapper>
  );
};
