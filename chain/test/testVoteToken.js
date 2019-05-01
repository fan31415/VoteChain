var should = require('chai').should();
var moment = require('moment');
var token = artifacts.require("VoteToken");
const address0 = '0x0000000000000000000000000000000000000000';
// var BigNumber =  web3.utils.BN;
// const SUPPLY  = new BigNumber(10000 * 10 ** 18);
// console.log(SUPPLY.toString())
contract('VoteToken', async(accounts) => {
    const SUPPLY = 10000 * 10 ** 18
    var owner = accounts[0];
    var others = accounts[1];
    var tester1 = accounts[2];

    let instance = null;


    let tokenCount = 0;
    let ownerAddr;
    let totalSupply;


    let defaultAccount = accounts[0];
    let time1 = moment().add(30, 'm').format('X');
    
    it('test totalSupply', async() => {
        instance = await token.deployed();
        totalSupply = await instance.totalSupply.call();
        console.log(SUPPLY.toString())
        totalSupply.toNumber().should.equal(SUPPLY, 'totalSupply works wrong');
    });

});