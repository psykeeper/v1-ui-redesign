import { Modal } from "antd";
import styled, { css } from "styled-components";
import { useGlobalContext } from "lib/context";
const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: ${({ theme }) => theme.modal.content};
    border-radius: 8px;
  }
  .ant-modal-header {
    background: ${({ theme }) => theme.modal.header};
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    ${({ border = true }) =>
      border
        ? css`
            border-bottom: ${({ theme }) => theme.modal.border};
          `
        : css`
            border: none;
          `};
  }
  .ant-modal-body {
    font-size: 13px;
    overflow: auto;
    max-height: 700px;
    color: ${({ theme }) => theme.typo.secondary} !important;
    @media (max-width: 1200px) {
      max-height: 550px;
    }
  }
  .ant-modal-title {
    display: flex;
    align-items: center;
    color: white;
    font-size: 1.25rem;
    span {
      margin-left: 0.5rem;
    }
  }
  .ant-modal-close {
    color: white;
    &:hover {
      color: #888;
    }
  }
  .ant-modal-footer {
    padding: 0.75rem 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    ${({ footAlign }) =>
      footAlign
        ? css`justify-content: ${footAlign}};`
        : css`
            justify-content: flex-end;
          `}

    background: transparent;
    ${({ border = true }) =>
      border
        ? css`
            border-top: ${({ theme }) => theme.modal.border} !important;
          `
        : css`
            border: none;
          `};
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    div:last-child {
      margin-left: 8px;
    }
  }
`;

const CustomModal = ({ children, ...rest }) => {
  const { setActivePool } = useGlobalContext();
  const afterClose = () => {
    setActivePool(null);
  };
  return (
    <StyledModal afterClose={() => afterClose()} {...rest}>
      {children}
    </StyledModal>
  );
};
export default CustomModal;
