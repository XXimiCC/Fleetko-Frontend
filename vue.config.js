const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_variables.scss";
        `
      }
    }
  }
}
