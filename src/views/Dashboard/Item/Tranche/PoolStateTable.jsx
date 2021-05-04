import { BasicPoolStateTable } from "components/Common/Table";
import { Tranche } from "lib/config/constant";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

const PoolStateTable = ({ pool, row }) => {
  const { t } = useTranslation();
  const { tvl } = pool;
  if (!tvl) return <></>;
  const risk = row.riskProfile;
  const tranche = Tranche[risk];
  const columns = [
    {
      title: t("epoch"),
      dataIndex: "epoch",
      key: "epoch",
      align: "center",
    },
    {
      title: `${pool.pair[0].name} ${t("locked")}`,
      dataIndex: "lockedValue",
      key: "lockedValue",
      align: "right",
    },
    tranche === Tranche.A
      ? {
          title: `SFI ${t("locked")}`,
          dataIndex: "sfilockedValue",
          key: "sfilockedValue",
          align: "right",
        }
      : {},
    {
      title: t("totalusd"),
      dataIndex: "usdValue",
      key: "usdValue",
      align: "right",
    },
  ];

  let data = [];
  Object.entries(tvl).forEach(([key, value]) => {
    if (key !== "total" && value[tranche])
      data.push({
        epoch: key,
        key: key,
        lockedValue: new BigNumber(value[tranche].token0).toFormat(2),
        ...(tranche === Tranche.A
          ? {
              sfilockedValue: new BigNumber(value[tranche].sfi).toFormat(2),
            }
          : {}),
        usdValue: "$" + new BigNumber(value[tranche].usd).toFormat(2),
      });
  });
  return <BasicPoolStateTable columns={columns} data={data} />;
};

export default PoolStateTable;
