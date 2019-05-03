var VoteToken = artifacts.require("VoteToken");
var VoteController = artifacts.require("VoteController");

module.exports = function(deployer) {
	deployer.deploy(VoteToken);
	// deployer.link(VoteToken, VoteController);
	deployer.deploy(VoteController);

}