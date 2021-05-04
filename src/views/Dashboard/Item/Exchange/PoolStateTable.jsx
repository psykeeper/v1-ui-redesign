import { BasicPoolStateTable } from "components/Common/Table";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

const PoolStateTable = ({ pool }) => {
  const { tvl } = pool;
  const { t } = useTranslation();
  if (!tvl) return <></>;
  const columns = [
    {
      title: t("epoch"),
      dataIndex: "epoch",
      key: "epoch",
      align: "center",
    },
    {
      title: `${pool.tvl.total.token0.name} ${t("locked")}`,
      dataIndex: "token0Locked",
      key: "token0Locked",
      align: "right",
    },
    {
      title: `${pool.tvl.total.token1.name} ${t("locked")}`,
      dataIndex: "token1Locked",
      key: "token1Locked",
      align: "right",
    },
    {
      title: t("totalusd"),
      dataIndex: "usdValue",
      key: "usdValue",
      align: "right",
    },
  ];

  let data = [];
  Object.entries(tvl).forEach(([key, value]) => {
    if (key !== "total")
      data.push({
        epoch: key,
        key: key,
        token0Locked: new BigNumber(value.token0.reserve).toFormat(2),
        token1Locked: new BigNumber(value.token1.reserve).toFormat(2),
        usdValue: "$" + new BigNumber(value.usd).toFormat(2),
      });
  });
  return <BasicPoolStateTable columns={columns} data={data} />;
};

export default PoolStateTable;
