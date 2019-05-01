var VoteToken = artifacts.require("VoteToken");

module.exports = function(deployer) {
	deployer.deploy(VoteToken);

}