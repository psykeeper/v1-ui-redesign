import { Row, Col, Space } from "antd";
import { FlexBox } from "components/Common/Box";
import { Typography } from "components/Common/Statistic";
import { Card } from "components/Common/Box";
import getCommunityData from "./data";
import { useResponsiveContext } from "lib/context";
import { useTranslation } from "react-i18next";

const SocialItem = ({ icon, title, description, link }) => {
  return (
    <Col xl={8} md={12} xs={24}>
      <a target="_blank" rel="noreferrer" href={link}>
        <Card>
          <Space size={15} align="start">
            <img src={icon} alt="social" width="50px" />
            <FlexBox flexDirection="column" gap={5}>
              <Typography size={16} weight={550} primary>
                {title}
              </Typography>
              <Typography size={13}>
                <Typography>{description}</Typography>
              </Typography>
            </FlexBox>
          </Space>
        </Card>
      </a>
    </Col>
  );
};
const Community = () => {
  const { isLightTheme } = useResponsiveContext();
  const { t } = useTranslation();
  return (
    <FlexBox flexDirection="column" gap={30} style={{ maxWidth: 1200 }}>
      <Typography size={32} weight={550} primary>
        {t("community.join")}
      </Typography>
      <Row gutter={[24, 24]}>
        {getCommunityData(t, isLightTheme).map(({ icon, title, description, link, linkUrl }, index) => {
          return (
            <SocialItem icon={icon} title={title} description={description} link={link} linkUrl={linkUrl} key={index} />
          );
        })}
      </Row>
    </FlexBox>
  );
};

export default Community;
