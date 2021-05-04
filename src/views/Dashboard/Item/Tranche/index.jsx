import { useSaffronContext } from "lib/context";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { IconOverlapWrapper } from "components/Common/Wrapper";
import { BasicTable } from "components/Common/Table";
import { PopInfo } from "components/Common";
import { RiskProfile } from "components/Common/Statistic";
import PoolStateTable from "./PoolStateTable";
import { PoolNameBox } from "components/Common/Box";
import { Tranche } from "lib/config/constant";
import { compareBigNum, compare } from "lib/utils";
import toast from "react-hot-toast";
import { useWeb3React } from "@web3-react/core";
import { useGlobalContext } from "lib/context";
import { useHistory } from "react-router-dom";
import { InfoIcon } from "components/Common/Icon";
import Indicator from "../Indicator";
import { useState } from "react";
import { Tooltip } from "antd";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { printNode } from "lib/utils/helper";

export const TrancheTable = () => {
  const { pools, loaded } = useSaffronContext();
  const { library } = useWeb3React();
  const { setActivePool } = useGlobalContext();
  const [hoveredRow, setHoveredRow] = useState();
  const tranchePools = pools.filter((pool) => pool.type === PoolType.Tranche);
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
      width: "20%",
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
      render: (sfiStaked) => (sfiStaked < 0 ? "---" : new BigNumber(sfiStaked).toFormat(2)),
      sorter: (a, b) => compareBigNum(a.sfiStaked, b.sfiStaked),
    },
    {
      title: t("apy"),
      dataIndex: "apy",
      key: "apy",
      className: "highlight",
      align: "center",
      width: "15%",
      render: (apy, row) => {
        return apy > 0
          ? row.riskProfile === "A"
            ? `${new BigNumber(apy).toFormat(2)}%`
            : row.riskProfile === "S"
            ? `${new BigNumber(apy).dividedBy(10).toFormat(2)}% - ${new BigNumber(apy).toFormat(2)}%`
            : "---"
          : "---";
      },
      sorter: (a, b) => compareBigNum(a.apy, b.apy),
    },
    {
      title: t("tvl"),
      dataIndex: "tvl",
      key: "tvl",
      align: "center",
      width: "15%",
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
      align: "center",
      width: 50,
      render: (pool, row) => {
        return (
          loaded && (
            <PopInfo
              placement="left"
              trigger="hover"
              title={<center>{printNode(t("modal.statistics.tranche"), pool.name, row.riskProfile)}</center>}
              content={<PoolStateTable pool={pool} row={row} />}
            >
              <Indicator fillBackground={_.isEqual(row, hoveredRow)} />
            </PopInfo>
          )
        );
      },
    },
  ];
  let data = [];

  tranchePools.forEach((pool) => {
    const trancheSymbol = ["S", "AA", "A"];
    let sfiStaked = new BigNumber(0);
    if (pool.tvl)
      Object.entries(pool.tvl).forEach(([key, value]) => {
        pool.detail.forEach((tranche) => {
          if (key !== "total" && value[tranche])
            if (tranche === Tranche.A) sfiStaked = new BigNumber(sfiStaked).plus(value[tranche].sfi);
        });
      });
    pool.detail.forEach((tranche) => {
      data.push({
        poolType: pool.name,
        key: pool.name + tranche,
        info: pool,
        riskProfile: trancheSymbol[tranche],
        sfiStaked: sfiStaked && tranche === Tranche.A ? sfiStaked : -1,
        apy: pool.apy && pool.apy[tranche] ? pool.apy[tranche] : -1,
        tvl: pool.tvl?.total[tranche] ? pool.tvl["total"][tranche] : -1,
      });
    });
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
