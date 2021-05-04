import { useSaffronContext } from "lib/context";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import { PopInfo } from "components/Common";
import PoolStateTable from "./PoolStateTable";
import { PoolNameBox } from "components/Common/Box";
import { useGlobalContext } from "lib/context";
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

export const StakingTable = () => {
  const { pools, loaded } = useSaffronContext();
  const [hoveredRow, setHoveredRow] = useState();
  const stakingsPool = pools.filter((pool) => pool.type === PoolType.StakingPool);

  const { library } = useWeb3React();
  const { setActivePool } = useGlobalContext();
  const history = useHistory();
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
      title: t("apy"),
      dataIndex: "apy",
      key: "apy",
      className: "highlight",
      align: "center",
      width: "15%",
    },
    {
      title: t("tvl"),
      dataIndex: "tvl",
      key: "tvl",
      align: "center",
      width: "15%",
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
      align: "center",
      width: 50,
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
  const data = stakingsPool.map((pool) => {
    return {
      poolType: pool.name,
      key: pool.name,
      info: pool,
      apy: pool.sfi_apy ? new BigNumber(pool.sfi_apy).toFormat(2) + "%" : "---",
      tvl: pool.tvl?.total?.usd ? "$" + new BigNumber(pool.tvl.total.usd).toFormat(2) : "---",
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
