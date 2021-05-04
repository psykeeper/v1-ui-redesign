import styled, { css } from "styled-components";
import { Typography } from "components/Common/Statistic";
import FlexBox from "./FlexBox";

const StyledPaper = styled(FlexBox)`
  background: ${({ theme }) => theme.paper.background};
  border-radius: 4px;
  height: 100%;
  width: auto;
  ${({ border = true }) =>
    border
      ? css`
          border: ${({ theme }) => theme.paper.border};
        `
      : css`
          border: none;
        `}
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
    border-top: ${({ theme }) => theme.paper.border};
    padding: 0.5rem 0.75rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

const Paper = ({ title, children, gap, footer, ...rest }) => {
  return (
    <StyledPaper {...rest}>
      {title && (
        <Typography className="header" size={18} weight={500} primary>
          {title}
        </Typography>
      )}
      <FlexBox className="body" gap={gap} {...rest}>
        {children}
      </FlexBox>
      {footer && <div className="footer">{footer.map((elem) => elem)}</div>}
    </StyledPaper>
  );
};

export default Paper;
