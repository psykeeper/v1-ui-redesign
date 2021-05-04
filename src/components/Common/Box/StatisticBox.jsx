import FlexBox from "./FlexBox";
import { Typography, Highlight } from "components/Common/Statistic";

const StatisticBox = ({ title, highlight, children }) => {
  return (
    <FlexBox flexDirection="column" gap={4} alignItems="center">
      <Typography size={11} secondary>
        {title}
      </Typography>
      {highlight ? (
        <Typography>
          <Highlight>{children}</Highlight>
        </Typography>
      ) : (
        children
      )}
    </FlexBox>
  );
};

export default StatisticBox;
