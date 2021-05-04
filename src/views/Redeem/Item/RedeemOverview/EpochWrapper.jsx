import { FlexBox } from "components/Common/Box";
import { Progress } from "antd";
import styled, { withTheme } from "styled-components";
import { useEffect, useState, useCallback } from "react";
import { Typography } from "components/Common/Statistic";
import { useSaffronContext } from "lib/context";
import { toTimezoneFormat } from "lib/utils/helper";
import { useTranslation } from "react-i18next";

const StyledProgress = styled(Progress)`
  .ant-progress-inner {
    background: ${({ theme }) => theme.progress.tracker} !important;
  }
  .ant-progress-text {
    color: ${({ theme }) => theme.typo.secondary} !important;
  }
`;

const EpochWrapper = ({ theme }) => {
  const { t } = useTranslation();
  const { epochEnd, epochStart } = useSaffronContext();
  const [progress, setProgress] = useState(0);
  const [day, setDay] = useState(0);
  const getData = useCallback(() => {
    if (!epochEnd || !epochStart) return;
    const currentTimeStamp = Math.round(new Date().getTime() / 1000);
    let _progress = Math.round(((currentTimeStamp - epochStart) / (epochEnd - epochStart)) * 100);
    _progress = Math.min(_progress, 100);
    _progress = Math.max(_progress, 0);
    setDay(Math.round((epochEnd - currentTimeStamp) / 3600 / 24));
    setProgress(_progress);
  }, [epochEnd, epochStart]);

  useEffect(() => {
    getData();
    const interval = setInterval(async () => {
      getData();
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [getData]);

  return (
    <FlexBox flexDirection="column">
      <FlexBox flexDirection="column" style={{ marginBottom: "20px" }}>
        <Typography weight={550} primary>
          {t("redeem.epochstart")}
        </Typography>
        {epochEnd && <Typography size={13}>{toTimezoneFormat(epochEnd)}</Typography>}
      </FlexBox>
      <FlexBox justifyContent="space-between">
        <Typography size={13}>{t("redeem.epochending")}</Typography>
        <Typography size={13}>
          {day} {t("days")}
        </Typography>
      </FlexBox>

      <StyledProgress
        strokeColor={{
          from: theme.progress.from,
          to: theme.progress.to,
        }}
        percent={progress}
      />
    </FlexBox>
  );
};

export default withTheme(EpochWrapper);
