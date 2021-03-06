import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AuthorizePage } from "./authorize"
import UserControl from "./controller"
import {RiseVotePage} from "./rise_vote"
import {AddGroup} from "./add_group"
import {AddMember} from "./add_member"
import {ContractManager} from "./contract"
import { NewsList } from './news_list';

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
  var installed = false;
  var logined = false;
  var addr = "1234";

  let ret = is_eth_address_exist()
  if (ret.state === 0) {
    installed = true;
    logined = true;
    addr = ret.acct;
  }
  if(ret.state === 20000){
    installed = true;
    logined = false;
    addr = -1;
  }
  var login_state = {
    installed: installed,
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

function pleaseLogin(){
  return <div>
  <h1> Please log in metamask extension on Chrome before using VoteChain! </h1>
</div>
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ui: 0};
    this.set_global_ui = this.set_global_ui.bind(this);
    this.chain_addr = ""
    this.contractManager = new ContractManager();
    this.login_state = login()
    // this.contractManager.getTopicCount();
  }

  async componentDidMount(){
    if(!this.login_state.installed || ! this.login_state.logined){
      return // if not login, return directly.
    }
    // load news
    this.chain_addr = this.login_state.addr
  }

  set_global_ui(ui_idx){
    this.setState({ui: ui_idx})
  }

  create_new_vote(){
    return (
      <div id="create_vote">
      <RiseVotePage chain_addr={this.chain_addr} set_global_ui={this.set_global_ui} cm={this.contractManager}></RiseVotePage>
      </div>
    )
  }
  create_new_group(){
    return (
      <div id="create_group">
      <AddGroup chain_addr={this.chain_addr} set_global_ui={this.set_global_ui} cm={this.contractManager}></AddGroup>
      </div>
    )
  }
  add_member(){
    return (
      <div id="add_member">
      <AddMember chain_addr={this.chain_addr} set_global_ui={this.set_global_ui} cm={this.contractManager}></AddMember>
      </div>
    )
  }

  render() {
    var login_state = this.login_state
    if (!login_state.installed) {
      return (
        <div>
          {installMetaMask()}
        </div>
      )
    }
    if (!login_state.logined) {
      return (
        <div>
          {pleaseLogin()}
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
          <UserControl addr={login_state.addr} set_global_ui={this.set_global_ui} cm={this.contractManager}></UserControl>
          <NewsList addr={login_state.addr} cm={this.contractManager}> </NewsList>
        </div>
      );
    } else if(this.state.ui === 1){
      return (
        <div>
          <UserControl addr={login_state.addr} set_global_ui={this.set_global_ui} cm={this.contractManager}></UserControl>
          {this.create_new_group()}
        </div>
      );
    } else if (this.state.ui === 2){
      return (
        <div>
          <UserControl addr={login_state.addr} set_global_ui={this.set_global_ui} cm={this.contractManager}></UserControl>
          {this.add_member()}
        </div>
      );
    } else if (this.state.ui === 3){
      return (
        <div>
          <UserControl addr={login_state.addr} set_global_ui={this.set_global_ui} cm={this.contractManager}></UserControl>
          {this.create_new_vote()}
        </div>
      );
    }
  }
}

export default App;
