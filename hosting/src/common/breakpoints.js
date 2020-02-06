const breakpoints = {
  xs: 0,
  sm: 375,
  md: 764,
  lg: 996,
  xl: 1360,
  xxl: 1692,
};

const maxWidth = {
  xs: 0,
  sm: 400,
  md: 896,
  lg: 1328,
  xl: 1760,
  xxl: 2192,
};

// const maxWidth = {
//   xs: 0,
//   sm: 375,
//   md: 400,
//   lg: 896,
//   xl: 1328,
//   xxl: 1600,
// };

module.exports = {
  ...Object.keys(breakpoints).reduce((res, key) => ({
    ...res,
    [key]: {
      up: `@media (min-width: ${breakpoints[key]}px)`,
      down: `@media (max-width: ${breakpoints[key]}px)`,
      value: breakpoints[key],
      px: `${breakpoints[key]}px`,
      maxWidth: `${maxWidth[key]}px`,
    }
  }), {})
};
