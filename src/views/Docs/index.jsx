import { FlexBox } from "components/Common/Box";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { useTranslation } from "react-i18next";

const StyledBox = styled(FlexBox)`
  padding: 1rem 2rem;
  font-size: 16px;
  .doc_introduction {
    font-size: 44px;
    color: ${({ theme }) => theme.typo.primary};
    font-weight: 600;
    margin-bottom: 1rem;
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  .doc_paragraph {
    margin-bottom: 1rem;
    b {
      font-size: 24px;
      font-weight: 600;
    }
    p {
      margin: 1rem 0;
    }
    .doc_image_container {
      margin: 1.5rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
      }
      .doc_image_description {
        margin-top: 10px;
        font-size: 13px;
        color: ${({ theme }) => theme.typo.secondary};
      }
    }
  }
`;

const Docs = () => {
  const { t } = useTranslation();
  return <StyledBox flexDirection="column">{ReactHtmlParser(t("introduction"))}</StyledBox>;
};

export default Docs;
