import open from 'open';
import { Compiler, Stats } from 'webpack';

import argv from './args';

/**
 * webpack plugin，devServer
 */
export default function openBrowser(compiler: Compiler): void {
  const address = argv.open;
  if (typeof address === 'string') {
    let hadOpened = false;
    compiler.hooks.done.tap('open-browser-plugin', async (stats: Stats) => {
      if (!hadOpened && !stats.hasErrors()) {
        await open(address);
        hadOpened = true;
      }
    });
  }
}
