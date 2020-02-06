import React from "react";
import { Helmet } from "react-helmet";

export default ({ children }) => (
  <Helmet defaultTitle='Sample app Project' titleTemplate={`%s | Sample app Project`}>
    {/* <meta name="description" content="" /> */}
    {children}
  </Helmet>
);
