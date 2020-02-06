import React from "react";
import { ThemeProvider } from '@material-ui/styles';


export const injectTheme = theme => Component => props => (
  <ThemeProvider theme={theme}>
    <Component {...props} />
  </ThemeProvider>
);
