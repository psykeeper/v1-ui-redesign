import { FlexBox } from "components/Common/Box";
import { PoolWrapper } from "components/Common/Wrapper";
import { TrancheTable, ExchangeTable, StakingTable, ChartContainer } from "./Item";
import Statistics from "./Item/Statistics";
import { BreadCrumb } from "components/Common/Statistic";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <FlexBox flexDirection="column" gap={25}>
      <BreadCrumb
        data={[
          { title: t("dashboard"), to: "/dashboard" },
          { title: t("dashboard.breadcrumb"), to: "/dashboard" },
        ]}
      />
      <ChartContainer />
      <Statistics width={1300} />
      <FlexBox
        alignItems="center"
        flexDirection="column"
        gap={25}
        style={{ maxWidth: 1300, width: "100%", margin: "auto" }}
      >
        <PoolWrapper title={t("dashboard.pool.sfi")}>
          <StakingTable />
        </PoolWrapper>
        <PoolWrapper title={t("dashboard.pool.tranche")}>
          <TrancheTable />
        </PoolWrapper>
        <PoolWrapper title={t("dashboard.pool.decentralized")}>
          <ExchangeTable />
        </PoolWrapper>
      </FlexBox>
    </FlexBox>
  );
};

export default Dashboard;
