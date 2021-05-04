import { Slider } from "antd";
import styled from "styled-components";

const StyledSlider = styled(Slider)``;

const marks = {
  0: "0%",
  25: "25%",
  50: "50%",
  75: "75%",
  100: "100%",
};

const SliderWrapper = ({ ...props }) => {
  return <StyledSlider marks={marks} defaultValue={0} {...props} />;
};
export default SliderWrapper;
