import { useSaffronContext, useGlobalContext } from "lib/context";
import { useWeb3React } from "@web3-react/core";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import { PoolNameBox } from "components/Common/Box";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const StakingTable = () => {
  const { pools } = useSaffronContext();
  const { t } = useTranslation();
  const stakingsPool = pools.filter((pool) => pool.type === PoolType.StakingPool);

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
      render: (name) => {
        const pair = stakingsPool.find((pool) => pool.name === name).pair;
        return (
          <PoolNameBox>
            <IconOverlapWrapper icons={pair.map((tokens) => tokens.icon)} />
            <span>{name}</span>
          </PoolNameBox>
        );
      },
    },
    {
      title: t("sfistaked"),
      dataIndex: "sfiStaked",
      key: "sfiStaked",
      align: "center",
    },
    {
      title: t("apy"),
      dataIndex: "apy",
      key: "apy",
      className: "highlight",
      align: "center",
      width: "20%",
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      key: "balance",
      align: "center",
      width: "20%",
    },
  ];
  const data = stakingsPool.map((pool) => {
    return {
      poolType: pool.name,
      key: pool.name,
      apy: pool.sfi_apy ? new BigNumber(pool.sfi_apy).toFormat(2) + "%" : "---",
      sfiStaked: pool.lpBalance ? new BigNumber(pool.lpBalance).toFormat(2) : "---",
      balance: pool.lpBalanceUSD ? "$" + new BigNumber(pool.lpBalanceUSD).toFormat(2) : "---",
      pool,
    };
  });

  return <BasicTable columns={columns} dataSource={data} onRowClick={onRowClick} />;
};
