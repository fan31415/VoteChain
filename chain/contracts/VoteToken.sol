pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract VoteToken is ERC20, ERC20Detailed  {
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(DECIMALS));
    // uint256 public constant INITIAL_SUPPLY = 100;

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed("VoteToken", "VOT", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

}


