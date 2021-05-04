import { FlexBox, StatisticBox } from "components/Common/Box";
import { useSaffronContext } from "lib/context";
import BigNumber from "bignumber.js";
import { PoolType } from "lib/config/constant";
import { Typography, BreadCrumb } from "components/Common/Statistic";
import { PoolWrapper } from "components/Common/Wrapper";
import { TrancheTable, ExchangeTable, StakingTable, ChartContainer } from "./Item";
import { useTranslation } from "react-i18next";

const EstimatedBox = ({ children }) => {
  const { t } = useTranslation();
  return (
    <FlexBox
      gap={20}
      justifyContent="flex-end"
      alignItems="center"
      style={{ width: "100%", marginBottom: 16, marginTop: 16 }}
    >
      <Typography>{t("portfolio.estimatedearnings")}</Typography>
      {children}
    </FlexBox>
  );
};

const Portfolio = () => {
  const { pools, loaded } = useSaffronContext();
  const { t } = useTranslation();
  const exchangePools = pools.filter((pool) => pool.type === PoolType.UniPool || pool.type === PoolType.SushiPool);
  const stakingsPool = pools.filter((pool) => pool.type === PoolType.StakingPool);
  const tranchePools = pools.filter((pool) => pool.type === PoolType.Tranche);
  let trancheSFIEstimated = 0,
    trancheInterestEstimated = 0,
    stakingSFIEstimated = 0,
    exchangeSFIEstimated = 0;
  if (loaded) {
    stakingSFIEstimated = stakingsPool.reduce(
      (prev, current) => new BigNumber(prev).plus(current.sfi_estimated ?? 0).toFixed(),
      0
    );
    trancheSFIEstimated = tranchePools.reduce(
      (prev, current) => new BigNumber(prev).plus(current.sfi_estimated ?? 0).toFixed(),
      0
    );
    exchangeSFIEstimated = exchangePools.reduce(
      (prev, current) => new BigNumber(prev).plus(current.sfi_estimated ?? 0).toFixed(),
      0
    );
    trancheInterestEstimated = tranchePools.reduce(
      (prev, current) => new BigNumber(prev).plus(current.interest_estimated ?? 0).toFixed(),
      0
    );
  }

  return (
    <FlexBox flexDirection="column" gap={25}>
      <BreadCrumb
        data={[
          { title: t("dashboard"), to: "/dashboard" },
          { title: t("portfolio.breadcrumb"), to: "/portfolio" },
        ]}
      />
      <ChartContainer />
      <FlexBox
        alignItems="center"
        flexDirection="column"
        gap={25}
        style={{ maxWidth: 1300, width: "100%", margin: "auto" }}
      >
        <PoolWrapper title={t("portfolio.pool.sfi")}>
          <StakingTable />
        </PoolWrapper>

        <EstimatedBox>
          <StatisticBox highlight title="SFI">
            {new BigNumber(stakingSFIEstimated).toFormat(4)}
          </StatisticBox>
        </EstimatedBox>

        <PoolWrapper title={t("portfolio.pool.tranche")}>
          <TrancheTable />
        </PoolWrapper>

        <EstimatedBox>
          <StatisticBox highlight title="SFI">
            {new BigNumber(trancheSFIEstimated).toFormat(4)}
          </StatisticBox>
          <StatisticBox highlight title={t("interest")}>
            ${new BigNumber(trancheInterestEstimated).toFormat(4)}
          </StatisticBox>
        </EstimatedBox>

        <PoolWrapper title={t("portfolio.pool.decentralized")}>
          <ExchangeTable />
        </PoolWrapper>

        <EstimatedBox>
          <StatisticBox highlight title="SFI">
            {new BigNumber(exchangeSFIEstimated).toFormat(4)}
          </StatisticBox>
        </EstimatedBox>
      </FlexBox>
    </FlexBox>
  );
};

export default Portfolio;
