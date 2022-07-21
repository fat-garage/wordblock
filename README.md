
<div align="center">
  
  # Word Block


  <p>一个为实现开放、可交互的块引用而建立的 web3笔记工具。每个人都可以发布自己拥有的笔记（或文章、网站），由带有钱包签名的文本单元（即文字块）组成。</p>
  
</div>

[English](https://github.com/fat-garage/word-block/blob/main/README-EN.md) / 中文  

## Introduction

使用这个Chrome扩展插件来体验由经过身份验证的数据支持的便携式、块状笔记。你可以在**写作**中进行文字块引用（例如在[Mirror.xyz](https://mirror.xyz)），你不仅可以引用/搜索你自己的文字块，还可以引用/搜索任何有钱包的人创建的文字块。写作**发布**后，你的文章就不再是一个纯文本，而是由可交互时文字块链接成的、具有可验证所有权的知识图谱。请看演示视频[这里]([https://youtu.be/hsZIDzgiGOc](https://www.bilibili.com/video/BV19d4y1S7Ph/?vd_source=e6ef26ed403566bef5659af4a18a74fb)).

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
  - Extension在Mirror中嵌入文字块 ，可收藏互联网内容或任意他人Mirror文字块
  - 写作时自动创建文字块，并可搜索引用(已创建或收藏的)文字块，`· I like this ((blockB))`
      - 收藏别人在mirror文章里的文字块，将直接记做引用
      - 如果是基于钱包交互的话，他不需要发布到mirror就可以 “+1”
  - 中心化记录钱包/文章/文字块的链接引用关系，后台计数
- 为互联网打上双向链接:  
  - interactive text: 对任意网页/Mirror文章/文字块打上双向链接, `N linked references`，Extension将展示它在哪些地方被引用过(e.g., Mirror引用处的缩略图)，甚至反向跳转来追溯整个引用链条
- 借助ceramic实现可验证的文字块所有权:
  - sign-in with Ethereum: 通过钱包创建session key，并对文字块签名，以证明块创建人为特定钱包地址
  - stream and indexing: 文字块存储在Ceramic流数据网络，具有唯一blockID但可动态修改。blockIDs间的引用关系可索引
  
### v2:  web3 publication 

- theEdge:
  - 开发新的编辑和发布工具，基于上述特点的知识参考协议。
  - Focus: theoretical correctness.
Web2修复计划，集成SDK，交互式文字
- Search:
  - 跨人搜索 提及数据库
  - Focus: theoretical correctness.
- ENS: 
  - 分配给相关领域研究论文/文章一些subdomain，然后通过page(domain)将他们链接起来。比如在mirror上收集写的文章（则domain是ENS.eth)，然后按照标题自动分配给（或他们自己领）这些 一个subdomain token，如果是 就被分配sub sub domain token.   ENS/Bit/unstopped domain, polygon和sub, gasless
  - 未来杂志社的感觉：一方面，每个人都可以做主编，去邀请作者，给他们分发subdomain。比如我想办一个与[[Bennu]]小行星相关的“杂志”或“书”（我的domain是bennu.eth），那我就去找与其相关的文章和作者，通过subdomain连接起来

### v3: on-chain knowledge graphs

- blockchain mapping:
  - ETH/Polygon上的创作引用合约，将文字块/文章上链，链上维护链接引用关系（链下也会有一份，计数可能不同）
  - Focus: pre-mainnet preparations.
- Collaboration:
  - Dataverse的私人文件夹/协作型兴趣图谱协议
  - Privacy  私人文章、私人文字块时
- Token:
  - 激励创作和引用关系则是wordblock需要单独考虑的后续问题 @dongshu
  - 发布文章时，需要交一笔创作费用；文章被引用，则可以得到收益，即引用文章需要付费；创作成本需大于引用成本，抑制抄袭，鼓励引用；
  - wordblock的文字块，block粒度更细，还有检索需求。
  - 知识图谱、引用策展人 承担信息过滤的工作量 来证明被引内容的价值
  - 买笔 买笔记本 才能创作引用 实现内容传播   某个时间周期内的信息集合    文本链   最长链原则  某时间周期内引用链增幅比较大的 激励更多

## Contributing


贡献使开源社区成为一个学习、激励和创造的绝佳场所。我们非常感谢你的任何贡献。如果你有什么建议可以让它变得更好，请fork并提交pull request。你也可以简单地打开一个带有 "enhancement"标签的问题。不要忘了给这个项目Star! 


