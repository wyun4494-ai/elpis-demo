const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  // 覆盖生产环境输出配置，输出到 dist/ 而不是 dist/prod/
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.join(process.cwd(), './app/public/dist/'),
    publicPath: '/dist/',
    crossOriginLoading: 'anonymous'
  },

  // 覆盖 module.rules，不使用 HappyPack，直接使用普通 loader
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }, {
      test: /\.js$/,
      include: [
        // elpis 包的页面目录
        path.resolve(process.cwd(), './node_modules/@lesheng/elpis/app/pages'),
        // 业务项目的页面目录
        path.resolve(process.cwd(), './app/pages')
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    }]
  },

  // 覆盖 plugins，移除 HappyPack
  plugins: [
    // 清空 dist 目录
    new CleanWebpackPlugin(['public/dist'], {
      root: path.resolve(process.cwd(),'./app'),
      exclude: ['public/static'],
      verbose: true,
      dry: false
    }),

    // 提取 CSS
    new MiniCssExtractPlugin({
      chunkFilename: 'css/[name].[contenthash:8].bundle.css',
    }),

    // 压缩 CSS - 暂时禁用
    // new CssMinimizerPlugin()
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