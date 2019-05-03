pragma solidity ^0.4.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract VoteController {

	uint topicCount;
    // topic index by id
  	mapping(uint => Topic) internal topics;
  	  // Mapping from owner to list of owned topic IDs
  	mapping (address => uint256[]) internal ownedTopics;

  	//get permissioned voters' addresses according to topic id 
  	mapping(uint => address[]) internal topicVoters;


  	constructor () public {
        topicCount = 0;
    }


 struct Topic {
  	uint256 id; //take index in allTokens as its id, auto increment

  	address owner; //who create this topic, set default to the msg.sender

  	uint stake;//the stake for each joiner, unit in WEI

  	
  	string description; //description includes  title;detail;category; and so on
  	// string title;
  	// string detail;
  	// string category;
  	uint8 rate; //rate for children or adult and so on

  	//Vote
  	string options; //option name for the each choice, format: option1;option2
  	uint count1; //the count of voters of the first option, default 0
  	uint count2;


  	uint lastVoteTime;//the time for last one vote it
  	uint createTime;
  	uint expirationTime;
  }




    function addOpenTopic(uint stake, string memory description, uint8 rate, string memory options, uint expirationTime) public {
    	address[] memory everyone;
    	_addTopic(msg.sender, stake, description, rate, options, expirationTime, everyone);
    }

    function addInternalTopic(uint stake, string memory description, uint8 rate, string memory options, uint expirationTime, address[] memory voters) public {
    	_addTopic(msg.sender, stake, description, rate, options, expirationTime, voters);
    }

    function _addTopic(address owner, uint stake, string memory description, uint8 rate, string memory options, uint expirationTime, address[] memory voters) internal {
    	//init start with 1, so we can use id 0 as a special mark
    	topicCount++;
    	Topic memory item  = Topic({id: topicCount, owner: owner, stake: stake, description: description,
    	rate: rate, options: options, count1: 0, count2: 0, lastVoteTime:0, createTime: now, expirationTime: expirationTime}); 
    	topics[topicCount] = item;
    	topicVoters[topicCount] = voters;
    	ownedTopics[owner].push(topicCount);
    	
    }
    // return the topic count
    function getTopicCount() public view returns (uint) {
    	return topicCount;
    }
    // get topic by id
    function getTopic(uint id) public view returns (
    address owner, //who create this topic, set default to the msg.sender

  	uint stake,//the stake for each joiner, unit in WEI

  	//Description data
  	string memory description,
  	// string memory detail,
  	// string memory category, //the category of topic
  	uint8 rate, //rate for children or adult and so on

  	//Vote
  	string memory options,
  	uint count1, //the count of voters of the first option, default 0
  	uint count2,


  	uint lastVoteTime,//the time for last one vote it
  	uint createTime,
  	uint expirationTime
    	) {
    	Topic storage item = topics[id];
    	owner = item.owner;
    	stake = item.stake;
    	description = item.description;
    	// detail = item.detail;
    	// category = item.category;
    	rate = item.rate;
    	options = item.options;
    	count1 = item.count1;
    	count2 = item.count2;

    	lastVoteTime = item.lastVoteTime;
    	createTime = item.createTime;
    	expirationTime = item.expirationTime;


    	
    }
    function getOwnedTopic(address owner) public view returns(uint[] memory) {
    	uint[] storage list = ownedTopics[owner];
    	return list;
    }
    function vote(uint id, uint option_index) public {
    	Topic storage item = topics[id];
    	if (option_index == 1) {
    		item.count1 +=1;
    	} else if (option_index == 2) {
    		item.count2 += 1;
    	}
    }
}

contract VoteToken is ERC20, ERC20Detailed  {
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(DECIMALS));
    
   
  
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed("VoteToken", "VOT", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

}



