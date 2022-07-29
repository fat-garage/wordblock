import chalk from 'chalk';
import express from 'express';
import webpack from 'webpack';

import devConfig from '../configs/webpack.dev';
import { HOST, PORT as DEFAULT_PORT } from '../utils/constants';
import getPort from '../utils/getPort';
import openBrowser from '../utils/openBrowser';
import setupMiddlewares from '../middlewares';

async function start() {
  const compiler = webpack(devConfig);
  openBrowser(compiler);
  const devServer = express();

  setupMiddlewares(devServer, compiler);
  const PORT = await getPort(HOST, DEFAULT_PORT);
  const httpServer = devServer.listen(PORT, HOST, () => {
    const coloredAddress = chalk.magenta.underline(`http://${HOST}:${PORT}`);
    console.log(`${chalk.bgYellow.black(' INFO ')} DevServer is running at ${coloredAddress} ✔`);
  });

  ['SIGINT', 'SIGTERM'].forEach((signal: any) => {
    process.on(signal, () => {
      httpServer.close();
      console.log(
        chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`),
      );
      process.exit();
    });
  });
}
start();
