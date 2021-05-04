import TelegramIcon from "static/community/telegram.webp";
import TelegramIconWhite from "static/community/telegram_white.svg";
import DiscordIcon from "static/community/discord.png";
import DiscordIconWhite from "static/community/discord_white.svg";
import GithubIcon from "static/community/github.png";
import GithubIconWhite from "static/community/github_white.svg";
import MediumIcon from "static/community/medium.png";
import MediumIconWhite from "static/community/medium_white.svg";
import TwitterIcon from "static/community/twitter.png";
import TwitterIconWhite from "static/community/twitter_white.svg";
import UniswapIcon from "static/community/uniswap.png";
import UniswapIconWhite from "static/community/uniswap_white.svg";
import DharmaIcon from "static/community/dharma.png";
import DharmaIconWhite from "static/community/dharma_white.svg";
import DefiPulseIcon from "static/community/defipulse.png";
import DefiPulseIconWhite from "static/community/defipulse_white.png";
import SushiIcon from "static/community/sushi.svg";
import SushiIconWhite from "static/community/sushiswap_white.svg";
import YoutubeIcon from "static/community/youtube.svg";
import YoutubeIconWhite from "static/community/youtube_white.svg";

const getCommunityData = (t, isLightTheme) => {
  return [
    {
      icon: isLightTheme ? TelegramIcon : TelegramIconWhite,
      title: "Telegram",
      description: t("community.telegram"),
      link: "https://t.me/saffronfinance",
    },
    {
      icon: isLightTheme ? DiscordIcon : DiscordIconWhite,
      title: "Discord",
      description: t("community.discord"),
      link: "https://discord.gg/pDXpXKY",
    },
    {
      icon: isLightTheme ? GithubIcon : GithubIconWhite,
      title: "Github",
      description: t("community.github"),
      link: "https://github.com/saffron-finance/saffron",
    },
    {
      icon: isLightTheme ? TwitterIcon : TwitterIconWhite,
      title: "Twitter",
      description: t("community.twitter"),
      link: "https://twitter.com/saffronfinance_",
    },
    {
      icon: isLightTheme ? MediumIcon : MediumIconWhite,
      title: "Medium",
      description: t("community.medium"),
      link: "https://medium.com/saffron-finance",
    },
    {
      icon: isLightTheme ? DefiPulseIcon : DefiPulseIconWhite,
      title: "DeFi Pulse",
      description: t("community.defipulse"),
      link: "https://defipulse.com/defi-list",
    },
    {
      icon: isLightTheme ? DharmaIcon : DharmaIconWhite,
      title: "Dharma",
      description: t("community.dharma"),
      link: "https://www.dharma.io/token/0xb753428af26e81097e7fd17f40c88aaa3e04902c",
    },
    {
      icon: isLightTheme ? UniswapIcon : UniswapIconWhite,
      title: "Uniswap",
      description: t("community.swap"),
      link: "https://app.uniswap.org/#/swap?inputCurrency=0xb753428af26e81097e7fd17f40c88aaa3e04902c",
    },
    {
      icon: isLightTheme ? SushiIcon : SushiIconWhite,
      title: "Sushiswap",
      description: t("community.swap"),
      link:
        "https://exchange.sushiswapclassic.org/#/swap?inputCurrency=0xb753428af26e81097e7fd17f40c88aaa3e04902c&outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
    {
      icon: isLightTheme ? YoutubeIcon : YoutubeIconWhite,
      title: "Saffron Academy",
      description: t("community.youtube"),
      link: "https://www.youtube.com/channel/UCk_ZDXcc9Z56p9HWp7tFArA",
    },
  ];
};

export default getCommunityData;
