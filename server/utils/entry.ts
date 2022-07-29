import { resolve } from 'path';

import execa from 'execa';

import { HOST, PORT, HRM_PATH, __DEV__, ENABLE_DEVTOOLS } from './constants';

const src = resolve(__dirname, '../../src');
const HMR_URL = encodeURIComponent(`http://${HOST}:${PORT}${HRM_PATH}`);
// !: path must be devServer  otherwise client will use chrome://xxx request
const HMRClientScript = `webpack-hot-middleware/client?path=${HMR_URL}&reload=true&overlay=true`;

const backgroundPath = resolve(src, './background/index.ts');
const optionsPath = resolve(src, './options/index.tsx');
const popupPath = resolve(src, './popup/index.tsx');

const devEntry: Record<string, string[]> = {
  background: [HMRClientScript, backgroundPath],
  options: [HMRClientScript, 'react-hot-loader/patch', optionsPath],
  popup: [HMRClientScript, 'react-hot-loader/patch', popupPath],
};
const prodEntry: Record<string, string[]> = {
  background: [backgroundPath],
  options: [optionsPath],
  popup: [popupPath],
};
const entry = __DEV__ ? devEntry : prodEntry;

if (ENABLE_DEVTOOLS) {
  entry.options.unshift('react-devtools');
  entry.popup.unshift('react-devtools');
  execa.command('npx react-devtools').catch((error) => {
    console.error('Startup react-devtools occur error');
    error && console.error(error);
  });
}

entry.contents = [resolve(src, './contents/index.tsx')];

if (__DEV__) {
  entry.contents.unshift(resolve(__dirname, './allTabClient.ts'));
  entry.background.unshift(resolve(__dirname, './backgroundClient.ts'));
}

export default entry;
