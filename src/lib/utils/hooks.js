import { useState, useEffect } from "react";
import _ from "lodash";
import CoinGecko from "coingecko-api";
import axios from "axios";

export const useDarkMode = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");

    if (localTheme) {
      setTheme(localTheme);
    } else {
      window.localStorage.setItem("theme", "light");
    }
  }, []);

  return [theme, toggleTheme];
};

export const useOuterClickNotifier = (
  onOuterClick,
  innerRef,
  // Ignores Selects, and GA overlay
  ignoreClasses = ["StyledDrop", "LayerModal"],
  ignoreIds = ["__ga_grayLayout__"]
) => {
  useEffect(() => {
    let handleClick;
    if (_.isArray(innerRef)) {
      handleClick = (e) => {
        let clickedInside = false;

        if (!document.contains(e.target)) {
          clickedInside = true;
        }

        innerRef.forEach((singleRef) => {
          clickedInside = clickedInside || (singleRef.current && singleRef.current.contains(e.target));
        });

        if (ignoreClasses) {
          ignoreClasses.forEach((singleClass) => {
            const elements = document.querySelectorAll(`[class*="${singleClass}"]`);
            if (elements.length) {
              elements.forEach((singleElement) => {
                clickedInside = clickedInside || singleElement.contains(e.target);
              });
            }
          });
        }

        if (ignoreIds) {
          ignoreIds.forEach((singleClass) => {
            const elements = document.querySelectorAll(`[id*="${singleClass}"]`);
            if (elements.length) {
              elements.forEach((singleElement) => {
                clickedInside = clickedInside || singleElement.contains(e.target);
              });
            }
          });
        }

        if (!clickedInside) {
          onOuterClick(e);
        }
      };

      let result = false;
      innerRef.forEach((singleRef) => {
        result = result || singleRef.current;
      });
      if (result) {
        window.addEventListener("click", handleClick);
      }
    } else {
      handleClick = (e) => {
        innerRef.current && !innerRef.current.contains(e.target) && onOuterClick(e);
      };

      if (innerRef.current) {
        window.addEventListener("click", handleClick);
      }
    }

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [onOuterClick, innerRef, ignoreClasses, ignoreIds]);
};

export const useAPIData = () => {
  const [data, setData] = useState({
    price: 0,
    saffronData: null,
  });

  useEffect(() => {
    const CoinGeckoClient = new CoinGecko();
    const fetchData = async () => {
      try {
        const { data: price } = await CoinGeckoClient.simple.price({
          ids: [
            "saffron-finance",
            "tether",
            "ethereum",
            "dai",
            "usd-coin",
            "compound",
            "btse-token",
            "wrapped-bitcoin",
            "geeq",
            "empty-set-dollar",
            "interest-bearing-eth",
            "alpha-finance",
            "rarible",
            "portion",
          ],
          vs_currencies: ["usd"],
        });
        const { data: saffronData } = await axios.get("https://gecko.spice.finance/apy");

        setData({
          price,
          saffronData,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    const interval = setInterval(async () => {
      fetchData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
};

export const useMarketData = () => {
  const [marketData, setMarketData] = useState();
  useEffect(() => {
    const CoinGeckoClient = new CoinGecko();
    CoinGeckoClient.coins.fetch("saffron-finance").then(({ data }) => {
      setMarketData(data?.market_data);
    });
  }, []);
  return marketData;
};
