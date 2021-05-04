import NavBar from "components/Layout/NavBar";
import SideBar from "components/Layout/SideBar";
import Container from "components/Layout/Container";
import Dashboard from "./Dashboard";
import Portfolio from "./Portfolio";
import Welcome from "./Welcome";
import LiquidityPools from "./LiquidityPools";
import Redeem from "./Redeem";
import Docs from "./Docs";
import Community from "./Community";
import PageNotFound from "./404";
import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { withTheme } from "styled-components";
const MainWrapper = ({ theme }) => {
  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShadow(currentScrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Fragment>
      <SideBar />
      <NavBar shadow={shadow} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme.tooltip.background,
            color: theme.tooltip.text,
          },
        }}
      />
      <Container>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/addliquidity" component={LiquidityPools} />
          <Route path="/redeem" component={Redeem} />
          <Route path="/docs" component={Docs} />
          <Route path="/community" component={Community} />
          <Route component={PageNotFound} />
        </Switch>
      </Container>
    </Fragment>
  );
};

export default withTheme(MainWrapper);
