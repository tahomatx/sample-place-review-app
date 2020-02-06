import { compose } from 'recompose';

import { injectTheme } from 'common/theme';
import { injectUser } from "common/user";
import app from "common/app";

import breakpoints from './breakpoints';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import React from "react";
import { Global, css } from '@emotion/core';


const injectGlobalStyle = Component => props => (
  <React.Fragment>
    <Global styles={css`
      html {
        font-size: 14px;
        font-family: "Noto Sans JP", sans-serif;
        ${'' /* font-family: "Noto Sans CJK JP", "Noto Sans JP", sans-serif;
        font-feature-settings: "palt", "pkna", "frac", "kern"; */}
        font-kerning: normal;
        font-weight: 300;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      a:hover,
      a:active {
        text-decoration: underline;
      }
    `}
    />
    <Component {...props} />
  </React.Fragment>
);


const theme = responsiveFontSizes(createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: ['"Noto Sans JP"', 'sans-serif'].join(','),
  },
  palette: {
    background: {
      default: '#fff',
    },
    primary: {
      light: '#8e8e8e',
      main: '#616161',
      dark: '#373737',
    },
    secondary: {
      light: '#ae52d4',
      main: '#7b1fa2',
      dark: '#4a0072',
    },
  },
  breakpoints: {
    values: {
      xs: breakpoints.xs,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
    },
  },
}));


export default compose(injectGlobalStyle, injectTheme(theme), injectUser(app));
