pragma solidity >=0.4.25 <=0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MyInuCoin.sol";

contract TestMetaCoin {

  function testInitialBalanceUsingDeployedContract() public {
    MyInuCoin meta = MyInuCoin(DeployedAddresses.MyInuCoin());

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  }

  function testInitialBalanceWithNewMetaCoin() public {
    MyInuCoin meta = new MyInuCoin();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  }

}
