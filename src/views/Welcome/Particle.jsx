import TsParticles from "react-tsparticles";
import styled from "styled-components";
const StyledParticle = styled(TsParticles)`
  position: fixed;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
`;
const Particle = () => {
  const currencies = ["dai", "link", "usdc", "usdt", "wbtc", "yfi", "sfi"];
  const tsImages = [];
  for (let currency of currencies)
    tsImages.push({
      src: "assets/images/" + currency + ".png",
      width: 40,
      height: 40,
    });
  const tsConfig = {
    detectRetina: true,
    fpsLimit: 60,
    interactivity: {
      detectsOn: "canvas",
      events: { resize: true },
      modes: {
        attract: { distance: 200, duration: 0.4, speed: 1 },
        bubble: { distance: 400, duration: 2, opacity: 0.8, size: 40 },
        connect: { distance: 80, links: { opacity: 0.5 }, radius: 60 },
        grab: { distance: 400, links: { opacity: 1 } },
        push: { quantity: 4 },
        remove: { quantity: 2 },
        repulse: { distance: 200, duration: 0.4, speed: 1 },
        slow: { factor: 3, radius: 200 },
        trail: { delay: 1, quantity: 1 },
      },
    },
    particles: {
      move: {
        angle: 90,
        attract: { enable: false, rotate: { x: 600, y: 1200 } },
        direction: "right",
        enable: true,
        noise: {
          delay: { random: { enable: false, minimumValue: 0 }, value: 0 },
          enable: false,
        },
        outMode: "out",
        random: false,
        speed: 2,
        straight: false,
        trail: {
          enable: false,
          length: 10,
          fillColor: { value: "#000000" },
        },
      },
      number: {
        density: { enable: true, area: 800, factor: 1600 },
        limit: 0,
        value: 10,
      },
      opacity: {
        animation: {
          enable: false,
          minimumValue: 0.2,
          speed: 1,
          sync: false,
        },
        random: { enable: true, minimumValue: 1 },
        value: 1,
      },
      rotate: {
        animation: { enable: true, speed: 5, sync: false },
        direction: "random",
        path: false,
        random: true,
        value: 0,
      },
      shape: {
        options: { image: tsImages, images: tsImages },
        type: "image",
      },
      size: { value: 16 },
    },
    pauseOnBlur: true,
  };
  return <StyledParticle options={tsConfig} />;
};

export default Particle;
