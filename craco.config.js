const CracoLessPlugin = require("craco-less");
module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "primary-color": "#C44536",
              "link-color": "#C44536",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
