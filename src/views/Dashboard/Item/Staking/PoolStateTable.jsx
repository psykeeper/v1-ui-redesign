import { BasicPoolStateTable } from "components/Common/Table";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

const PoolStateTable = ({ pool, row }) => {
  const { t } = useTranslation();
  const { tvl } = pool;
  if (!tvl) return <></>;
  const columns = [
    {
      title: t("epoch"),
      dataIndex: "epoch",
      key: "epoch",
      align: "center",
    },
    {
      title: `SFI ${t("locked")}`,
      dataIndex: "lockedValue",
      key: "lockedValue",
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
        lockedValue: new BigNumber(value.sfi).toFormat(2),
        usdValue: "$" + new BigNumber(value.usd).toFormat(2),
      });
  });
  return <BasicPoolStateTable columns={columns} data={data} />;
};

export default PoolStateTable;
