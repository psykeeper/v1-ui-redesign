import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const FlexBox = styled.div`
  align-content: ${({ alignContent }) => alignContent};
  align-items: ${({ alignItems }) => alignItems};
  display: ${({ display }) => display};
  flex-direction: ${({ flexDirection }) => flexDirection};
  ${({ flexFlow, flexWrap }) =>
    !flexFlow &&
    flexWrap &&
    css`
      flex-wrap: ${({ flexWrap }) => flexWrap};
    `}
  ${({ flexFlow }) =>
    flexFlow &&
    css`
      flex-flow: ${flexFlow};
    `}
  justify-content: ${({ justifyContent }) => justifyContent};
  width: ${({ width }) => width};
  & > div {
    ${({ col, gap, flexDirection }) =>
      gap &&
      (flexDirection === "row" || flexDirection === "row-reverse"
        ? !col
          ? css`
              &:not(:last-child) {
                margin-right: ${gap}px;
              }
            `
          : css`
              &:not(:nth-child(${col}n)) {
                margin-right: ${gap}px;
              }
            `
        : css`
            &:not(:last-child) {
              margin-bottom: ${gap}px;
            }
          `)}
    ${({ col, gap }) =>
      col &&
      css`
        flex: 1 0 calc((100% - ${(col - 1) * (gap ? gap : 0)}px) / ${col});
        max-width: calc((100% - ${(col - 1) * (gap ? gap : 0)}px) / ${col});
      `}
  }
`;

FlexBox.propTypes = {
  alignContent: PropTypes.oneOf(["flex-start", "flex-end", "center", "space-between", "space-around", "stretch"]),
  col: PropTypes.number,
  gap: PropTypes.number,
  alignItems: PropTypes.oneOf(["stretch", "flex-start", "flex-end", "center", "baseline"]),
  display: PropTypes.oneOf(["inline-flex", "flex"]),
  flexDirection: PropTypes.oneOf(["row", "row-reverse", "column", "column-reverse"]),
  flexFlow: PropTypes.string,
  flexWrap: PropTypes.oneOf(["nowrap", "wrap", "wrap-reverse"]),
  justifyContent: PropTypes.oneOf([
    "flex-start",
    "flex-end",
    "center",
    "space-between",
    "space-around",
    "space-evenly",
  ]),
};

FlexBox.defaultProps = {
  alignContent: "stretch",
  alignItems: "stretch",
  display: "flex",
  flexDirection: "row",
  flexFlow: null,
  justifyContent: "flex-start",
  width: "auto",
};

FlexBox.displayName = "FlexBox";

export default FlexBox;
