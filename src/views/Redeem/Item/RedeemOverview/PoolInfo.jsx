import { FlexBox } from "components/Common/Box";
import styled from "styled-components";
import { Highlight, Typography } from "components/Common/Statistic";

const StyledFlexBox = styled(FlexBox)`
  padding: 1rem 1.3rem;
`;
const PoolInfo = ({ title, content }) => {
  return (
    <StyledFlexBox flexDirection="column" gap={10}>
      <Typography>{title}</Typography>
      <Typography size={22}>
        <Highlight>{content}</Highlight>
      </Typography>
    </StyledFlexBox>
  );
};

export default PoolInfo;
