import { FlexBox } from "components/Common/Box";
import { BreadCrumb } from "components/Common/Statistic";
import { PoolWrapper } from "components/Common/Wrapper";
import { TrancheTable, ExchangeTable, StakingTable, RedeemOverview } from "./Item";
import { useTranslation } from "react-i18next";

const Redeem = () => {
  const { t } = useTranslation();
  return (
    <FlexBox flexDirection="column" gap={30}>
      <BreadCrumb
        data={[
          { title: t("dashboard"), to: "/dashboard" },
          { title: t("redeem"), to: "/redeem" },
        ]}
      />
      <FlexBox
        alignItems="center"
        flexDirection="column"
        gap={25}
        style={{ maxWidth: 1300, width: "100%", margin: "auto" }}
      >
        <RedeemOverview />
        <PoolWrapper title={t("portfolio.pool.sfi")}>
          <StakingTable />
        </PoolWrapper>
        <PoolWrapper title={t("portfolio.pool.tranche")}>
          <TrancheTable />
        </PoolWrapper>
        <PoolWrapper title={t("portfolio.pool.decentralized")}>
          <ExchangeTable />
        </PoolWrapper>
      </FlexBox>
    </FlexBox>
  );
};

export default Redeem;
