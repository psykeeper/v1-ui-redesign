import { FlexBox } from "components/Common/Box";
import styled from "styled-components";
import { Typography } from "components/Common/Statistic";
const ChildWrapper = styled.div`
  max-width: 100%;
  overflow: auto;
  scrollbar-width: none;
`;

const PoolWrapper = ({ title, description, children, ...rest }) => {
  return (
    <FlexBox flexDirection="column" justifyContent="center" gap={15} style={{ width: "100%" }} {...rest}>
      <Typography size={15} weight={600} underline primary>
        {title}
      </Typography>
      {description}
      <ChildWrapper>{children}</ChildWrapper>
    </FlexBox>
  );
};

export default PoolWrapper;
