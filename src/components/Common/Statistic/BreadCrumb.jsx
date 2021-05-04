import { FlexBox } from "components/Common/Box";
import { Link } from "react-router-dom";
import { Typography } from "components/Common/Statistic";

const BreadCrumb = ({ data }) => {
  return (
    <FlexBox flexDirection="column" style={{ marginTop: -16 }}>
      {data.map(({ title, to }, index) => {
        return (
          <Link to={to} key={index}>
            <Typography
              size={index === data.length - 1 ? 16 : 12}
              primary={index === data.length - 1}
              secondary={index !== data.length - 1}
            >
              {title}
            </Typography>
          </Link>
        );
      })}
    </FlexBox>
  );
};

export default BreadCrumb;
