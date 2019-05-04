pragma solidity ^0.4.2;
contract GroupController {
	mapping(uint => mapping(address => bool)) isMember;

	struct Group {
		uint id;
		address owner;
		string description;
	}
	uint public groupCount;
	mapping(uint => Group) groups;
	mapping(address => uint[]) ownedGroups;

	 modifier onlyOwner(uint group_id) {
  		require(msg.sender  == groups[group_id].owner);
  		_;
 	 }

 	constructor () public {
    }

	function createGroup(string description) public {
		groupCount++;
		groups[groupCount] = Group({id: groupCount, owner: msg.sender, description: description});
		isMember[groupCount][msg.sender] = true;
		ownedGroups[msg.sender].push(groupCount);
	}
	function addMember(uint group_id, address member) onlyOwner(group_id) public {
		isMember[group_id][member] = true;
	}
	function deleteMember(uint group_id, address member) onlyOwner(group_id) public {
		isMember[group_id][member] = false;
	}
	function changeOwner(uint group_id, address newOwner) onlyOwner(group_id) public {
		groups[group_id].owner = newOwner;
	}
	function getOnwedGroups() public view returns (uint[] memory){
		return ownedGroups[msg.sender];
	}
	//Caution: Do not use msg.sender or tx.origin here due to possible vulnerability
	function checkMember(address user, uint group_id) public view returns(bool) {
		return isMember[group_id][user];
	}
	function getGroup(uint id) public view returns(
		address owner,
		string description
		) {
		Group storage item = groups[id];
		owner = item.owner;
		description = item.description;
	}

}