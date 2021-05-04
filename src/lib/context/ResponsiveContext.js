import { createContext, useContext, useEffect } from "react";
import { useDarkMode } from "lib/utils/hooks";
import { useMediaQuery } from "react-responsive";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "components/Theme/themeConfig";

export const ResponsiveContext = createContext();

export const useResponsiveContext = () => useContext(ResponsiveContext);

export const ResponsiveThemeProvider = ({ children }) => {
  const [theme, toggleTheme] = useDarkMode();
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isTablet = useMediaQuery({ maxWidth: 768 });
  const isLaptop = useMediaQuery({ maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, [theme]);
  return (
    <ResponsiveContext.Provider
      value={{
        isLightTheme: theme === "light",
        toggleTheme,
        isTablet,
        isMobile,
        isLaptop,
        isDesktop,
      }}
    >
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>{children}</ThemeProvider>
    </ResponsiveContext.Provider>
  );
};
