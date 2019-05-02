import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RenderNews } from './news';

function getNewsBlock(title, content, news_id) {
  let ret = []
  title = "This is the title of the news"
  content = "This is the details of the news"
  for (let i = 0; i < 10; i++) {
    ret.push(<RenderNews title={title} content={content} news_id={i} key={i} />);
  }
  return ret;
}

function check_auth(addr){
  // invoke chain rpc to check
  return true
}

// get address/private key from web3/metamask
function login() {
  var is_eth_address_exist = function() {
    var web3Provider
    var web3 = window.web3
    var Web3 = window.Web3
    if (typeof web3 != 'undefined') {
        web3Provider = web3.currentProvider;
        console.log('metamask detected in eth address exist');
    } else {
        console.log('no metamask');
        return {state: 10000};
    }

    web3 = new Web3(web3Provider);
    if(typeof web3.eth.accounts[0] != 'undefined') {
        console.log('metamask succ');
        const ret = {
          acct: web3.eth.accounts[0],
          state: 0
        }
        return ret;
        // $scope.isEthAddrExist = true; 
    } else {
        console.log("cannot detect metamask account.");
        return {state: 20000};
    }
  }
  var logined = false;
  var addr = "1234";

  let ret = is_eth_address_exist()
  if(ret.state === 0){
    logined = true;
    addr = ret.acct;
  }
  var login_state = {
    logined: logined,
    addr: addr
  }
  return login_state
}

function installMetaMask() {
  return <div>
    <h1> Please install metamask extension on Chrome before using VoteChain! </h1>
  </div>
}

function App() {
  var login_state = login()
  if (!login_state.logined) {
    return (
      <div>
        {installMetaMask()}
      </div>
    )
  }
  // check authorized
  // if not authorized, skip to sign up page
  return (
    <div>
      <div>
        Your addr is {login_state.addr}.
    </div>
      <div id="test">
        <h2> News List </h2>
        {getNewsBlock("t1", "a1", "1")}
      </div>
    </div>
  );
}

export default App;
