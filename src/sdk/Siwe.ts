/* eslint-disable class-methods-use-this */
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDSession } from 'did-session';
import { Ethereum } from './Ethereum';

const CERAMIC_API = 'http://local1.dataverseceramicdaemon.com';

export class Siwe {
  async initCeramic() {
    const ethereum = new Ethereum();
    const ethProvider = await ethereum.getEthereumClient();
    const [address]: string[] = await ethProvider.request({
      method: 'eth_requestAccounts',
    });
    const authProvider = new EthereumAuthProvider(ethProvider, address);
    const session = await DIDSession.authorize(authProvider, {
      resources: [`ceramic://*`],
      domain: chrome.runtime.id,
    });
    const sessionString = session.serialize();

    const ceramicClient = new CeramicClient(CERAMIC_API);
    ceramicClient.did = session.did;

    return { ceramicClient, sessionString, walletAddress: await ethereum.getWalletAddress() };
  }
}
