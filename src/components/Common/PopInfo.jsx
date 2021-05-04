import { Popover } from "antd";
import { withTheme } from "styled-components";
import { RemixIcon } from "./Icon";

const PopInfo = ({ theme, trigger, placement, width, children, ...rest }) => {
  return (
    <Popover
      placement={placement ?? "top"}
      trigger={trigger ?? "hover"}
      onClick={(e) => e.stopPropagation()}
      overlayStyle={{ width: width ?? 400, zIndex: 1002 }}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <span style={{ cursor: "pointer", verticalAlign: "middle", marginLeft: 2 }}>
          <RemixIcon color={theme.icon.background} size={16} icon="information-fill" />
        </span>
      )}
    </Popover>
  );
};

export default withTheme(PopInfo);
