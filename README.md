# Cipher Chat


### Install
```sh
# npm install
```
### Usage
##### Develop
```sh
# npm run dev
```
##### Build
```sh
# make publish
```


### Dependencies
1. Vue3 + Vite + vuex
2. Vuetify
3. prettier + eslint
4. Marked (Markdown parser)


### Explanatory notes

Cipher Chat is primarily a learning tool for it's two developers, (https://github.com/Neptuniam and https://github.com/carterbourette) in order to get exposure to WebSockets and Vue3.

It implements an interpretation of Caesar cipher (https://en.wikipedia.org/wiki/Caesar_cipher) in order to provide a safe and private chat system. Users must join specific rooms, with specific room keys in order to chat. All messages and authors are encrypted before being sent out and decrypted on the fly, all client side for full security. WebSockets allow us to provide real time updates on messages and actions performed by all parties.

A series of in-chat commands are available. Use /help to see the available commands.
