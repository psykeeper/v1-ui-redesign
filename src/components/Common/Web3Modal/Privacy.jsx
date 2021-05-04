import styled from "styled-components";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";

const StyledCheckbox = styled(Checkbox)`
  color: ${({ theme }) => theme.typo.primary};
  padding: 8px;
  margin-bottom: 1rem;
  width: 100%;
  background: ${({ theme }) => theme.privacy.background};
  border: 1px solid ${({ theme }) => theme.privacy.border};
  border-radius: 0px;
`;
const PrivacyBox = ({ setChecked }) => {
  const { t } = useTranslation();
  return <StyledCheckbox onChange={(e) => setChecked(e.target.checked)}>{t("home.agreement")}</StyledCheckbox>;
};

export default PrivacyBox;
