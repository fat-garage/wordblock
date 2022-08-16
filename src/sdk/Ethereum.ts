/* eslint-disable class-methods-use-this */
import detectEthereumProvider from 'metamask-extension-provider';
import { MetaMaskInpageProvider } from '@metamask/inpage-provider';

export class Ethereum {
  static ethereumClient: MetaMaskInpageProvider;
  async setEthereumClient() {
    const ethereumClient: MetaMaskInpageProvider = await new Promise((resolve) => {
      const provider = detectEthereumProvider();
      if (provider.isConnected()) {
        resolve(provider);
      } else {
        provider.on('connect', () => {
          resolve(provider);
        });
        setTimeout(() => {
          (provider as any).isMetaMask = false;
          resolve(provider);
        }, 1000);
      }
    });
    Ethereum.ethereumClient = ethereumClient;
    return ethereumClient;
  }

  async getEthereumClient() {
    if (!Ethereum.ethereumClient) {
      return this.setEthereumClient();
    }
    return Ethereum.ethereumClient;
  }

  async getWalletAddress() {
    if (!Ethereum.ethereumClient) {
      const ethereum = await this.setEthereumClient();
      return ethereum.selectedAddress;
    }
    return Ethereum.ethereumClient.selectedAddress;
  }
}
