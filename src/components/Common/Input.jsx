import { Input } from "antd";
import { FlexBox } from "components/Common/Box";
import { ErrorBox } from "components/Common/Statistic";

const InputWrapper = ({ error, ...props }) => {
  return (
    <FlexBox flexDirection="column">
      <Input {...props} style={{ textAlign: "end", border: error ? "1px solid #ff4d4f" : "none" }} />
      {error && <ErrorBox>{error}</ErrorBox>}
    </FlexBox>
  );
};

export default InputWrapper;
