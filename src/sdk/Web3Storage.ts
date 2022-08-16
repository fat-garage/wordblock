/* eslint-disable class-methods-use-this */
/* eslint-disable no-await-in-loop */
import Web3StorageSDK from 'web3.storage';

export class Web3Storage {
  private accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg5NkQ1YjhCNmJBM0IwNDEzNDdlQmNDRUQzMDkxMTQ4NDc2MEZEMEIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MjgwMTQwMDg2NTgsIm5hbWUiOiJscWIifQ.jvEWmpMHWEvg49nZs1L-Rd0EOwGIGALkMwu2ng4beFY';

  getAccessToken() {
    return this.accessToken;
  }

  makeFileObjects() {
    const obj = { hello: 'world' };
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });

    const files = [
      new File(['contents-of-file-1'], 'plain-utf8.txt'),
      new File([blob], 'hello.json'),
    ];
    return files;
  }

  makeStorageClient() {
    return new Web3StorageSDK.Web3Storage({ token: this.getAccessToken() ?? '' });
  }

  async storeFiles(files: any) {
    const client = this.makeStorageClient();
    const cid = await client.put(files);
    return cid;
  }

  async retrieveFiles(cid: string) {
    const client = this.makeStorageClient();
    const res = await client.get(cid);
    if (!res || !res.ok) {
      throw new Error(`failed to get ${cid}`);
    }
    let data;
    const files = await res.files();
    for (const file of files) {
      data = await file.text();
    }

    return data;
  }

  async checkStatus(cid: string) {
    const client = this.makeStorageClient();
    const status = await client.status(cid);
    console.log(status);
    if (status) {
    }
  }
}
