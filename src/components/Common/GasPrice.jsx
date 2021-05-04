import { useState, useEffect } from "react";
import { FlexBox } from "components/Common/Box";
import { MaterialIcon } from "components/Common/Icon";
import axios from "axios";
import { Popover } from "antd";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

const StyledFlexBox = styled(FlexBox)`
  .highlight {
    color: ${({ theme }) => theme.highlight};
  }
  i {
    color: ${({ theme }) => theme.typo.secondary};
    margin-right: 4px;
    @media (max-width: 480px) {
      margin-right: 1rem;
    }
  }
`;
const GasMenu = styled.div`
  display: flex;
  flex-direction: column;
  .highlight {
    color: ${({ theme }) => theme.highlight};
  }
`;
const GasPrice = () => {
  const [gasPrice, setGasPrice] = useState();
  const { t } = useTranslation();
  useEffect(() => {
    const getGasPrice = () => {
      axios.get("https://www.etherchain.org/api/gasPriceOracle").then(({ data }) => {
        setGasPrice(data);
      });
    };
    getGasPrice();
    const timer = setInterval(() => getGasPrice(), 60 * 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <StyledFlexBox flexDirection="column">
      {gasPrice && (
        <Popover
          placement={"bottomLeft"}
          trigger="hover"
          title={t("gastracker")}
          content={
            <GasMenu>
              <FlexBox alignItems="center">
                <MaterialIcon icon="local_gas_station" /> {new BigNumber(gasPrice.standard).toFormat(0)} Gwei (
                {t("home.gas.slow")})
              </FlexBox>
              <FlexBox alignItems="center">
                <MaterialIcon icon="local_gas_station" />{" "}
                <span className="highlight">
                  {new BigNumber(gasPrice.fast).toFormat(0)} Gwei ({t("home.gas.standard")})
                </span>
              </FlexBox>
              <FlexBox alignItems="center">
                <MaterialIcon icon="local_gas_station" /> {new BigNumber(gasPrice.fastest).toFormat(0)} Gwei (
                {t("home.gas.fast")})
              </FlexBox>
            </GasMenu>
          }
        >
          <FlexBox alignItems="center">
            <MaterialIcon icon="local_gas_station" />{" "}
            <span className="highlight">{new BigNumber(gasPrice.fast).toFormat(0)} Gwei</span>
          </FlexBox>
        </Popover>
      )}
    </StyledFlexBox>
  );
};

export default GasPrice;
