// import FriendlyErrorsPlugin from '@nuxt/friendly-errors-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { Configuration, ProvidePlugin } from 'webpack';
import WebpackBar from 'webpackbar';
import Dotenv from 'dotenv-webpack';

import { __DEV__, PROJECT_ROOT } from '../utils/constants';
import entry from '../utils/entry';

function getCssLoaders(importLoaders: number) {
  return [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: {
        modules: false,
        sourceMap: true,
        importLoaders,
      },
    },
  ];
}

const commonConfig: Configuration = {
  context: PROJECT_ROOT,
  entry,
  watchOptions: {
    ignored: ['node_modules/**', 'extension/**'],
  },
  output: {
    publicPath: '/',
    path: resolve(PROJECT_ROOT, 'extension'),
    filename: 'js/[name].js',
    // 将热更新临时生成的补丁放到 hot 文件夹中
    hotUpdateChunkFilename: 'hot/[id].[fullhash].hot-update.js',
    hotUpdateMainFilename: 'hot/[runtime].[fullhash].hot-update.json',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      '@': resolve(PROJECT_ROOT, 'src'),
      utils: resolve(PROJECT_ROOT, 'src/utils'),
      styles: resolve(PROJECT_ROOT, 'src/styles'),
    },
    fallback: {
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      crypto: require.resolve('crypto-browserify'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url'),
      os: require.resolve('os-browserify/browser'),
      http: require.resolve('stream-http'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser'),
      fs: false,
      child_process: false,
      // console: require.resolve('console-browserify'),
      // constants: require.resolve('constants-browserify'),
      // domain: require.resolve('domain-browser'),
      // events: require.resolve('events'),
      // punycode: require.resolve('punycode'),
      // querystring: require.resolve('querystring-es3'),
      // string_decoder: require.resolve('string_decoder'),
      // sys: require.resolve('util'),
      // timers: require.resolve('timers-browserify'),
      // tty: require.resolve('tty-browserify'),
      // util: require.resolve('util'),
      // vm: require.resolve('vm-browserify'),
      // zlib: require.resolve('browserify-zlib'),
    },
  },
  plugins: [
    new ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new Dotenv({
      path: './.env',
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new CopyPlugin({
      patterns: [
        // {
        //   from: resolve(PROJECT_ROOT, 'public'),
        //   globOptions: {
        //     ignore: ['**/public/*.html'],
        //   },
        // },
        { from: './src/_locales/', to: './_locales' },
        { from: './src/assets', to: './images' },
        {
          from: resolve(PROJECT_ROOT, `src/manifest.${__DEV__ ? 'dev' : 'prod'}.json`),
          to: 'manifest.json',
        },
      ],
    }),
    new WebpackBar({
      name: 'Building chrome extension',
      color: '#0f9d58',
    }),
    // new FriendlyErrorsPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['options'],
      filename: 'options.html',
      title: 'options page',
      // template: resolve(PROJECT_ROOT, 'public/options.html'),
    }),
    new HtmlWebpackPlugin({
      chunks: ['popup'],
      filename: 'popup.html',
      title: 'popup page',
      // template: resolve(PROJECT_ROOT, 'public/popup.html'),
    }),
    new MiniCssExtractPlugin({
      filename: `css/[name].css`,
      ignoreOrder: false,
    }),
  ],
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(0),
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(1),
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  // 修改 antd 主题
                  // '@primary-color': '#1DA57A',
                },
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(1),
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },
};

export default commonConfig;