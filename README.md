# Blockchain Playground
This project is a playground in which I tried to create a coin with the standard ERC20: MyInuCoin!

## Project structure
    .
    ├── contracts                   # Some contracts of other public coin [Kitty Inu, Shiba Inu]
    ├── metacoin                    # A simple example coin
    ├── my_bnb_coin                 # MyInuCoin [BNB network]
    ├── my_eth_coin                 # MyInuCoin [ETH network]
    ├── src                         # Playground for operations with Kitty Inu
    └── README.md

## Test Environment setup

Install dependencies:
`npm install`

To test our implementations we'll use Truffle and Ganache, both components of the **Truffle Suite**.

**Truffle** is a development framework for Etherium dapps, which provide a set of tools and libraries for smart contract development and deployment.
It uses the Solidity programming language.
You can read more on the [Truffle Docs](https://trufflesuite.com/docs/truffle/).

**Ganache** is a personal blockchain that serves as a local testing environment. It allows developers to simulate and test their dapps without interacting with the live Etherium network.

### Truffle setup

NodeJs v14-v18 are required.

Install truffle globally:
`npm install -g truffle`

Then check the installation is successfully done running:
`truffle version`

More info [here](https://trufflesuite.com/docs/truffle/how-to/install/).

### Ganache setup

Install Ganache from [here](https://trufflesuite.com/ganache/).

### Run automatic contract tests
- Run Ganache
```bash
npm run test:bnb
// OR
npm run test:eth
```

## Deployment

### Deploy to development network
- Run Ganache
```bash
npm run deploy:bnb:development
// OR
npm run deploy:eth:development
```
- Check on Ganache an address with lower number of ETH (cost of deploy)

### Deploy to test network
To deploy you need to provide a reference to your mnemonic to HDWalletProvider, so create a `.env` file in the root folder like this:
```bash
MNEMONIC="orange apple banana ... "
```

#### [ETH]
To deploy contract to Etherium network (Goerli testnet) you need to get also an Infura Api Key.<br>
So go to [infura.io](https://www.infura.io/), create a project, get the API KEY and put it into `.env` file:
```bash
INFURA_API_KEY="INFURA_API_KEY_PLACEHOLDER"
```
Then
```bash
npm run deploy:eth:testnet
```

#### [BNB]
```bash
npm run deploy:bnb:testnet
```

