pragma solidity ^0.4.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract VoteController {
	using SafeMath for uint256;

	GroupControl groupController;
	VoteToken voteToken;

	uint topicCount;
    // topic index by id
  	mapping(uint => Topic) internal topics;
  	  // Mapping from owner to list of owned topic IDs
  	mapping (address => uint256[]) internal ownedTopics;

  	// //get permissioned voters' addresses according to topic id 
  	// mapping(uint => address[]) internal topicVoters;

  	//check if a person have voted a certain topic
  	mapping(address => mapping(uint => bool)) internal isVote;

  	//check if a person have been paid in one voting
  	mapping(address => mapping(uint => bool)) internal isPaid;


  	modifier beforeExpiration(uint256 _id) {
  		require(block.timestamp <= topics[_id].expirationTime);
  		_;
  	}

  	modifier onlyMember(uint groupId) {
  		require(groupController.isMember(msg.sender, groupId) == true);
  		_;
  	}
  	


  	constructor (address voteTokenAddress, address groupControllerAddress) public {
        topicCount = 0;
        voteToken = VoteToken(voteTokenAddress);
        groupController = GroupControl(groupControllerAddress);
    }




 struct Topic {
  	uint256 id; //take index in allTokens as its id, auto increment

  	uint256 groupId; //topic permission groupId, 0 is default, means open to everyone

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

  	uint payUnit; //when voting expired, each winner can be paid in this amount
  }



  	//groupId 0 means open
    function addOpenTopic(uint stake, string memory description, uint8 rate, string memory options, uint expirationTime) public {
    	_addTopic(msg.sender, 0, stake, description, rate, options, expirationTime);
    }
    function addGroupTopic(uint groupId, uint stake, string memory description, uint8 rate, string memory options, uint expirationTime) onlyMember(groupId) public {
    	_addTopic(msg.sender, groupId, stake, description, rate, options, expirationTime);
    }

    function _addTopic(address owner, uint groupId, uint stake, string memory description, uint8 rate, string memory options, uint expirationTime, address[] memory voters) internal {
    	//init start with 1, so we can use id 0 as a special mark
    	topicCount++;
    	Topic memory item  = Topic({id: topicCount, groupId: groupId, owner: owner, stake: stake, description: description,
    	rate: rate, options: options, count1: 0, count2: 0, lastVoteTime:0, createTime: now, expirationTime: expirationTime}); 
    	topics[topicCount] = item;
    	// topicVoters[topicCount] = voters;
    	ownedTopics[owner].push(topicCount);
    	
    }
    // return the topic count
    function getTopicCount() public view returns (uint) {
    	return topicCount;
    }
    // get topic by id
    // can Vote means only return topic user can vote
    function getTopic(uint id, bool canVote) public view returns (
    address owner, //who create this topic, set default to the msg.sender
    uint groupId, //groupId of this topic, or permissionId
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
    	groupId = item.groupId;
    	//topic filter
    	if (groupId != 0 && canVote) {
    		if (!groupController.isMember(msg.sender, groupId)) {
    			return null;
    		}
    	}


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
    //user check vote result of an topic
    function payoff(uint topic_id) public {
    	//vote expired
    	require(block.timestamp > item.expirationTime);
    	//user voted
    	require(isVote[msg.sender][topic_id]);
    	//user not been paid
    	require(!isPaid[msg.sender][topic_id]);
    	isPaid[msg.sender][topic_id] = true;

    	Topic storage item = topics[topic_id];

    	//avoid divide 0 error
    	require(item.count1 != 0 && item.count2 != 0);

    	//possible initialization
    	if (item.unitPaid == 0) {
    		uint totalCount = item.count1 + item.count2;
    		if (item.count1 > item.count2) {
    			item.unitPaid = totalCount/item.count1;
    		} else if (item.count2 > item.count1) {
    			item.unitPaid = totalCount / item.count2;
    		} else {
    			item.unitPaid = stake;
    		}
    	}

    	voteToken.transferFrom(address(this), msg.sender, item.unitPaid);
    }

    //Return error code
    //1: insufficient money
    //2: no group permission
    //3: duplicate vote
    //4: outdated
    function permissionCheck(uint topic_id) public view returns (uint8) {
    	return _permissionCheck(msg.sender, topic_id);
    }
    function _permissionCheck(address user, uint topic_id) internal view returns(uint8) {
    	Topic storage item = topics[topic_id];
    	//insufficient money
    	if (voteToken.balanceOf(user) < item.stake) {
    		return 1;
    	}
    	//no permission
    	if (!isMember[user][topic_id]) {
    		return 2;
    	}
    	//duplicate vote
    	if (isVote[user][topic_id]) {
    		return 3;
    	} 
    	//outdated
    	if (block.timestamp > item.expirationTime) {
    		return 4;
    	}
    	return 0;
    	//

    }
 	function isUserVote(address user, uint topic_id) public view returns(bool) {
    	return isVote[user][topic_id];
    }
    function isUserPaid(address user, uint topic_id) public view returns(bool) {
    	return isPaid[user][topic_id];
    }

    function vote(uint topic_id, uint option_index) public {
    	require(permissionCheck(topic_id) == 0));

    	Topic storage item = topics[id];
    	voteToken.transferFrom(msg.sender, address(this), item.stake);
    	if (option_index == 1) {
    		item.count1 +=1;
    	} else if (option_index == 2) {
    		item.count2 += 1;
    	}
    }


}

contract GroupControl {
	mapping(uint => (address => bool)) isMember;

	struct Group {
		uint id;
		address owner;
		string description;
	}
	groupCount = 0;
	mapping(uint => Group) groups;
	mapping(address => uint[]) ownedGroups;

	 modifier onlyOwner(uint group_id) {
  		require(msg.sender  == groups[group_id].owner);
  		_;
 	 }

	function createGroup(string description) public {
		groupCount++;
		groups[groupCount] = Group({id: groupCount, owner: msg.sender, description: description});
		isMember[groupCount][msg.sender] = true;
		ownedGroups[msg.sender].push(groupCount);
	}
	function addMember(uint group_id, address newMember) onlyOwner public {
		isMember[group_id][newMember] = true;
	}
	function deleteMember(uint group_id, address member) onlyOwner public {
		isMember[group_id][newMember] = false;
	}
	function changeOwner(uint group_id, address newOwner) onlyOwner public {
		gourps[group_id].owner = newOwner;
	}
	function getOnwedGroups() public view returns (uint[] memory){
		return ownedGroups[msg.sender];
	}
	//Caution: Do not use msg.sender or tx.origin here due to possible vulnerability
	function isMember(address user, uint group_id) public view returns(bool) {
		return isMember[group_id][user];
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



