import Web3 from 'web3';
import {
  CRYPTO_KITTY_CONTRACT_ABI,
  CRYPTO_KITTY_CONTRACT_ADDR, INFURA_PROJECT_ID,
  KITTY_INU_CONTRACT_ABI,
  KITTY_INU_CONTRACT_ADDR
} from './constants';

const init = async () => {
  const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`));
  const kittyInuContract = new web3.eth.Contract(KITTY_INU_CONTRACT_ABI, KITTY_INU_CONTRACT_ADDR);
  const totalSupply = await kittyInuContract.methods.totalSupply().call();
  console.log(`KittyInu total supply: ${totalSupply}`);
  const contractBalance = web3.utils.fromWei(await web3.eth.getBalance(kittyInuContract.options.address));
  console.log(`KittyInu total balance: ${contractBalance} ETH`);

  const cryptoKittyContract = new web3.eth.Contract(CRYPTO_KITTY_CONTRACT_ABI, CRYPTO_KITTY_CONTRACT_ADDR);
  const kittyID = 123;
  const kitty = await cryptoKittyContract.methods.getKitty(kittyID).call();
  console.log(`Kitty ${kittyID}: ${JSON.stringify(kitty)}`);
};

const accountTestOperation = async () => {
  const web3 = new Web3('http://127.0.0.1:7545');
  const account = web3.eth.accounts.privateKeyToAccount('ccc7c720c58cc02214c94314f7d8b8a1d8b7307f841b5c8c3f60e6586637bfcd');
  console.log(`account: ${JSON.stringify(account)}`);
  const balance = web3.utils.fromWei(await (web3.eth.getBalance(account.address)));
  console.log(`balance: ${balance} ETH`);
  const res = await web3.eth.sendTransaction({
    from: account.address,
    to: '0xc987d316C4A14cB76006817097Df870b6ba75A24',
    value: web3.utils.toWei('1', 'ether')
  })
  console.log(`transaction response: ${JSON.stringify(res)}`);
  const balance2 = web3.utils.fromWei(await (web3.eth.getBalance(account.address)));
  console.log(`balance after: ${balance2} ETH`);
};

console.log('Start');
init();
// accountTestOperation();
