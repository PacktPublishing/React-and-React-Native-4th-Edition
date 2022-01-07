// Adapted from http://stackoverflow.com/a/28623662/4606858
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");

const port = 8080;
const ip = "127.0.0.1";

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true,
  stats: { colors: true }
}).listen(port, ip, err =>
  err ? console.log(err) : console.log(`Listening at ${ip} : ${port}`)
);
