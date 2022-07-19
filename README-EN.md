# Wordblock

A web3 note-taking tool built for open and interactive block reference. Everyone can publish user-owned notes (or articles, websites), composed by text cells with wallet signatures (i.e., word blocks).

## Introduction

Use this Chrome extension to experience portable, block-based note-taking backed by authenticated data. You could do block references in your writing (e.g. on [Mirror.xyz](https://mirror.xyz)), not only can you search and refer your own word blocks but also blocks created by anyone with a wallet. Once publish your writing, your publication is no longer a plain text, but interactive, block-chained knowledge graphs with verifiable ownership. See the demo video [here](https://github.com/ownership-labs/wordblock-extension).

## Get Started

```sh
$ git clone https://github.com/fat-garage/wordblock
$ Open chrome://extensions page
$ Enable "Developer mode"
$ Install extension via "Load unpacked"
```

## User Story

(+ image/gif)

* You curate any internet text or article into word blocks under your signature, specifically when you take notes or just highlight something while reading. Each block will be automatically assigned with a unique ID and secured on IPFS for public access.

* When you write and publish on Mirror, you are composing your article with multiple blocks, each has its own ID and knowledge. You can write to create new blocks `·` inside your publication, or search to refer `((block))` `[[page]]` existing blocks created by you or others. 

* Word blocks make your article become interactive and collaborative. Everyone can simply track block references and verify signature chains. That's WEB3.

Assuming `"any internet text"` is curated by `wallet_A` as `block_A` (including `text`, `creator`, `referer`, `url`, `comments`, `tags`...), then `wallet_B` writes `block_B` in which `block_A` is referenced with new comments (this leads to another `block_A_ref`) and publish `article_B`. When you see it,  `block_A_ref` -> `block_A` -> `any internet text` can be discovered with attached ownerships of `wallet_B`, `wallet_A`, `original_author`.

## Roadmap

### v1: MVP for note-taking tool

- Mirror as block editor:
  - Extenson在Mirror中嵌入文字块`·` `[[]]` `(())`，可收藏互联网内容或他人Mirror文字块
  - 写作时自动创建文字块，并可搜索引用(已创建或收藏的)文字块，`· I like this ((blockB))`
  - 中心化记录钱包/文章/文字块的链接引用关系，后台计数
- Bi-direction for the web: 
  - interactive text: 对任意网页/Mirror文章/文字块打上双向链接, `N linked references`，Extension将展示它在哪些地方被引用过(e.g., Mirror引用处的缩略图)，甚至反向跳转来追溯整个引用链条
- Verifiable ownership upon Ceramic:
  - sign-in with Ethereum: 通过钱包创建session key，并对文字块签名，以证明块创建人为特定钱包地址
  - stream and indexing: 文字块存储在Ceramic流数据网络，具有唯一blockID但可动态修改。blockIDs间的引用关系可索引

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! 

