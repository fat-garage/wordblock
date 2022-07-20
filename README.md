
<div align="center">
  
  # Word Block


  <p>一个为实现开放、可交互的块引用而建立的 web3笔记工具。每个人都可以发布自己拥有的笔记（或文章、网站），由带有钱包签名的文本单元（即文字块）组成。</p>
  
</div>

[English](https://github.com/fat-garage/word-block/blob/main/README-EN.md) / 中文  

## Introduction

使用这个Chrome扩展插件来体验由经过身份验证的数据支持的便携式、块状笔记。你可以在**写作**中进行文字块引用（例如在[Mirror.xyz](https://mirror.xyz)），你不仅可以引用/搜索你自己的文字块，还可以引用/搜索任何有钱包的人创建的文字块。写作**发布**后，你的文章就不再是一个纯文本，而是由可交互时文字块链接成的、具有可验证所有权的知识图谱。请看演示视频[这里](https://github.com/fat-garage/wordblock).

## Get Started

```sh
$ git clone https://github.com/fat-garage/wordblock
$ Open chrome://extensions page
$ Enable "Developer mode"
$ Install extension via "Load unpacked"
```

## User Story


* 你可以把任何互联网上的文字或文章收藏成你签名下的字块，特别是当你在阅读时做笔记，或只是强调某些内容。每个文字块都会自动分配一个唯一的ID，并在IPFS上进行加密，并供公众访问。

* 当你在Mirror上写作和发布时，你正在用多个块组撰写你的文章，每个块都有自己的ID和知识。你可以通过写作来创建新的块`·`在你发布的文章，或者通过搜索来参考`（（块））``[[页]]`你或其他人创建的文字块。

* 文字块使你的文章成为可互动和协作的。每个人都可以轻松的跟踪块的引用并验证签名链。这就是WEB3。


Assuming `"any internet text"` is curated by `wallet_A` as `block_A` (including `text`, `creator`, `referer`, `url`, `comments`, `tags`...), then `wallet_B` writes `block_B` in which `block_A` is referenced with new comments (this leads to another `block_A_ref`) and publish `article_B`. When you see it,  `block_A_ref` -> `block_A` -> `any internet text` can be discovered with attached ownerships of `wallet_B`, `wallet_A`, `original_author`.

## Roadmap

### v1: MVP for note-taking tool

- Mirror 作为文字块编辑器:
  - Extenson在Mirror中嵌入文字块`·` `[[]]` `(())`，可收藏互联网内容或他人Mirror文字块
  - 写作时自动创建文字块，并可搜索引用(已创建或收藏的)文字块，`· I like this ((blockB))`
  - 中心化记录钱包/文章/文字块的链接引用关系，后台计数
- 为互联网打上双向链接:  
  - interactive text: 对任意网页/Mirror文章/文字块打上双向链接, `N linked references`，Extension将展示它在哪些地方被引用过(e.g., Mirror引用处的缩略图)，甚至反向跳转来追溯整个引用链条
- 借助ceramic实现可验证的文字块所有权:
  - sign-in with Ethereum: 通过钱包创建session key，并对文字块签名，以证明块创建人为特定钱包地址
  - stream and indexing: 文字块存储在Ceramic流数据网络，具有唯一blockID但可动态修改。blockIDs间的引用关系可索引

## Contributing


贡献使开源社区成为一个学习、激励和创造的绝佳场所。我们非常感谢你的任何贡献。如果你有什么建议可以让它变得更好，请fork并提交pull request。你也可以简单地打开一个带有 "enhancement"标签的问题。不要忘了给这个项目Star! 


