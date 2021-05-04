import { useSaffronContext } from "lib/context";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { useState, useCallback, useEffect } from "react";
import { Button } from "components/Common/Button";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import DepositModal from "./Modal";
import { PoolNameBox } from "components/Common/Box";
import { compareBigNum, compare } from "lib/utils";
import { useWeb3React } from "@web3-react/core";
import { useGlobalContext } from "lib/context";
import { useResponsiveContext } from "lib/context";
import { useTranslation } from "react-i18next";

export const ExchangeTable = () => {
  const { t } = useTranslation();
  const { isLightTheme } = useResponsiveContext();
  const { pools, loaded } = useSaffronContext();
  const { library } = useWeb3React();
  const [isOpened, showModal] = useState(false);
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
    if (activePool && (activePool.type === PoolType.SushiPool || activePool.type === PoolType.UniPool))
      onDepositClick(activePool);
  }, [activePool, onDepositClick]);

  const onRowClick = (row) => {
    if (row.deposit) onDepositClick(row.deposit);
  };

  const exchangePools = pools.filter((pool) => pool.type === PoolType.UniPool || pool.type === PoolType.SushiPool);
  const columns = [
    {
      title: t("pooltype"),
      dataIndex: "poolType",
      className: "poolType",
      sorter: (a, b) => compare(a.poolType, b.poolType),
      key: "poolType",
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
      title: t("pooltvl"),
      dataIndex: "tvl",
      key: "tvl",
      align: "center",
      width: "15%",
      render: (tvl) => (tvl < 0 ? "---" : "$" + new BigNumber(tvl).toFormat(2)),
      sorter: (a, b) => compareBigNum(a.tvl, b.tvl),
    },
    {
      title: t("totalapy"),
      dataIndex: "totalApy",
      className: "highlight",
      key: "totalApy",
      width: "15%",
      align: "center",
      sorter: (a, b) => compare(a.totalApy, b.totalApy),
      render: (totalApy) => (totalApy < 0 ? "---" : new BigNumber(totalApy).toFormat(2) + "%"),
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
  exchangePools.forEach((pool) => {
    data.push({
      poolType: pool.name,
      key: pool.name,
      deposit: pool,
      tvl: pool.tvl?.total?.usd ? new BigNumber(pool.tvl.total.usd) : -1,
      totalApy: pool.sfi_apy ? pool.sfi_apy : -1,
    });
  });

  return (
    <>
      <BasicTable columns={columns} dataSource={data} onRowClick={onRowClick} />
      {pool && <DepositModal pool={pool} showModal={showModal} visible={isOpened} />}
    </>
  );
};
