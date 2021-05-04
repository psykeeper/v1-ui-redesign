import { Skeleton } from "antd";

const SkeletonBox = ({ height, width }) => (
  <Skeleton.Input active size="small" style={{ width: width ?? 100, height: height ?? 30, borderRadius: 8 }} />
);

export default SkeletonBox;
