const darkThemeColors = {
  primary: "#0A0619",
  secondary: "#0e0c1d",
};
const lightThemeColors = {
  primary: "#f7f9fb",
  secondary: "#f0f4f8",
};
const lightTheme = {
  body: {
    background: lightThemeColors.primary,
  },
  sidebar: {
    background: "#fff",
    text: "black",
    brand: "black",
    divider: "#141023",
    hover: "#ddd",
    active: {
      text: "#c44536",
      background: "#f1f1f1",
    },
  },
  highlight: "#C44536",
  table: {
    even: lightThemeColors.primary,
    odd: lightThemeColors.secondary,
    risk: "#C44536",
    hover: "#e3e7ea",
    sortHover: lightThemeColors.secondary,
  },
  tooltip: {
    background: "white",
    text: "black",
  },
  indicator: {
    border: "black",
    background: "transparent",
    hover: "#c44536",
  },
  web3modal: {
    hover: "rgba(60, 137, 243, 0.5)",
    border: "rgb(95 95 95 / 20%)",
  },
  icon: {
    color: "black",
    active: "#c44536",
    background: "#c44536",
  },
  statistic: {
    text: "black",
    background: lightThemeColors.secondary,
  },
  privacy: {
    border: "#d2d2d2",
    background: "#eaeaea",
  },
  typo: {
    primary: "#000",
    secondary: "#444444",
    price: "#c44536",
  },
  link: {
    color: "#c44536",
    hover: "#a0372c",
  },
  progress: {
    from: "#ff6957",
    to: "#cf2a17",
    tracker: "#f5f5f5",
  },
  card: {
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  chartBox: {
    border: "transparent",
    background: lightThemeColors.secondary,
  },
  bigLogo: "black",
  sidebarToggle: {
    background: "white",
    hover: "#f0f0f0",
  },
  balanceModal: {
    border: "rgb(95 95 95 / 20%)",
    background: "white",
    divider: "#c44536",
    color: "black",
    container: "#f6f6f791",
    button: {
      background: "#909090",
      border: "rgb(95 95 95 / 20%)",
      color: "white",
      hover: "#757575",
    },
  },
  button: {
    text: "white",
    disabled: {
      text: "#bbbbbb",
      background: "#d4d4d4",
    },
    primary: {
      text: "#F1F1F1",
      background: "#C44536",
      hover: "#a72f21",
    },
    secondary: {
      text: "white",
      background: "#909090",
      hover: "#757575",
    },
  },
  modal: {
    content: "white",
    header: "#c44536",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  paper: {
    background: "white",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  header: {
    background: lightThemeColors.primary,
    boxShadow: "rgb(232 232 232 / 68%)",
  },
};

const darkTheme = {
  body: {
    background: darkThemeColors.primary,
  },
  highlight: "#00F27D",
  sidebar: {
    background: "#0E0C1D",
    brand: "#ffffff",
    text: "#838383",
    divider: "#141023",
    hover: "#141127",
    active: {
      text: "#FFFFFF",
      background: "#161235",
    },
  },
  indicator: {
    border: "white",
    background: "transparent",
    hover: "#795CF1",
  },
  table: {
    even: darkThemeColors.primary,
    odd: darkThemeColors.secondary,
    risk: "#FFEB6A",
    hover: "#161235",
    sortHover: darkThemeColors.secondary,
  },
  sidebarToggle: {
    background: "#177ddc",
    hover: "#095cb5",
  },
  chartBox: {
    border: "#FFEC75",
    background: "transparent",
  },
  privacy: {
    border: "#ffec75",
    background: "#444026",
  },
  tooltip: {
    background: "#261757",
    text: "white",
  },
  icon: {
    color: "white",
    active: "white",
    background: "#FFEC75",
  },
  typo: {
    primary: "#FFFFFF",
    secondary: "#838383",
    price: "#C44536",
  },
  link: {
    color: "#adb0bb",
    hover: "#177ddc",
  },
  paper: {
    background: "transparent",
    border: "1px solid #231d47a6",
  },
  card: {
    border: "1px solid #38315da6",
  },
  balanceModal: {
    border: "rgba(121, 92, 241, 0.5)",
    background: "#141023",
    divider: "#ffdc00",
    color: "white",
    container: "rgba(22, 18, 53, 0.25)",
    button: {
      background: darkThemeColors.secondary,
      border: "rgba(121, 92, 241, 0.2)",
      color: "white",
      hover: "#17142d",
    },
  },
  bigLogo: "#e6e5e8",
  statistic: {
    text: "white",
    background: darkThemeColors.secondary,
  },
  button: {
    text: "white",
    disabled: {
      text: "#3a3354",
      background: "#1c182d",
    },
    primary: {
      text: "#F1F1F1",
      background: "#C44536",
      hover: "#a72f21",
    },
    secondary: {
      text: "#000000",
      background: "#FFEC75",
      hover: "#ccb737",
    },
  },

  web3modal: {
    hover: "#161235",
    border: "rgba(121, 92, 241, 0.2)",
  },

  modal: {
    content: "#0A0619",
    header: "#0A0619",
    border: "1px solid #231C47",
  },
  progress: {
    from: "#1D91FE",
    to: "#2CC9FE",
    tracker: "#4e545f",
  },
  header: {
    background: "#0A0619",
    boxShadow: "rgb(28 23 51 / 65%)",
  },
};

export { lightTheme, darkTheme };
