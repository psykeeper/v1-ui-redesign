import { useSaffronContext } from "lib/context";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { useState, useEffect, useCallback } from "react";
import { Button } from "components/Common/Button";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import DepositModal from "./Modal";
import { PoolNameBox } from "components/Common/Box";
import _ from "lodash";
import { compare, compareBigNum } from "lib/utils";
import { useGlobalContext } from "lib/context";
import { useWeb3React } from "@web3-react/core";
import { useResponsiveContext } from "lib/context";
import { useTranslation } from "react-i18next";

export const TrancheTable = () => {
  const { t } = useTranslation();
  const { isLightTheme } = useResponsiveContext();
  const { pools, loaded } = useSaffronContext();
  const [isOpened, showModal] = useState(false);
  const [pool, setPool] = useState();
  const { library } = useWeb3React();
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
    if (activePool && activePool.type === PoolType.Tranche) onDepositClick(activePool);
  }, [activePool, onDepositClick]);

  const onRowClick = (row) => {
    if (row.deposit) onDepositClick(row.deposit);
  };

  const tranchePools = pools.filter((pool) => pool.type === PoolType.Tranche);
  const columns = [
    {
      title: t("pooltype"),
      dataIndex: "poolType",
      className: "poolType",
      key: "poolType",
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
      title: t("multiplier"),
      dataIndex: "trancheMultiplier",
      key: "trancheMultiplier",
      align: "center",
      sorter: (a, b) => compare(a.trancheMultiplier, b.trancheMultiplier),
      render: (trancheMultiplier) => (trancheMultiplier < 0 ? "---" : trancheMultiplier + "x"),
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
      align: "center",
      width: "15%",
      sorter: (a, b) => {
        const aSum = Object.values(a.totalApy).reduce((a, b) => a + b, 0);
        const bSum = Object.values(b.totalApy).reduce((a, b) => a + b, 0);
        return compare(aSum, bSum);
      },
      render: (totalApy) =>
        totalApy < 0
          ? "---"
          : Object.values(totalApy)
              .map((apy) => apy + "%")
              .join(", "),
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
          bold
          onClick={() => onDepositClick(pool)}
          {...(isLightTheme ? { primary: true } : { secondary: true })}
        >
          {t("deposit")}
        </Button>
      ),
    },
  ];
  let data = [];
  tranchePools.forEach((pool) => {
    data.push({
      poolType: pool.name,
      key: pool.name,
      deposit: pool,
      trancheMultiplier: pool.trancheAMultiplier ?? -1,
      tvl:
        pool.tvl && !_.isEmpty(pool.tvl.total)
          ? new BigNumber(Object.values(pool.tvl.total).reduce((a, b) => new BigNumber(a).plus(b ?? 0), 0))
          : -1,
      totalApy: pool.total_apy ?? -1,
    });
  });

  return (
    <>
      <BasicTable columns={columns} dataSource={data} onRowClick={onRowClick} />
      {pool && <DepositModal pool={pool} showModal={showModal} visible={isOpened} />}
    </>
  );
};
