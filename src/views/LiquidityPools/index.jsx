import { FlexBox } from "components/Common/Box";
import { BreadCrumb } from "components/Common/Statistic";
import { PoolWrapper } from "components/Common/Wrapper";
import { TrancheTable, ExchangeTable, StakingTable } from "./Item";
import Statistics from "./Item/Statistics";
import { useTranslation } from "react-i18next";

const AddLiquidity = () => {
  const { t } = useTranslation();
  return (
    <FlexBox flexDirection="column" gap={25}>
      <BreadCrumb
        data={[
          { title: t("dashboard"), to: "/dashboard" },
          { title: t("addliquidity"), to: "/addliquidity" },
        ]}
      />
      <Statistics width={1300} />
      <FlexBox
        alignItems="center"
        flexDirection="column"
        gap={25}
        style={{ maxWidth: 1300, width: "100%", margin: "auto" }}
      >
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

export default AddLiquidity;
