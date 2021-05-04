import { FlexBox, RippleBox } from "components/Common/Box";
import { Typography } from "components/Common/Statistic";
import styled, { css } from "styled-components";
import Loader from "react-loader-spinner";
import { RemixIcon } from "components/Common/Icon";

const StyledContainer = styled(FlexBox)`
  width: 100%;
  padding: 0.6rem 0;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.web3modal.border};
  position: relative;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.web3modal.hover};
  }
  ${({ disabled }) =>
    disabled &&
    css`
      filter: grayscale(1);
      opacity: 0.5;
    `}
`;
const centerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const connectedStyle = {
  position: "absolute",
  top: "40%",
  left: "2rem",
  transform: "translate(-50%, -50%)",
};
const ConnectorItem = ({ icon, title, onClick, loading, connected, disabled }) => {
  return (
    <RippleBox
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: disabled || loading ? "none" : "auto",
      }}
      color="#777"
      onClick={onClick}
    >
      <StyledContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        disabled={loading || disabled}
      >
        {loading && <Loader type="TailSpin" color="#aaa" height={50} width={50} style={centerStyle} />}
        {connected && <RemixIcon icon="checkbox-blank-circle-fill" size={10} color="#25c43b" style={connectedStyle} />}
        <img src={icon} width="30px" alt="metamask" style={{ marginBottom: 10 }} />
        <Typography size={16} primary>
          {title}
        </Typography>
      </StyledContainer>
    </RippleBox>
  );
};

export default ConnectorItem;
