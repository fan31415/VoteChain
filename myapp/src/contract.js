import gc from './GroupController.json'
import vc from './VoteController.json'

class ContractManager{
    constructor(){
        this.vc = getVoteContract()
        this.gc = getGroupContract()
        let provider = window.web3.currentProvider;
        this.vc.setProvider(provider)
        this.gc.setProvider(provider)
        this.myAcc = window.web3.eth.accounts[0];
        window.vc = vc
        window.gc = gc
    }

    // transaction of vc
    addOpenTopic(stake, description, rate, options, expire){
        this.vc.deployed().then(function(instance){
            return instance.addOpenTopic(stake, description, rate, options, expire);
        })
    }
    addGroupTopic(stake, description, rate, options, expire, groupId){
        this.vc.deployed().then(function(instance){
            return instance.addGroupTopic(groupId, stake, description, rate, options, expire);
        })
    }
    vote(topicId, optionIdx){
        this.vc.deployed().then(function(instance){
            return instance.vote(topicId, optionIdx);
        })
    }
    payoff(topicId){
        this.vc.deployed().then(function(instance){
            return instance.payoff(topicId);
        })
    }
    // call of vc
    async getTopicCount(){
        let instance = await this.vc.deployed()
        let result = await instance.getTopicCount.call()
        return result.toNumber()
    }

    async getTopic(id, canVote){
        let instance = await this.vc.deployed()
        let result = await instance.getTopic.call(id, canVote)
        let ret = {
            owner: result[0],
            stake: result[1].toNumber(),
            desc: result[2],
            rate: result[3].toNumber(),
            options: result[4],
            count1: result[5].toNumber(),
            count2: result[6].toNumber(),
            lastVoteTime: result[7].toNumber(),
            createTime: result[8].toNumber(),
            expirationTime: result[9].toNumber(),
            groupId: result[10].toNumber(),
        }
        return ret
    }

    getOwnedTopic(owner){
        var ret
        this.vc.deployed().then(function(instance){
            return instance.getOwnedTopic.call(owner);
        }).then(function(result){
            ret = result;
        })
        return ret;
    }
    
    async permissionCheck(topicId){
        let instance = await this.vc.deployed()
        let result = await instance.permissionCheck.call(topicId);
        return result.toNumber()
    }

    async isUserVote(topicId, user){
        let instance = await this.vc.deployed()
        let result = await instance.isUserVote.call(user, topicId)
        return result
    }

    async isUserPaid(topicId, user){
        let instance = await this.vc.deployed()
        let result = await instance.isUserPaid(topicId, user);
        return result
    }

    async getVotedOption(topicId){
        let instance = await this.vc.deployed()
        let result = await instance.getVotedOption(topicId)
        return result.toNumber()
    }

    async checkPayPermission(topicId){
        let instance = await this.vc.deployed()
        let result = await instance.checkPayPermission(topicId);
        return result.toNumber()
    }

    // transaction of group contract
    createGroup(description){
        this.gc.deployed().then(function(instance){
            return instance.createGroup(description);
        })
    }
    addMember(groupId, user){
        this.gc.deployed().then(function(instance){
            return instance.addMember(groupId, user);
        })
    }
    deleteMember(groupId, user){
        this.gc.deployed().then(function(instance){
            return instance.deleteMember(groupId, user);
        })
    }
    changeOwner(groupId, newOwner){
        this.gc.deployed().then(function(instance){
            return instance.changeOwner(groupId, newOwner);
        })
    }
    // call of group contract
    async checkMember(user, groupId){
        let instance = await this.gc.deployed()
        let checkMemberResult = await instance.checkMember.call(user, groupId)
        return checkMemberResult
    }
    async getOwnedGroups(){
        let instance = await this.gc.deployed()
        let ret = await instance.getOnwedGroups.call()
        let groups = []
        for(let i=0;i<ret.length;i++){
            groups.push(ret[i].toNumber())
        }
        return groups
    }

    getGroup(groupId){
        var ret
        this.gc.deployed().then(function(instance){
            return instance.getGroup.call(groupId);
        }).then(function(result){
            ret = {
                owner: result[0],
                description: result[1],
            };
        })
        return ret;
    }
    // account
    async balanceOf(owner){
        let instance = await this.vc.deployed()
        let ret = await instance.balanceOf.call(owner)
        return ret.toNumber()
    }

}

function getContract(json_obj){
    return window.TruffleContract(json_obj)
}

function getVoteContract(){
    // console.log({vc})
    // let vc_obj = JSON.parse({vc})
    return getContract(vc)
}

function getGroupContract(){
    // let gc_obj = JSON.parse({gc})
    return getContract(gc)
}

export {ContractManager};