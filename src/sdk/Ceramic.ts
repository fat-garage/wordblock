/* eslint-disable class-methods-use-this */
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { Siwe } from './Siwe';

export class Ceramic {
  static ceramicClient: CeramicClient;

  getCeramicClient() {
    return Ceramic.ceramicClient;
  }

  async initCeramic() {
    const siwe = new Siwe();
    const res = await siwe.initCeramic();
    Ceramic.ceramicClient = res.ceramicClient;
    return res;
  }

  async createStream(content: {}) {
    const jsonContent = JSON.stringify(content);
    const doc = await TileDocument.create(Ceramic.ceramicClient, jsonContent);
    const streamId = doc.id.toString();
    console.log({ streamId });
    return streamId;
  }

  async loadStream(streamId: string) {
    const doc = await TileDocument.load(Ceramic.ceramicClient, streamId);
    return doc.content;
  }

  isCeramicValid(ceramicClient: CeramicClient) {
    return (
      ceramicClient != null &&
      ceramicClient.did != null &&
      ceramicClient.did.authenticated &&
      ceramicClient.did.hasCapability &&
      !this.isExpired(ceramicClient.did.capability.p.exp!)
    );
  }

  isExpired(expireStr: string) {
    const now = new Date();
    const exp = new Date(expireStr);
    return now > exp;
  }

  clearCeramic() {
    Ceramic.ceramicClient = null;
  }
}
