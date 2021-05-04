import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Noto Sans', sans-serif;
    background-color: ${({ theme }) => theme.body.background} !important;
    color: ${({ theme }) => theme.typo.primary};
    padding: 0;
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    height: auto;
    overflow: hidden;
  }

  footer {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
  }

  small {
    display: block;
  }

  button {
    display: block;
  }
  a {
    color: ${({ theme }) => theme.link.color};
    cursor: pointer;
    text-decoration: none;
    &:hover {
      color: ${({ theme }) => theme.link.hover};
    }
  }
  .swal2-popup {
    background: red;
  }
`;

export default GlobalStyles;
