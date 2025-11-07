const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  // 覆盖生产环境输出配置，输出到 dist/prod/ 与 @lesheng/elpis 保持一致
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.join(process.cwd(), './app/public/dist/prod/'),
    publicPath: '/dist/prod/',
    crossOriginLoading: 'anonymous'
  },

  // 只覆盖必要的 plugins
  plugins: [
    // 清空 dist 目录
    new CleanWebpackPlugin(['public/dist'], {
      root: path.resolve(process.cwd(),'./app'),
      exclude: ['public/static'],
      verbose: true,
      dry: false
    })

    // 其他插件保持 @lesheng/elpis 的配置
  ],

  // 优化配置
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        extractComments: false, // 禁用提取注释文件，避免冲突
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true
          }
        }
      })
    ]
  }
}