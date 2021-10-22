import "reflect-metadata";
import React from "react";
import { InjectableProvider } from "@app/core";

import "../styles/global.scss";
import { inversifyContainer, nextReduxWrapper } from "./_app.state";

const App = ({ Component, pageProps }) => {
  return (
    <InjectableProvider container={inversifyContainer}>
      <Component {...pageProps} />
    </InjectableProvider>
  );
};

export default nextReduxWrapper.withRedux(App);
