require("dotenv").config({path: '../.env'})
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  compilers: {
    solc: {
      version: "0.8.0"
    }
  },
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*"
    },
    testnet: {
      provider: () => {
        return new HDWalletProvider({
          mnemonic: process.env.MNEMONIC,
          providerOrUrl: `https://data-seed-prebsc-1-s1.binance.org:8545`,
          addressIndex: 1
        })
      },
      network_id: '97',
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider({
          mnemonic: process.env.MNEMONIC,
          providerOrUrl: `https://bsc-dataseed.binance.org`,
          addressIndex: 1
        })
      },
      network_id: '56',
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  }
};
