import DarkSaffron from "static/images/saffron_big.svg";
import LightSaffron from "static/images/saffron_white.svg";
import styled from "styled-components";
import { FlexBox } from "components/Common/Box";
import { useResponsiveContext } from "lib/context";
import { LinkButton } from "components/Common/Button";
import Particle from "./Particle";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

const StyledContainer = styled(FlexBox)`
  top: 50%;
  transform: translateY(-50%);
  position: fixed;
  margin-left: 12rem;
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const BigLogo = styled.div`
  font-size: 4.75rem;
  color: ${({ theme }) => theme.bigLogo};
  font-family: "muli", sans-serif;
  font-weight: 600;
  margin-bottom: 1.5rem;
  img {
    width: 0.75em;
    vertical-align: text-bottom !important;
    margin-right: 1rem;
  }
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Description = styled.div`
  font-size: 1.3rem;
  color: #6c757d;
  font-family: "Montserrat", sans-serif !important;
  max-width: 46rem;
  margin-bottom: 2rem;
`;

const Welcome = () => {
  const { isLightTheme } = useResponsiveContext();
  const { t } = useTranslation();
  return (
    <Fragment>
      <Particle />
      <StyledContainer flexDirection="column">
        <BigLogo>
          <img src={isLightTheme ? DarkSaffron : LightSaffron} alt="saffron" />
          Saffron
        </BigLogo>
        <Description>{t("home.description")}</Description>
        <FlexBox gap={20}>
          <LinkButton to="/docs" size={20} secondary>
            {t("learnmore")}
          </LinkButton>
          <LinkButton to="/dashboard" size={20}>
            {t("dashboard")}
          </LinkButton>
        </FlexBox>
      </StyledContainer>
    </Fragment>
  );
};

export default Welcome;
