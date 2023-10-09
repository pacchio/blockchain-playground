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
    goerli: {
      provider: () => {
        return new HDWalletProvider({
          mnemonic: process.env.MNEMONIC,
          providerOrUrl: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
          addressIndex: 1
        })
      },
      network_id: '5',
      gas: 4465030,
      gasPrice: 10000000000
    }
  }
};
