import styled from "styled-components";
import { Typography } from "components/Common/Statistic";
import FlexBox from "./FlexBox";

const StyledCard = styled(FlexBox)`
  background: transparent;
  border-radius: 0px;
  height: 100%;
  width: auto;

  border: ${({ theme }) => theme.card.border};
  .header {
    padding: 1rem 1rem 0 1rem;
    color: ${({ theme }) => theme.typo.primary};
  }
  .body {
    padding: 1rem;
    width: 100%;
    color: ${({ theme }) => theme.typo.secondary};
  }
  .footer {
    border-top: ${({ theme }) => theme.card.border};
    padding: 0.5rem 0.75rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

const Card = ({ title, children, gap, footer, ...rest }) => {
  return (
    <StyledCard>
      {title && (
        <Typography className="header" size={18} weight={500} primary>
          {title}
        </Typography>
      )}
      <FlexBox className="body" gap={gap} {...rest}>
        {children}
      </FlexBox>
      {footer && <div className="footer">{footer.map((elem) => elem)}</div>}
    </StyledCard>
  );
};

export default Card;
