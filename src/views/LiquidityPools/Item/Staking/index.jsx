import { useSaffronContext } from "lib/context";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { useState, useCallback, useEffect } from "react";
import { Button } from "components/Common/Button";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import DepositModal from "./Modal";
import { PoolNameBox } from "components/Common/Box";
import { useWeb3React } from "@web3-react/core";
import { useGlobalContext } from "lib/context";
import { useResponsiveContext } from "lib/context";
import { useTranslation } from "react-i18next";

export const StakingTable = () => {
  const { isLightTheme } = useResponsiveContext();
  const { t } = useTranslation();
  const { pools, loaded } = useSaffronContext();
  const [isOpened, showModal] = useState(false);
  const { library } = useWeb3React();
  const [pool, setPool] = useState();
  const { activePool } = useGlobalContext();
  const onDepositClick = useCallback(
    (pool) => {
      if (!library || !loaded) return;
      setPool(pool);
      showModal(true);
    },
    [library, loaded]
  );

  useEffect(() => {
    if (activePool && activePool.type === PoolType.StakingPool) onDepositClick(activePool);
  }, [activePool, onDepositClick]);

  const onRowClick = (row) => {
    if (row.deposit) onDepositClick(row.deposit);
  };

  const stakingsPool = pools.filter((pool) => pool.type === PoolType.StakingPool);
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
      title: t("pooltvl"),
      dataIndex: "tvl",
      key: "tvl",
      align: "center",
      width: "15%",
    },
    {
      title: t("totalapy"),
      dataIndex: "totalApy",
      className: "highlight",
      key: "totalApy",
      align: "center",
      width: "15%",
    },
    {
      title: "",
      dataIndex: "deposit",
      key: "deposit",
      align: "left",
      width: 50,
      render: (pool) => (
        <Button
          disabled={!loaded}
          onClick={() => onDepositClick(pool)}
          bold
          {...(isLightTheme ? { primary: true } : { secondary: true })}
        >
          {t("deposit")}
        </Button>
      ),
    },
  ];
  let data = [];
  stakingsPool.forEach((pool) => {
    data.push({
      poolType: pool.name,
      key: pool.name,
      deposit: pool,
      tvl: pool.tvl?.total?.usd ? "$" + new BigNumber(pool.tvl.total.usd).toFormat(2) : "---",
      totalApy: pool.sfi_apy ? new BigNumber(pool.sfi_apy).toFormat(2) + "%" : "---",
    });
  });

  return (
    <>
      <BasicTable columns={columns} dataSource={data} onRowClick={onRowClick} />
      {pool && <DepositModal pool={pool} showModal={showModal} visible={isOpened} />}
    </>
  );
};
