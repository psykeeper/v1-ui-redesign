import { useSaffronContext, useGlobalContext } from "lib/context";
import { useWeb3React } from "@web3-react/core";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { RiskProfile } from "components/Common/Statistic";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import { PoolNameBox } from "components/Common/Box";
import { Tranche } from "lib/config/constant";
import toast from "react-hot-toast";
import { compareBigNum, compare } from "lib/utils";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const TrancheTable = () => {
  const { pools } = useSaffronContext();
  const { setActivePool } = useGlobalContext();
  const { library } = useWeb3React();
  const history = useHistory();
  const { t } = useTranslation();
  const tranchePools = pools.filter((pool) => pool.type === PoolType.Tranche);

  const onRowClick = (row) => {
    if (!library) {
      toast.error(t("notify.connectwallet"));
      return;
    }
    setActivePool(row.pool);
    history.push("/addliquidity");
  };

  const columns = [
    {
      title: t("pooltype"),
      dataIndex: "poolType",
      className: "poolType",
      key: "poolType",
      width: "20%",
      sorter: (a, b) => compare(a.poolType, b.poolType),
      render: (name) => {
        const pair = tranchePools.find((pool) => pool.name === name).pair;
        return (
          <PoolNameBox>
            <IconOverlapWrapper icons={pair.map((tokens) => tokens.icon)} />
            <span>{name}</span>
          </PoolNameBox>
        );
      },
    },
    {
      title: t("riskprofile"),
      dataIndex: "riskProfile",
      key: "riskProfile",
      align: "center",
      sorter: (a, b) => compare(a.riskProfile, b.riskProfile),
      render: (profile) => <RiskProfile highlight={profile === "A"}>{profile}</RiskProfile>,
    },
    {
      title: t("sfistaked"),
      dataIndex: "sfiStaked",
      key: "sfiStaked",
      align: "center",
      render: (sfiStaked) => (sfiStaked < 0 || !sfiStaked ? "---" : new BigNumber(sfiStaked).toFormat(2)),
      sorter: (a, b) => compare(a.sfiStaked, b.sfiStaked),
    },
    {
      title: t("apy"),
      dataIndex: "apy",
      key: "apy",
      className: "highlight",
      align: "center",
      width: "20%",
      render: (apy, row) =>
        apy > 0
          ? row.riskProfile === "A"
            ? `${new BigNumber(apy).toFormat(2)}%`
            : row.riskProfile === "S"
            ? `${new BigNumber(apy).dividedBy(10).toFormat(2)}% - ${new BigNumber(apy).toFormat(2)}%`
            : "---"
          : "---",
      sorter: (a, b) => compareBigNum(a.apy, b.apy),
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      key: "balance",
      align: "center",
      width: "20%",
      render: (balance) => (balance < 0 ? "---" : "$" + new BigNumber(balance).toFormat(2)),
      sorter: (a, b) => compareBigNum(a.balance, b.balance),
    },
  ];
  let data = [];
  tranchePools.forEach((pool) => {
    const trancheSymbol = ["S", "AA", "A"];
    pool.detail.forEach((tranche) => {
      data.push({
        poolType: pool.name,
        key: pool.name + tranche,
        riskProfile: trancheSymbol[tranche],
        sfiStaked: pool.sfi_staked && tranche === Tranche.A ? pool.sfi_staked : -1,
        apy: pool.apy ? pool.apy[tranche] : -1,
        balance: pool.lpBalanceUSD && pool.lpBalanceUSD[tranche] ? pool.lpBalanceUSD[tranche] : -1,
        pool,
      });
    });
  });

  return <BasicTable columns={columns} dataSource={data} onRowClick={onRowClick} />;
};
