var should = require('chai').should();
var moment = require('moment');
var controller = artifacts.require('VoteController');
var group = artifacts.require("GroupController");
const address0 = '0x0000000000000000000000000000000000000000';

// function differ(instance, action_func_name, action_func_parameters, ...check_func_names) {
//     await instane[action_func_name];
//     for (i = 0; i < check_funcs.length; i++) {
//         print(check_funcs)
//     }
// } 

function getTopicObj(result) {
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
    let expirationTime = result[9].toNumber();
    topic.expirationTime = moment(expirationTime * 1000).format("DD MMM YYYY hh:mm a");
    topic.groupId = result[10].toNumber();
    return topic;
}

//VoteToken key function test
contract('VoteToken', async (accounts) => {
    var owner = accounts[0];
    var tester0 = accounts[1];
    var tester1 = accounts[2];

    const SUPPLY = 10000 * 10 ** 18


    let instance = null;

    let totalSupply;


    let defaultAccount = accounts[0];


    it('test totalSupply', async () => {
        instance = await controller.deployed();
        totalSupply = await instance.totalSupply.call();
        totalSupply.toNumber().should.equal(SUPPLY, 'totalSupply works wrong');
    });
    it('test token transfer', async () => {
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


//Group controller functional test, coverage 100%
contract('GroupController', async (accounts) => {
    var owner = accounts[0];
    var tester0 = accounts[1];
    var tester1 = accounts[2];
    var tester2 = accounts[3];

    let instance = null;

    var group1 = {
        owner: owner,
        description: 'This group is for xxx company internal usage'
    }
    var group2 = {
        owner: owner,
        description: 'This group is for xxx school internal usage'
    }


    it('createGroup(), groupCount.call(), checkMember.call(), getGroup.call() ', async () => {
        instance = await group.deployed();
        await instance.createGroup(group1.description);
        //check count
        let groupCount = await instance.groupCount.call();
        groupCount.toNumber().should.equal(1);
        //check membership
        let isMem = await instance.checkMember.call(owner, groupCount.toNumber());
        isMem.should.equal(true);
        //check content
        let content = await instance.getGroup.call(groupCount.toNumber());
        content[0].should.equal(group1.owner);
        content[1].should.equal(group1.description)

        //create group again
        await instance.createGroup(group2.description);
        //check count
        groupCount = await instance.groupCount.call();
        groupCount.toNumber().should.equal(2);
        //check membership
        isMem = await instance.checkMember.call(owner, groupCount.toNumber());
        isMem.should.equal(true);
        //check content
        let groupDetail = await instance.getGroup.call(groupCount.toNumber());
        groupDetail[0].should.equal(group2.owner);
        groupDetail[1].should.equal(group2.description)
    })
    it('addMember(), getOwnedGroup.call()', async () => {
        let group_ids = await instance.getOnwedGroups()
        group_id1 = group_ids[1].toNumber();
        group_id1.should.equal(2);
        await instance.addMember(group_id1, tester0);
        //check membership
        isMem = await instance.checkMember.call(tester0, group_id1);
        isMem.should.equal(true);

        //add new member again

        await instance.addMember(group_id1, tester1);
        //check membership
        isMem = await instance.checkMember.call(tester1, group_id1);
        isMem.should.equal(true);
    })
    it('deleteMember()', async () => {
        let group_ids = await instance.getOnwedGroups()
        group_id1 = group_ids[1].toNumber();
        //check membership before
        isMem = await instance.checkMember.call(tester0, group_id1);
        isMem.should.equal(true);
        //delete member
        await instance.deleteMember(group_id1, tester0);
        //check membership after 
        isMem = await instance.checkMember.call(tester0, group_id1);
        isMem.should.equal(false);
    })
    it('changeOwner(), and onlyOwner() permission test', async () => {
        let group_ids = await instance.getOnwedGroups()
        group_id1 = group_ids[1].toNumber();
        try {
            await instance.addMember(group_id1, tester2, { from: tester1 });
        } catch (error) {
            console.log(error.message);
            should.exist(error, 'onlyOwner() permission error');
        }
        isMem = await instance.checkMember.call(tester2, group_id1);
        isMem.should.equal(false);
        //change owner to tester1
        await instance.changeOwner(group_id1, tester1);
        await instance.addMember(group_id1, tester2, { from: tester1 });
        isMem = await instance.checkMember.call(tester2, group_id1);
        isMem.should.equal(true);
    })
});

//Vote controller functional test

contract('VoteController', async (accounts) => {
    var owner = accounts[0];
    var tester0 = accounts[1];
    var tester1 = accounts[2];
    var tester2 = accounts[3];

    let instance = null;

    let time1 = moment().add(30, 'm').format('X');
    let time2 = moment().add(1, 'm').format('X');
    let time3 = moment().add(2, 'm').format('X');

    let shortExpir = moment().add(5, 's').format('X');

    var topic1 = {
        stake: 100,
        description: 'Coffee or tea which do you prefer;Both coffe and tea is popullar drink all over the world. However , which one do you prefer to drinking in daily life?;Eating Habit',
        rate: 0, //general
        options: 'Coffe;Tea',
        expirationTime: time1,
        groupId: 0
    }
    var topic2 = {
        stake: 100000,
        description: 'Hip-hop or Blues which do you like;This vote is just for fun!;Music Genre',
        rate: 1, //general
        options: 'Hip-hop;Blues',
        expirationTime: time2,
        groupId: 1
    }
    var topic3 = {
        stake: 10000,
        description: 'Do you like e-books;Someone said e-books is the future, do you agree?;lifestyle',
        rate: 1, //general
        options: 'Yes;No',
        expirationTime: time3,
        groupId: 1
    }
    it('test addOpenTopic(), getOwnedTopic(), getTopic(), getTopicCount()', async () => {
        groupInstance = await group.deployed();
        instance = await controller.deployed(groupInstance.address);
        let _topic_cnt = await instance.getTopicCount.call();
        await instance.addOpenTopic(topic1.stake, topic1.description, topic1.rate, topic1.options, topic1.expirationTime);
        let topic_cnt = await instance.getTopicCount.call();
        //count correct
        topic_cnt.toNumber().should.equal(_topic_cnt.add(1).toNumber());
        //content correct
        let result = await instance.getTopic.call(topic_cnt, false);
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
        let expirationTime = result[9].toNumber();
        topic.expirationTime = moment(expirationTime * 1000).format("DD MMM YYYY hh:mm a");
        topic.groupId = result[10].toNumber();
        //validation content
        topic.stake.should.equal(topic1.stake);
        result[2].should.equal(topic1.description);
        topic.rate.should.equal(topic1.rate);
        result[4].should.equal(topic1.options);
        expirationTime.toString().should.equal(topic1.expirationTime);
        topic.groupId.should.equal(0);

        /**
         * validate owner list
         **/
        await instance.addOpenTopic(topic1.stake, topic1.description, topic1.rate, topic1.options, topic1.expirationTime, { from: tester0 });
        await instance.addOpenTopic(topic3.stake, topic3.description, topic3.rate, topic1.options, topic3.expirationTime, { from: tester0 });

        await instance.addOpenTopic(topic3.stake, topic3.description, topic3.rate, topic1.options, topic3.expirationTime);
        await instance.addOpenTopic(topic2.stake, topic2.description, topic2.rate, topic2.options, topic2.expirationTime);

        let lists1 = await instance.getOwnedTopic.call(owner);
        lists1.length.should.equal(3);
        lists1[0].toNumber().should.equal(1);
        lists1[1].toNumber().should.equal(4);
        lists1[2].toNumber().should.equal(5);

        let lists2 = await instance.getOwnedTopic.call(tester0);
        lists2.length.should.equal(2);
        lists2[0].toNumber().should.equal(2);
        lists2[1].toNumber().should.equal(3);

        //validate content
        let result2 = await instance.getTopic.call(lists1[2], false)
        result2[1].toNumber().should.equal(topic2.stake);

    });
    it('test vote(), permissionCheck.call(), check duplicate voting error, insufficient token error', async () => {
        test_topic_id = 1;
        let return_code = await instance.permissionCheck.call(test_topic_id)
        return_code.toNumber().should.equal(0);


        //owner vote topic 0 with the first option
        await instance.vote(test_topic_id, 1)
        //check vote count
        let result = await instance.getTopic.call(test_topic_id, true);
        let topic = getTopicObj(result)
        topic.count1.should.equal(1, 'vote error');

        //no duplicate
        try {
            await instance.vote(test_topic_id, 1)
        } catch (error) {
            console.log(error.message);
            should.exist(error, 'can not duplicate vote');
        }
        //check vote count
        result = await instance.getTopic.call(test_topic_id, true);
        topic = getTopicObj(result)
        topic.count1.should.equal(1);

        //insufficient money
        let balance = await instance.balanceOf.call(tester2);
        balance.toNumber().should.equal(0);
        try {
            await instance.vote(test_topic_id, 1, { from: tester2 });
        } catch (error) {
            console.log(error.message);
            should.exist(error, 'in suffient money can not vote');
        }
        //check vote count
        result = await instance.getTopic.call(test_topic_id, true);
        topic = getTopicObj(result)
        topic.count1.should.equal(1);

        //transfer token to tester2
        await instance.transfer(tester2, 1000000000);
        //vote again
        await instance.vote(test_topic_id, 1, { from: tester2 });
        //check vote count
        result = await instance.getTopic.call(test_topic_id, true);
        topic = getTopicObj(result)
        topic.count1.should.equal(2);


        //check vote count before
        result = await instance.getTopic.call(test_topic_id, true);
        topic = getTopicObj(result)
        topic.count2.should.equal(0);
        //transfer token to tester1
        await instance.transfer(tester1, 1000000000);
        //vote again
        await instance.vote(test_topic_id, 2, { from: tester1 });
        //check vote count after
        result = await instance.getTopic.call(test_topic_id, true);
        topic = getTopicObj(result)
        topic.count2.should.equal(1);

    });
    it('addGroupTopic(), vote(), getTopic(topic_count, true) view range test, check group permission error', async () => {
        //create group and get group id
        await groupInstance.createGroup('kyc group');
        let groups = await groupInstance.getOnwedGroups.call();
        let test_group_id = groups[0];
        test_group_id.toNumber().should.equal(1)

        let _topic_count = await instance.getTopicCount.call();
        await instance.addGroupTopic(test_group_id, topic2.stake, topic2.description, topic2.rate, topic2.options, topic2.expirationTime);
        //check count
        let topic_count = await instance.getTopicCount.call();
        topic_count.toNumber().should.equal(_topic_count.add(1).toNumber());

        //check view range
        let result = await instance.getTopic.call(topic_count, true)
        topic = getTopicObj(result)
        topic.groupId.should.equal(test_group_id.toNumber());
        //check view range
        try {
            await instance.getTopic.call(topic_count, true, { from: tester0 })
        } catch (error) {
            console.log(error.message);
            should.exist(error, 'get topic view range invalidated')
        }


        //create new open topic
        let permissioned_topic_id = topic_count;


        await instance.addOpenTopic(topic3.stake, topic3.description, topic3.rate, topic3.options, topic3.expirationTime);
        let open_topic_id = await instance.getTopicCount.call();
        //check group vote permission
        //give tester0 enough money
        await instance.transfer(tester0, 1000000000);

        result = await instance.getTopic.call(open_topic_id, true)
        topic = getTopicObj(result)
        topic.groupId.should.equal(0);

        let return_code = await instance.permissionCheck.call(open_topic_id, { from: tester0 });
        return_code.toNumber().should.equal(0, 'can not vote for open topic')

        await instance.vote(open_topic_id, 2, { from: tester0 });
        result = await instance.getTopic.call(open_topic_id, true, { from: tester0 });
        topic = getTopicObj(result)
        topic.count2.should.equal(1);

        try {
            let return_code = await instance.permissionCheck.call(permissioned_topic_id, { from: tester0 });
            return_code.toNumber().should.equal(2, 'can not identify group permission error')
            await instance.vote(permissioned_topic_id, 2, { from: tester0 })
        } catch (error) {
            console.log(error.message);
            should.exist(error, 'vote permissioned topic error')
        }
        result = await instance.getTopic.call(permissioned_topic_id, false, { from: tester0 });
        topic = getTopicObj(result)
        //can not vote permissioned topic
        topic.count2.should.equal(0);

        //add tester0 to group1
        let isMem = await groupInstance.checkMember(tester0, test_group_id);
        isMem.should.equal(false, 'check member error');
        await groupInstance.addMember(test_group_id, tester0);
        isMem = await groupInstance.checkMember(tester0, test_group_id);
        isMem.should.equal(true, 'check member error');
        // console.log(topic)

        return_code = await instance.permissionCheck.call(permissioned_topic_id, { from: tester0 });
        return_code.toNumber().should.equal(0, 'can not vote for open topic')
        //check view range again
        result = await instance.getTopic.call(permissioned_topic_id, true, { from: tester0 })
        topic = getTopicObj(result)
        topic.groupId.should.equal(test_group_id.toNumber());
        //check group vote permission
        await instance.vote(permissioned_topic_id, 2, { from: tester0 })
        result = await instance.getTopic(permissioned_topic_id, true);
        topic = getTopicObj(result)
        //can not vote permissioned topic
        topic.count2.should.equal(1);

        //TODO: check deleteMember()
    })
    it('vote() check expiration error, payoff(), checkPayPermission()', async () => {
        await instance.addOpenTopic(topic3.stake, topic3.description, topic3.rate, topic3.options, shortExpir);
        let open_topic_id = await instance.getTopicCount.call();

        //give tester0 enough tokens
        await instance.transfer(tester0, 1000000000);
        await instance.transfer(tester1, 1000000000);
        await instance.transfer(tester2, 1000000000);
        await instance.transfer(accounts[5], 1000000000);
        await instance.transfer(accounts[6], 1000000000);

        await instance.vote(open_topic_id, 1, {from: owner});
        await instance.vote(open_topic_id, 1, { from: tester0 });
        await instance.vote(open_topic_id, 1, { from: tester1 });
        await instance.vote(open_topic_id, 2, { from: tester2 });
        await instance.vote(open_topic_id, 2, { from: accounts[5] });

        let err_code = await instance.checkPayPermission(open_topic_id);
        err_code.toNumber().should.equal(1, 'pay permissionCheck error');
        try {
            await instance.payoff(open_topic_id);
        } catch (error) {
            console.log(error.message);
            should.exist(error, 'payoff can not before vote expiring');

        }


        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        await timeout(5500);
        //can not vote outdated
        try {
            let return_code = await instance.permissionCheck.call(open_topic_id, { from: accounts[6] });
            return_code.toNumber().should.equal(4, 'can not identify outdated error')
            await instance.vote(open_topic_id, 2, { from: accounts[6] });
        } catch (error) {
            console.log(error.message);
            should.exist(error, 'expiration limit failed');

        }
        err_code = await instance.checkPayPermission(open_topic_id);
        err_code.toNumber().should.equal(0, 'payoff should have permission');
        let _balance = await instance.balanceOf.call(owner);
        await instance.payoff(open_topic_id, {from: owner});
        let balance = await instance.balanceOf.call(owner);
        let payUnit = await instance.getPayUnit.call(open_topic_id);

        balance.toNumber().should.equal(_balance.add(payUnit).toNumber());
        console.log(balance.toString())
        console.log(payUnit.toNumber())
        console.log(_balance.toString())

        //payoff next winner
        _balance = await instance.balanceOf(tester0);
        await instance.payoff(open_topic_id, {from: tester0});
        balance = await instance.balanceOf(tester0);
        payUnit = await instance.getPayUnit.call(open_topic_id);
        balance.toNumber().should.equal(_balance.add(payUnit).toNumber());
         //payoff next winner
        _balance = await instance.balanceOf(tester1);
        await instance.payoff(open_topic_id, {from: tester1});
        balance = await instance.balanceOf(tester1);
        balance.toNumber().should.equal(_balance.add(payUnit).toNumber());

        //payoff loser 
        _balance = await instance.balanceOf(tester2);
        await instance.payoff(open_topic_id, {from: tester2});
        balance = await instance.balanceOf(tester2);
        balance.toNumber().should.equal(_balance.toNumber());

        //payoff loser
        _balance = await instance.balanceOf(accounts[5]);
        await instance.payoff(open_topic_id, {from: accounts[5]});
        balance = await instance.balanceOf(accounts[5]);
        balance.toNumber().should.equal(_balance.toNumber());

        //payoff others
        
        _balance = await instance.balanceOf(accounts[6]);
        try {
            await instance.payoff(open_topic_id, {from: accounts[6]});
        } catch (error) {
            console.log(error.message);
            should.exist(error, 'non participants can not payoff');

        }
        balance = await instance.balanceOf(accounts[6]);
        balance.toNumber().should.equal(_balance.toNumber());

    })
    //TODO: test checkPermission() and payoff() divide 0 error
});