import styled from "styled-components";
import darkBrand from "static/images/saffron_big.svg";
import lightBrand from "static/images/saffron_white.svg";
import { FlexBox } from "./Box";
import { useHistory } from "react-router-dom";
import { useResponsiveContext } from "lib/context";
const BrandText = styled.span`
  font-size: ${({ size }) => (size ? size : "1.5rem")};
  font-family: "muli", sans-serif;
  font-weight: 600;
  margin-top: 3px;
  margin-left: 1rem;
  color: ${({ color, theme }) => (color ? color : theme.sidebar.brand)};
`;

const BrandBox = styled(FlexBox)`
  padding: 1rem;
  height: 70px;
  cursor: pointer;
`;

const Brand = ({ color, size, iconSize, icon = true, ...rest }) => {
  const history = useHistory();
  const { isLaptop, isTablet, isLightTheme } = useResponsiveContext();
  const onBrandClick = () => history.push("/");
  return (
    <BrandBox alignItems="center" onClick={onBrandClick} {...rest}>
      {icon && (
        <img
          src={isLightTheme ? darkBrand : lightBrand}
          alt="brand"
          width={iconSize ? iconSize : "22px"}
          style={{ objectFit: "contain" }}
        />
      )}
      {(!isLaptop || isTablet) && (
        <BrandText color={color} size={size}>
          Saffron
        </BrandText>
      )}
    </BrandBox>
  );
};

export default Brand;
