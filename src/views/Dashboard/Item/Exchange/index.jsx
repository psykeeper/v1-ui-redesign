import { useSaffronContext, useGlobalContext } from "lib/context";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import { PopInfo } from "components/Common";
import { PoolNameBox } from "components/Common/Box";
import PoolStateTable from "./PoolStateTable";
import { compareBigNum, compare } from "lib/utils";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { useWeb3React } from "@web3-react/core";
import { InfoIcon } from "components/Common/Icon";
import Indicator from "../Indicator";
import { useState } from "react";
import { Tooltip } from "antd";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { printNode } from "lib/utils/helper";

export const ExchangeTable = () => {
  const { pools, loaded } = useSaffronContext();
  const exchangePools = pools.filter((pool) => pool.type === PoolType.UniPool || pool.type === PoolType.SushiPool);
  const { library } = useWeb3React();
  const { setActivePool } = useGlobalContext();
  const history = useHistory();
  const [hoveredRow, setHoveredRow] = useState();
  const { t } = useTranslation();

  const onRowClick = (row) => {
    if (!library) {
      toast.error(t("notify.connectwallet"));
      return;
    }
    setActivePool(row.info);
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
      width: "15%",
      align: "center",
      sorter: (a, b) => compare(a.apy, b.apy),
      render: (apy) => (apy < 0 ? "---" : new BigNumber(apy).toFormat(2) + "%"),
    },
    {
      title: t("tvl"),
      dataIndex: "tvl",
      key: "tvl",
      width: "15%",
      align: "center",
      render: (tvl) => (tvl < 0 ? "---" : "$" + new BigNumber(tvl).toFormat(2)),
      sorter: (a, b) => compareBigNum(a.tvl, b.tvl),
    },
    {
      title: (
        <Tooltip placement="left" title={<center>{t("table.info.hover")}</center>}>
          <span>
            <InfoIcon />
          </span>
        </Tooltip>
      ),
      dataIndex: "info",
      key: "info",
      width: 50,
      align: "center",
      render: (pool, row) => {
        return (
          loaded && (
            <PopInfo
              placement="left"
              trigger="hover"
              title={<center>{printNode(t("modal.statistics"), pool.name)}</center>}
              content={<PoolStateTable pool={pool} />}
            >
              <Indicator fillBackground={_.isEqual(row, hoveredRow)} />
            </PopInfo>
          )
        );
      },
    },
  ];
  const data = exchangePools.map((pool) => {
    return {
      poolType: pool.name,
      key: pool.name,
      info: pool,
      dex: pool.type === PoolType.UniPool ? "Uniswap" : "Sushiswap",
      apy: pool.sfi_apy ? pool.sfi_apy : -1,
      tvl: pool.tvl?.total?.usd ? pool.tvl.total.usd : -1,
    };
  });

  return (
    <BasicTable
      columns={columns}
      dataSource={data}
      onRowClick={onRowClick}
      onMouseEnter={(row) => setHoveredRow(row)}
      onMouseLeave={() => setHoveredRow(null)}
    />
  );
};
