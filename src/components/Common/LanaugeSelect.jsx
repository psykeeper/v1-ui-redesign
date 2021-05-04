import { FlexBox } from "components/Common/Box";
import { Select } from "antd";
import { Typography } from "components/Common/Statistic";
import { Languages } from "lib/config/i18n/config";
import { useState, useEffect } from "react";
import { useResponsiveContext } from "lib/context";
import { useTranslation } from "react-i18next";

const LanguageSelect = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.languages[0]);
  const { isLaptop, isTablet } = useResponsiveContext();

  useEffect(() => {
    const localLang = window.localStorage.getItem("language");
    if (localLang) {
      setTimeout(() => {
        setLanguage(localLang);
        i18n.changeLanguage(localLang);
      }, 500);
    } else {
      window.localStorage.setItem("language", "en");
    }
  }, [i18n]);

  const onLanguageClick = (value) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    window.localStorage.setItem("language", value);
  };

  return (
    <FlexBox alignItems="center" gap={10} style={{ marginTop: isLaptop && !isTablet ? 0 : 32, marginLeft: 16 }}>
      {(!isLaptop || isTablet) && <Typography>{t("language")}:</Typography>}
      <Select value={language} style={{ width: 120 }} onChange={onLanguageClick}>
        {Object.entries(Languages).map(([key, value]) => (
          <Select.Option value={key} key={key}>
            {value}
          </Select.Option>
        ))}
      </Select>
    </FlexBox>
  );
};

export default LanguageSelect;
