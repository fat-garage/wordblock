import { resolve } from 'path';
import { BannerPlugin } from 'webpack';
import merge from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import commonConfig from './webpack.common';
import { PROJECT_ROOT, COPYRIGHT, ENABLE_ANALYZE } from '../utils/constants';

const mergedConfig = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new BannerPlugin({
      banner: COPYRIGHT,
      raw: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 1024 * 2,
        configFile: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
        profile: ENABLE_ANALYZE,
      },
    }),
  ],
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    // },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ],
  },
});

// eslint-disable-next-line import/no-mutable-exports
let prodConfig = mergedConfig;
if (ENABLE_ANALYZE) {
  mergedConfig.plugins!.push(new BundleAnalyzerPlugin());
  const smp = new SpeedMeasurePlugin();
  prodConfig = smp.wrap(mergedConfig);
}

export default prodConfig;
