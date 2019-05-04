var GroupController = artifacts.require("GroupController");
var VoteController = artifacts.require("VoteController");

module.exports = function(deployer) {

	deployer.deploy(GroupController).then(()=>{
		return deployer.deploy(VoteController, GroupController.address);
		});
}