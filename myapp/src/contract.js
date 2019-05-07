import gc from './GroupController.json'
import vc from './VoteController.json'

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

function testVote(user1, user2, val){
    // let provider = new window.Web3.providers.HttpProvider("http://127.0.0.1:7545")
    let provider = new window.Web3.providers.HttpProvider("https://ropsten.infura.io/v3/5b04cf5a131d47e9855ab1ce366110dd")
    let vc = getVoteContract()
    let gc = getGroupContract()
    vc.setProvider(provider)
    gc.setProvider(provider)
    let web3 = new window.Web3(provider);
    console.log(web3.eth.blockNumber);
    let acc1 = web3.eth.accounts[0];
    console.log(acc1)
    vc.deployed().then(function(instance){
        var deployed = instance;
        return instance.transferFrom(acc1, '0xB1542b7e4C0D3bF6cC29369947f6Ea4654294759', 10000);
    }).then(function(result){
        console.log("transfer result:", result)
    })
}

export {testVote};