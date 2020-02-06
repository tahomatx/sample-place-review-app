require('dotenv').config();
const path = require('path');


module.exports = {
  siteMetadata: {
    title: `Sample Firebase Project`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
    siteUrl: 'https://sample-firebase-project.example.com'
  },
  plugins: [{
      resolve: 'gatsby-plugin-root-import',
      options: {
        common: path.join(__dirname, 'src/common'),
        components: path.join(__dirname, 'src/components'),
        images: path.join(__dirname, 'src/images'),
      }
    },
    `gatsby-plugin-react-helmet`,
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `images`,
    //     path: `${__dirname}/src/images`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-emotion`,
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: path.join(__dirname, `src`),
      },
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Noto Sans JP:100,300,400,700,900,100,300i,400i,700i,900i'],
        }
      }
    },
    // 'gatsby-plugin-offline',
    // TODO `gatsby-plugin-favicon`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sitemap`,
      // options: {
      //   exclude: ["/lp/*"],
      // }
    },
    `gatsby-plugin-robots-txt`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: true,
        stripMetadata: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Sample Firebase Project`,
        short_name: `Sample Firebase Project`,
        start_url: `/`,
        background_color: `#BBBDBF`,
        theme_color: `#7b1fa2`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
    // {
    //   resolve: `gatsby-plugin-google-tagmanager`,
    //   options: {
    //     id: '',
    //     includeInDevelopment: false,
    //   },
    // },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [
        `/users/*`,
        `/places/*`,
      ] },
    },
    `gatsby-plugin-remove-trailing-slashes`,
    'gatsby-plugin-manifest',
  ],
};
