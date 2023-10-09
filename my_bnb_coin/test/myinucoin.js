const Web3 = require('web3');
const MyInuCoin = artifacts.require("MyInuCoin");
const utils = require("./utils");
const {toNumberWithDecimals, fromNumberWithDecimals} = require("./utils");
const web3 = new Web3('http://127.0.0.1:7545');

contract('MyInuCoin', (accounts) => {
  let [alice, bob, rich] = accounts;
  let contractInstance;

  describe('Test token main properties', () => {
    beforeEach(async () => {
      contractInstance = await MyInuCoin.new(alice);
    });

    it('should assert the token has the correct name', async () => {
      const name = await contractInstance.name.call();
      assert.equal(name, 'MyInuCoin');
    });

    it('should assert the token has the correct symbol', async () => {
      const symbol = await contractInstance.symbol.call();
      assert.equal(symbol, 'MIC');
    });

    it('should assert the token has the correct totalsupply', async () => {
      const totalSupply = await contractInstance.totalSupply.call();
      assert.equal(fromNumberWithDecimals(totalSupply.toString()), '40000000000');
    });
  })

  describe('Test ERC20 base methods', () => {
    beforeEach(async () => {
      contractInstance = await MyInuCoin.new(alice);
    });

    it('should assert alice balance at the begin', async () => {
      const balanceOf = await contractInstance.balanceOf(alice);
      assert.equal(fromNumberWithDecimals(balanceOf.toString()), '40000000000');
    });

    it('should assert bob balance at the begin', async () => {
      const balanceOf = await contractInstance.balanceOf(bob);
      assert.equal(balanceOf.toNumber(), 0);
    });

    it('should transfer <100> tokens from alice to bob', async () => {
      await contractInstance.transfer(bob, toNumberWithDecimals('100'), {from: alice});
      const balanceOfAlice = await contractInstance.balanceOf(alice);
      assert.equal(fromNumberWithDecimals(balanceOfAlice.toString()), '39999999900');
      const balanceOfBob = await contractInstance.balanceOf(bob);
      assert.equal(fromNumberWithDecimals(balanceOfBob.toString()), '100');
    });

    it('should burn <20000> tokens of alice', async () => {
      await contractInstance.burn(toNumberWithDecimals('20000'), {from: alice});
      const balanceOfAlice = await contractInstance.balanceOf(alice);
      assert.equal(fromNumberWithDecimals(balanceOfAlice.toString()), '39999980000');
      const totalSupply = await contractInstance.totalSupply();
      assert.equal(fromNumberWithDecimals(totalSupply.toString()), '39999980000');
    });

    it('should mint <20000> tokens to alice', async () => {
      await contractInstance.mint(toNumberWithDecimals('20000'), {from: alice});
      const balanceOfAlice = await contractInstance.balanceOf(alice);
      assert.equal(fromNumberWithDecimals(balanceOfAlice.toString()), '40000020000');
      const totalSupply = await contractInstance.totalSupply();
      assert.equal(fromNumberWithDecimals(totalSupply.toString()), '40000020000');
    });

    it('should fail when bob try to mint <20000> tokens', async () => {
      await utils.shouldThrow(contractInstance.mint(toNumberWithDecimals('20000'), {from: bob}));
    });
  });

  describe('Test buy / sell', () => {
    beforeEach(async () => {
      contractInstance = await MyInuCoin.new('0x0000000000000000000000000000000000000000');
    });

    it('should buy <600> tokens for 0.3 ETH', async () => {
      const contractBalanceBefore = await web3.eth.getBalance(contractInstance.address);
      await contractInstance.buyTokens({value: web3.utils.toWei('0.3', 'ether'), from: bob});
      const contractBalanceAfter = await web3.eth.getBalance(contractInstance.address);
      const balanceOfBob = await contractInstance.balanceOf(bob);
      assert.equal(contractBalanceBefore, '0');
      assert.equal(web3.utils.fromWei(contractBalanceAfter), '0.3');
      assert.equal(fromNumberWithDecimals(balanceOfBob.toString()), '600');
    });

    it('should buy <600> tokens for 0.3 ETH and then sell <250> tokens', async () => {
      await contractInstance.buyTokens({value: web3.utils.toWei('0.3', 'ether'), from: bob});
      const contractBalanceAfterBuy = await web3.eth.getBalance(contractInstance.address);
      const balanceOfBobAfterBuy = await contractInstance.balanceOf(bob);
      assert.equal(web3.utils.fromWei(contractBalanceAfterBuy), '0.3');
      assert.equal(fromNumberWithDecimals(balanceOfBobAfterBuy.toString()), '600');
      await contractInstance.sellTokens(toNumberWithDecimals('250'), {from: bob});
      const contractBalanceAfterSell = await web3.eth.getBalance(contractInstance.address);
      const balanceOfBobAfterSell = await contractInstance.balanceOf(bob);
      assert.equal(web3.utils.fromWei(contractBalanceAfterSell, 'ether'), '0.175');
      assert.equal(fromNumberWithDecimals(balanceOfBobAfterSell.toString()), '350');
    });

    it('should buy <600> tokens for 0.3 ETH and then sell too many tokens', async () => {
      await contractInstance.buyTokens({value: web3.utils.toWei('0.3', 'ether'), from: bob});
      const contractBalanceAfterBuy = await web3.eth.getBalance(contractInstance.address);
      const balanceOfBobAfterBuy = await contractInstance.balanceOf(bob);
      assert.equal(web3.utils.fromWei(contractBalanceAfterBuy), '0.3');
      assert.equal(fromNumberWithDecimals(balanceOfBobAfterBuy.toString()), '600');
      const promise = contractInstance.sellTokens(toNumberWithDecimals('8000'), {from: bob});
      const err = await utils.shouldThrow(promise);
      assert.equal(err, 'Your balance is lower than the amount of tokens you want to sell');
    });
  });

  describe('Test withdraw', () => {
    beforeEach(async () => {
      contractInstance = await MyInuCoin.new('0x0000000000000000000000000000000000000000');
    });

    it('should withdraw ether to beneficiary if the owner try to withdraw balance from contract', async () => {
      const ETH_AMOUNT_TO_BUY = '5';
      const ETH_AMOUNT_TO_WITHDRAW = '2';
      await contractInstance.buyTokens({value: web3.utils.toWei(ETH_AMOUNT_TO_BUY, 'ether'), from: bob});
      const beneficiaryBalanceBefore = web3.utils.fromWei(await web3.eth.getBalance(rich));
      await contractInstance.withdrawEther(rich, web3.utils.toWei(ETH_AMOUNT_TO_WITHDRAW, 'ether'), {from: alice});
      const beneficiaryBalanceAfter = web3.utils.fromWei(await web3.eth.getBalance(rich));
      assert.equal(beneficiaryBalanceAfter, (parseFloat(beneficiaryBalanceBefore) + parseFloat(ETH_AMOUNT_TO_WITHDRAW)).toString());
    });

    it('should throw error if try to withdraw more ether than there are', async () => {
      const ETH_AMOUNT_TO_BUY = '5';
      const ETH_AMOUNT_TO_WITHDRAW = '8';
      await contractInstance.buyTokens({value: web3.utils.toWei(ETH_AMOUNT_TO_BUY, 'ether'), from: bob});
      const promise = contractInstance.withdrawEther(rich, web3.utils.toWei(ETH_AMOUNT_TO_WITHDRAW, 'ether'), {from: alice});
      const err = await utils.shouldThrow(promise);
      assert.equal(err, 'Contract has not enough ether on its balance');
    });

    it('should throw error if someone different from owner try to withdraw', async () => {
      const ETH_AMOUNT_TO_BUY = '5';
      const ETH_AMOUNT_TO_WITHDRAW = '2';
      await contractInstance.buyTokens({value: web3.utils.toWei(ETH_AMOUNT_TO_BUY, 'ether'), from: bob});
      const promise = contractInstance.withdrawEther(rich, web3.utils.toWei(ETH_AMOUNT_TO_WITHDRAW, 'ether'), {from: bob});
      const err = await utils.shouldThrow(promise);
      assert.equal(err, 'Ownable: caller is not the owner');
    });
  })

  describe('Test transferX', () => {
    beforeEach(async () => {
      contractInstance = await MyInuCoin.new('0x0000000000000000000000000000000000000000');
    });

    it('should transfer <50000> tokens to the owner', async () => {
      await contractInstance.transferX(toNumberWithDecimals('50000'), {from: alice});
      const ownerTokenBalance = await contractInstance.balanceOf(alice);
      assert.equal(fromNumberWithDecimals(ownerTokenBalance.toString()), '50000');
      const contractTokenBalance = await contractInstance.balanceOf(contractInstance.address);
      assert.equal(fromNumberWithDecimals(contractTokenBalance.toString()), (40000000000 - 50000).toString());
    });

    it('should throw error if try to transfer more tokens than there are', async () => {
      const promise = contractInstance.transferX(toNumberWithDecimals('40000000001'), {from: alice});
      const err = await utils.shouldThrow(promise);
      assert.equal(err, 'Contract has not enough tokens on its balance');
    });

    it('should throw error if someone different from owner try to call transferX', async () => {
      const promise = contractInstance.transferX(toNumberWithDecimals('50000'), {from: bob});
      const err = await utils.shouldThrow(promise);
      assert.equal(err, 'Ownable: caller is not the owner');
    });
  })

});
