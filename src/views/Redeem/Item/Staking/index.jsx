import { useSaffronContext } from "lib/context";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { useState, useCallback } from "react";
import { Button } from "components/Common/Button";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import RedeemModal from "../Modal/RedeemModal";
import { PoolNameBox } from "components/Common/Box";
import { useResponsiveContext } from "lib/context";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import { compareBigNum } from "lib/utils";
import _ from "lodash";

export const StakingTable = () => {
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
      title: t("lptoken"),
      dataIndex: "lpToken",
      key: "lpToken",
      align: "center",
      width: "20%",
      render: (lpToken) => (lpToken < 0 ? "---" : new BigNumber(lpToken).toFormat(2)),
      sorter: (a, b) => compareBigNum(a.lpToken, b.lpToken),
    },
    {
      title: t("portfolio.chart.sfiearned"),
      dataIndex: "sfiEarned",
      className: "highlight",
      key: "sfiEarned",
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
          bold
          onClick={() => onRedeemClick(pool)}
          {...(isLightTheme ? { primary: true } : { secondary: true })}
        >
          {t("redeem")}
        </Button>
      ),
    },
  ];
  let data = [];
  stakingsPool.forEach((pool) => {
    data.push({
      poolType: pool.name,
      key: pool.name,
      redeem: pool,
      sfiEarned:
        pool.sfi_redeemable && !_.isEmpty(pool.sfi_redeemable.total)
          ? new BigNumber(pool.sfi_redeemable.total.usd)
          : -1,
      lpToken: pool.principal ? new BigNumber(pool.principal.total) : -1,
    });
  });

  return (
    <>
      <BasicTable columns={columns} dataSource={data} onRowClick={onRowClick} />
      {pool && <RedeemModal pool={pool} isOpened={isOpened} showModal={showModal} />}
    </>
  );
};
