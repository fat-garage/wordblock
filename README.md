
<div align="center">
  
  # Word Block


  <p>一个为实现开放、可交互的块引用而建立的 web3笔记工具。每个人都可以发布自己拥有的笔记（或文章、网站），由带有钱包签名的文本单元（即文字块）组成。</p>
  
</div>

[English](https://github.com/fat-garage/word-block/blob/main/README-EN.md) / 中文  

## Introduction

使用这个Chrome扩展插件来体验由经过身份验证的数据支持的便携式、块状笔记。你可以在**写作**中进行文字块引用（例如在[Mirror.xyz](https://mirror.xyz)），你不仅可以引用/搜索你自己的文字块，还可以引用/搜索任何有钱包的人创建的文字块。写作**发布**后，你的文章就不再是一个纯文本，而是由可交互时文字块链接成的、具有可验证所有权的知识图谱。请看演示视频[这里](https://youtu.be/hsZIDzgiGOc).

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

#### Chained Signatures
Assuming `"any internet text"` is curated by `wallet_A` as `·block_A` (includes text, creator, referer, url, comments, tags and more), then `wallet_B` writes `·block_B` in which `·block_A` is referenced with new comments (this leads to another `·block_A_ref`) and publish the article. So `·block_A_ref` -> `·block_A` -> `any internet text` can be discovered with attached ownerships of `wallet_B`, `wallet_A`, `original_author`.

## Roadmap

### v1: note-taking tool

- Mirror as block editor:
  - Extenson在Mirror中嵌入文字块`·` `[[]]` `(())`，可收藏评论互联网内容或他人文字块
  - 写作时自动创建文字块，并可搜索引用其他文字块，`· I like this ((blockB))`
  - 搜索方式包括key words(适用于个人创建或收藏的块)、基于Address/ENS搜索他人块
- Bi-direction for the web: 
  - 中心化记录钱包/文章/文字块的链接引用关系，后台数据库计数
  - interactive text: 对任意网页/Mirror文章/文字块打上双向链接, `N linked references`，Extension将展示其在哪些地方被引用过(如Mirror引用处的缩略图)或围绕它的评论集
- Verifiable ownership upon IPFS/Ceramic:
  - sign-in with Ethereum: 通过钱包创建session key，并对文字块签名，以证明块创建人为特定钱包地址
  - stream and indexing: 文字块存储在流数据网络，具有唯一blockID但可动态修改。blockIDs间的引用关系可索引

### v2: web3 publication 

- theEdge:
  - develop a new block editor for web3 publishing, wordblock.com/blockID
  - provide SDKs for web2 to display interactive blocks, ownership recovery
- Co-edit: 
  - 集成dataverse协作型兴趣图谱协议
  - privacy: 私密文字块
- ENS: 
  - 基于subdomain连接blocks，比如[[Bennu.eth]]小行星主题杂志的子章节，被分配给Mars.Bennu.eth
  - 未来杂志社：每个人都可以做主编，通过分发subdomain token来邀请作者，持有者可参与编辑。Gas费 .crypto on polygon 
  
### v3: incentivized knowledge graphs

- Blockchain mapping:
  - ETH/Polygon上的创作引用合约, 将Ceramic链下的文字块间引用关系上链
  - 通过Chainlink Extenal Adapter统计文字块引用计数，相对去中心化
- Token:
  - 激励创作和引用关系则是wordblock需要单独考虑的问题。可能还需考虑 全局块搜索 加速知识检索 @dongshu
  - 发文时交笔创作费用，文章被引可得到收益，引用文章需要付费；创作成本需大于引用成本，抑制抄袭，鼓励引用
  - 买笔记本 实现内容传播和信息过滤 某时间周期内引用数涨幅大的 激励更多

## Contributing


贡献使开源社区成为一个学习、激励和创造的绝佳场所。我们非常感谢你的任何贡献。如果你有什么建议可以让它变得更好，请fork并提交pull request。你也可以简单地打开一个带有 "enhancement"标签的问题。不要忘了给这个项目Star! 



## Contact


邮箱：hi@fat-garage.com
