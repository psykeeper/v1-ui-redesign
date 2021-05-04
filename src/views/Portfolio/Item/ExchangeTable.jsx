import { useSaffronContext, useGlobalContext } from "lib/context";
import { useWeb3React } from "@web3-react/core";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import { PoolNameBox } from "components/Common/Box";
import { compareBigNum, compare } from "lib/utils";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const ExchangeTable = () => {
  const { pools } = useSaffronContext();
  const { t } = useTranslation();
  const exchangePools = pools.filter((pool) => pool.type === PoolType.UniPool || pool.type === PoolType.SushiPool);

  const { setActivePool } = useGlobalContext();
  const { library } = useWeb3React();
  const history = useHistory();

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
        const pair = exchangePools.find((pool) => pool.name === name).pair;
        return (
          <PoolNameBox>
            <IconOverlapWrapper icons={pair.map((tokens) => tokens.icon)} />
            <span>{name}</span>
          </PoolNameBox>
        );
      },
    },
    {
      title: t("dex"),
      dataIndex: "dex",
      key: "dex",
      align: "center",
      sorter: (a, b) => compare(a.dex, b.dex),
    },
    {
      title: t("apy"),
      dataIndex: "apy",
      key: "apy",
      className: "highlight",
      align: "center",
      width: "20%",
      sorter: (a, b) => compare(a.apy, b.apy),
      render: (apy) => (apy < 0 ? "---" : new BigNumber(apy).toFormat(2) + "%"),
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
  const data = exchangePools.map((pool) => {
    return {
      poolType: pool.name,
      key: pool.name,
      dex: pool.type === PoolType.UniPool ? "Uniswap" : "Sushiswap",
      apy: pool.sfi_apy ?? -1,
      balance: pool.lpBalanceUSD ? new BigNumber(pool.lpBalanceUSD[0]).plus(pool.lpBalanceUSD[1]) : -1,
      pool,
    };
  });

  return <BasicTable columns={columns} dataSource={data} onRowClick={onRowClick} />;
};
