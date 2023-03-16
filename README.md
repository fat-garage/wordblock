# Wordblock-Test

1. text 1
2. text 2

A web3 note-taking tool built for open and interactive block reference. Everyone can publish user-owned notes (or articles, websites), composed by text cells with wallet signatures (i.e., word blocks).


## Introduction

Use this Chrome extension to experience portable, block-based note-taking backed by authenticated data. You could do block references in your writing (e.g. on [Mirror.xyz](https://mirror.xyz/conaw.eth/hBj9GSkYzLpQM524VBVhjO8C5-KQFw9UmfrYkerlvZE)), not only can you search and refer your own word blocks but also blocks created by anyone with a wallet. Once publish your writing, your publication is no longer a plain text, but interactive, block-chained knowledge graphs with verifiable ownership. See the demo video [here](https://www.youtube.com/watch?v=lp3NMGuktZc).

## Backend Repo
https://github.com/fat-garage/wordblock-backend

## Get Started
Prerequisites:
- Node version >= 16

```sh
$ git clone https://github.com/fat-garage/wordblock
$ yarn install
$ yarn build
$ Open chrome://extensions page
$ Install extension via "Load unpacked"
```

## User Story

* You curate any internet text or article into word blocks under your signature, specifically when you take notes or just highlight something while reading. Each block will be automatically assigned with a unique ID and secured on IPFS for public access.

* When you write and publish on Mirror, you are composing your article with multiple blocks, each has its own ID and knowledge. You can write to create new blocks `·` inside your publication, or search to refer `((block))` `[[page]]` existing blocks created by you or others. 

* Word blocks make your article become interactive and collaborative. Everyone can simply track block references and verify signature chains. That's WEB3.

## Features

### v1: MVP for note-taking tool

- 👀 Mirror as block editor:
  - When writing on mirror, you can 
    - open WB as a sidebar, find and embed the block you have curated on the web
    - by typing  or to search blocks directly while you write
    - see the reference record between your word block and the web
- 🔐 Bi-direction for the web: 
  - interactive text:  Add bi-directional link  to any web page/mirror article/word block, showed as on them. You can check where it has been referenced, or even trace the whole reference chain.
- 🔗 Verifiable ownership upon Ceramic:
  - sign-in with Ethereum
  - stream and indexing: Word block is stored in ceramic data stream. Every block is assigned with a blockID that manages various editing. The reference graph of the blockIDs can be indexed.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! 



