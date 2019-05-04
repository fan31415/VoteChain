import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RenderNews } from './news';
import { AuthorizePage } from "./authorize"
import UserControl from "./controller"
import {RiseVotePage} from "./rise_vote"
import {AddGroup} from "./add_group"
import {AddMember} from "./add_member"

function getNewsBlock(title, content, news_id) {
  let ret = []
  title = "This is the title of the news"
  content = "This is the details of the news"
  for (let i = 0; i < 10; i++) {
    ret.push(<RenderNews title={title} content={content} news_id={i} topic="topic1" category="c1" bt0="unreal" bt1="real" key={i} />);
  }
  return ret;
}

function check_auth(addr) {
  // invoke chain rpc to check
  return true
}

// get address/private key from web3/metamask
function login() {
  var is_eth_address_exist = function () {
    var web3Provider
    var web3 = window.web3
    var Web3 = window.Web3
    if (typeof web3 != 'undefined') {
      web3Provider = web3.currentProvider;
      console.log('metamask detected in eth address exist');
    } else {
      console.log('no metamask');
      return { state: 10000 };
    }

    web3 = new Web3(web3Provider);
    if (typeof web3.eth.accounts[0] != 'undefined') {
      console.log('metamask succ');
      const ret = {
        acct: web3.eth.accounts[0],
        state: 0
      }
      return ret;
      // $scope.isEthAddrExist = true; 
    } else {
      console.log("cannot detect metamask account.");
      return { state: 20000 };
    }
  }
  var logined = false;
  var addr = "1234";

  let ret = is_eth_address_exist()
  if (ret.state === 0) {
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ui: 0};
    this.set_global_ui = this.set_global_ui.bind(this);
    this.chain_addr = ""
  }
  set_global_ui(ui_idx){
    this.setState({ui: ui_idx})
  }
  create_new_vote(){
    return (
      <div id="create_vote">
      <RiseVotePage chain_addr={this.chain_addr} set_global_ui={this.set_global_ui}></RiseVotePage>
      </div>
    )
  }
  create_new_group(){
    return (
      <div id="create_group">
      <AddGroup chain_addr={this.chain_addr} set_global_ui={this.set_global_ui}></AddGroup>
      </div>
    )
  }
  add_member(){
    return (
      <div id="add_member">
      <AddMember chain_addr={this.chain_addr} set_global_ui={this.set_global_ui}></AddMember>
      </div>
    )
  }
  list_news(){
    return (
      <div id="news">
        <h2> News List </h2>
        {getNewsBlock("t1", "a1", "1")}
      </div>
    )
  }
  render() {
    var login_state = login()
    if (!login_state.logined) {
      return (
        <div>
          {installMetaMask()}
        </div>
      )
    }
    // check authorized
    let is_authed = check_auth()
    if (!is_authed) {
      return <AuthorizePage chainAcct={login_state.addr}></AuthorizePage>
    }
    this.chain_addr = login_state.addr
    // if not authorized, skip to sign up page
    if(this.state.ui === 0){
      return (
        <div>
          <UserControl username={login_state.addr} set_global_ui={this.set_global_ui}></UserControl>
          {this.list_news()}
        </div>
      );
    } else if(this.state.ui === 1){
      return (
        <div>
          <UserControl username={login_state.addr} set_global_ui={this.set_global_ui}></UserControl>
          {this.create_new_group()}
        </div>
      );
    } else if (this.state.ui === 2){
      return (
        <div>
          <UserControl username={login_state.addr} set_global_ui={this.set_global_ui}></UserControl>
          {this.add_member()}
        </div>
      );
    } else if (this.state.ui === 3){
      return (
        <div>
          <UserControl username={login_state.addr} set_global_ui={this.set_global_ui}></UserControl>
          {this.create_new_vote()}
        </div>
      );
    }
  }
}

export default App;
