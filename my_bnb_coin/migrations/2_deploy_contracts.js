const MyInuCoin = artifacts.require("MyInuCoin");

module.exports = function(deployer) {
  const myWalletAddress = '0xB6bd030B91332A0bf4061D4B5A03E30D707EbEaD';
  deployer.deploy(MyInuCoin, myWalletAddress);
};
