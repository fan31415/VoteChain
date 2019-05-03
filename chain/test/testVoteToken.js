var should = require('chai').should();
var moment = require('moment');
var token = artifacts.require("VoteToken");
var controller = artifacts.require('VoteController');
const address0 = '0x0000000000000000000000000000000000000000';

// function differ(instance, action_func_name, action_func_parameters, ...check_func_names) {
//     await instane[action_func_name];
//     for (i = 0; i < check_funcs.length; i++) {
//         print(check_funcs)
//     }
// } 

contract('VoteToken', async(accounts) => {
    var owner = accounts[0];
    var tester0 = accounts[1];
    var tester1 = accounts[2];

    const SUPPLY = 10000 * 10 ** 18
  

    let instance = null;

    let totalSupply;


    let defaultAccount = accounts[0];

    
    it('test totalSupply', async() => {
        instance = await token.deployed();
        totalSupply = await instance.totalSupply.call();
        totalSupply.toNumber().should.equal(SUPPLY, 'totalSupply works wrong');
    });
    it('test token transfer', async()=> {
        let old_from_balance = await instance.balanceOf.call(owner)
        let old_to_balance = await instance.balanceOf.call(tester0)
        amount = 10000
        await instance.transfer(tester0, amount);
        let new_from_balance = await instance.balanceOf.call(owner)
        let new_to_balance = await instance.balanceOf.call(tester0)
        new_to_balance.toNumber().should.equal(old_to_balance.add(amount).toNumber())
        new_from_balance.toNumber().should.equal(old_from_balance.sub(amount).toNumber())
    });
    


});

contract('VoteController', async(accounts) => {
    var owner = accounts[0];
    var tester0 = accounts[1];
    var tester1 = accounts[2];

    let instance = null;

    let time1 = moment().add(30, 'm').format('X');
    let time2 = moment().add(1, 'm').format('X');
    let time3 = moment().add(2, 'm').format('X');

    var topic1 = {
        stake: 100,
        description: 'Coffee or tea which do you prefer;Both coffe and tea is popullar drink all over the world. However , which one do you prefer to drinking in daily life?;Eating Habit',
        rate: 0, //general
        options: 'Coffe;Tea',
        expirationTime: time1
    }
    var topic2 = {
        stake: 100000,
        description: 'Hip-hop or Blues which do you like;This vote is just for fun!;Music Genre',
        rate: 1, //general
        options: 'Hip-hop;Blues',
        expirationTime: time2
    }
    var topic3 = {
        stake: 10000000,
        description: 'Do you like e-books;Someone said e-books is the future, do you agree?;lifestyle',
        rate: 1, //general
        options: 'Yes;No',
        expirationTime: time3
    }
    it('test add open topic', async()=>{
        instance = await controller.deployed();
        let _topic_cnt = await instance.getTopicCount();
        await instance.addOpenTopic(topic1.stake, topic1.description, topic1.rate, topic1.options, topic1.expirationTime);
        let topic_cnt = await instance.getTopicCount();
        //count correct
        topic_cnt.toNumber().should.equal(_topic_cnt.add(1).toNumber());
        //content correct
        let result = await instance.getTopic(topic_cnt);
        let topic = new Object();
        topic.owner = result[0];
        topic.stake = result[1].toNumber();
        let description = result[2].split(';');
        topic.title = description[0];
        topic.detail = description[1];
        topic.category = description[2];
        topic.rate = result[3].toNumber();
        let options = result[4].split(';');
        topic.option1 = options[0];
        topic.option2 = options[1];
        topic.count1 = result[5].toNumber();
        topic.count2 = result[6].toNumber();
        topic.lastVoteTime = moment(result[7].toNumber() * 1000).format("DD MMM YYYY hh:mm a");
        topic.createTime = moment(result[8].toNumber() * 1000).format("DD MMM YYYY hh:mm a");
        let expirationTime = result[9].toNumber()
        topic.expirationTime = moment(expirationTime * 1000).format("DD MMM YYYY hh:mm a");
        //validation content
        topic.stake.should.equal(topic1.stake);
        result[2].should.equal(topic1.description);
        topic.rate.should.equal(topic1.rate);
        result[4].should.equal(topic1.options);
        expirationTime.toString().should.equal(topic1.expirationTime);

        /**
         * validate owner list
        **/
        await instance.addOpenTopic(topic1.stake, topic1.description, topic1.rate, topic1.options, topic1.expirationTime, {from: tester0});
        await instance.addOpenTopic(topic3.stake, topic3.description, topic3.rate, topic1.options, topic3.expirationTime, {from: tester0});
        
        await instance.addOpenTopic(topic3.stake, topic3.description, topic3.rate, topic1.options, topic3.expirationTime);
        await instance.addOpenTopic(topic2.stake, topic2.description, topic2.rate, topic2.options, topic2.expirationTime);
        
        let lists1 = await instance.getOwnedTopic(owner);
        lists1.length.should.equal(3);
        lists1[0].toNumber().should.equal(1);
        lists1[1].toNumber().should.equal(4);
        lists1[2].toNumber().should.equal(5);

        let lists2 = await instance.getOwnedTopic(tester0);
        lists2.length.should.equal(2);
        lists2[0].toNumber().should.equal(2);
        lists2[1].toNumber().should.equal(3);

        //validate content
        let result2 = await instance.getTopic(lists1[2])
        result2[1].toNumber().should.equal(topic2.stake);

    })
});