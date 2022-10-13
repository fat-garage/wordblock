#!/bin/bash
target_dir='./node_modules/@metamask/inpage-provider/dist'
if test -e ./scripts/patch/MetaMaskInpageProvider.js
then
echo 'replace @metamask/inpage-provider/dist/MetaMaskInpageProvider...'
cp ./scripts/patch/MetaMaskInpageProvider.js $target_dir/MetaMaskInpageProvider.js
fi

target_dir='./node_modules/@metamask/inpage-provider/dist'
if test -e ./scripts/patch/siteMetadata.js
then
echo 'replace @metamask/inpage-provider/dist/siteMetadata...'
cp ./scripts/patch/siteMetadata.js $target_dir/siteMetadata.js
fi

target_dir='./node_modules/cross-fetch/dist'
if test -e ./scripts/patch/browser-polyfill.js
then
echo 'replace cross-fetch/dist/browser-polyfill...'
cp ./scripts/patch/browser-polyfill.js $target_dir/browser-polyfill.js
fi

target_dir='./node_modules/cross-fetch/dist'
if test -e ./scripts/patch/browser-ponyfill.js
then
echo 'replace cross-fetch/dist/browser-ponyfill...'
cp ./scripts/patch/browser-ponyfill.js $target_dir/browser-ponyfill.js
fi