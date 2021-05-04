import { useSaffronContext } from "lib/context";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { useState, useCallback } from "react";
import { Button } from "components/Common/Button";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import { PoolNameBox } from "components/Common/Box";
import TrancheModal from "../Modal/TrancheModal";
import _ from "lodash";
import { useResponsiveContext } from "lib/context";
import { compareBigNum, compare } from "lib/utils";
import { useTranslation } from "react-i18next";

import { useWeb3React } from "@web3-react/core";

export const TrancheTable = () => {
  const { isLightTheme } = useResponsiveContext();
  const { pools, loaded } = useSaffronContext();
  const [isOpened, showModal] = useState(false);
  const [pool, setPool] = useState();
  const { library } = useWeb3React();
  const { t } = useTranslation();

  const onRedeemClick = useCallback(
    (pool) => {
      if (!library || !loaded) return;
      setPool(pool);
      showModal(true);
    },
    [library, loaded]
  );

  const onRowClick = (row) => {
    if (row.redeem) onRedeemClick(row.redeem);
  };

  const tranchePools = pools.filter((pool) => pool.type === PoolType.Tranche);
  const columns = [
    {
      title: t("pooltype"),
      dataIndex: "poolType",
      className: "poolType",
      sorter: (a, b) => compare(a.poolType, b.poolType),
      key: "poolType",
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
      title: t("lptoken"),
      dataIndex: "lpToken",
      key: "lpToken",
      align: "center",
      width: "20%",
      render: (lpToken) => (lpToken < 0 ? "---" : new BigNumber(lpToken).toFormat(2)),
      sorter: (a, b) => compareBigNum(a.lpToken, b.lpToken),
    },
    {
      title: t("portfolio.chart.interestearned"),
      dataIndex: "interestEarned",
      key: "interestEarned",
      className: "highlight",
      align: "center",
      width: "20%",
      render: (interestEarned) => (interestEarned < 0 ? "---" : "$" + new BigNumber(interestEarned).toFormat(2)),
      sorter: (a, b) => compareBigNum(a.interestEarned, b.interestEarned),
    },
    {
      title: t("portfolio.chart.sfiearned"),
      dataIndex: "sfiEarned",
      key: "sfiEarned",
      className: "highlight",
      align: "center",
      width: "20%",
      render: (sfiEarned) => (sfiEarned < 0 ? "---" : "$" + new BigNumber(sfiEarned).toFormat(2)),
      sorter: (a, b) => compareBigNum(a.sfiEarned, b.sfiEarned),
    },
    {
      title: "",
      dataIndex: "redeem",
      key: "redeem",
      align: "left",
      width: 50,
      render: (pool) => (
        <Button
          disabled={!loaded}
          onClick={() => onRedeemClick(pool)}
          bold
          {...(isLightTheme ? { primary: true } : { secondary: true })}
        >
          {t("redeem")}
        </Button>
      ),
    },
  ];
  let data = [];
  tranchePools.forEach((pool) => {
    data.push({
      poolType: pool.name,
      key: pool.name,
      redeem: pool,
      lpToken:
        pool.principal && !_.isEmpty(pool.principal.total)
          ? new BigNumber(Object.values(pool.principal.total).reduce((a, b) => new BigNumber(a).plus(b ?? 0), 0))
          : -1,
      interestEarned:
        pool.interest_redeemable && !_.isEmpty(pool.interest_redeemable.total)
          ? new BigNumber(pool.interest_redeemable.total.usd)
          : -1,
      sfiEarned:
        pool.sfi_redeemable && !_.isEmpty(pool.sfi_redeemable.total)
          ? new BigNumber(pool.sfi_redeemable.total.usd)
          : -1,
    });
  });

  return (
    <>
      <BasicTable columns={columns} dataSource={data} onRowClick={onRowClick} />
      {pool && <TrancheModal pool={pool} showModal={showModal} isOpened={isOpened} />}
    </>
  );
};
