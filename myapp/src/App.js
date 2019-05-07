import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RenderNews } from './news';
import { AuthorizePage } from "./authorize"
import UserControl from "./controller"
import {RiseVotePage} from "./rise_vote"
import {AddGroup} from "./add_group"
import {AddMember} from "./add_member"
import {ContractManager} from "./contract"

function getNewsBlock(title, content, news_id, category, op1, op2) {
  return (<RenderNews title={title} content={content} news_id={news_id} category={category} bt0={op1} bt1={op2} key={news_id} />);
}

function getAllNews(news_list){

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
    this.state = {ui: 0, news_objects: [], n_news: 0};
    this.set_global_ui = this.set_global_ui.bind(this);
    this.chain_addr = ""
    this.contractManager = new ContractManager();
    this.login_state = login()
    // this.contractManager.getTopicCount();
  }

  async componentDidMount(){
    if(!this.login_state.logined){
      return // if not login, return directly.
    }
    // load news
    let news_info = await this.update_news(this.login_state.addr)
    this.setState({n_news: news_info.n_news, news_objects: news_info.news_list})
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

  list_news(){
    let news_jsx = []
    for(let i=this.state.n_news-1;i>=0;i--){
      let newsObj = this.state.news_objects[i]
      let newsDesc = newsObj.desc;
      let details = newsDesc.split(";")
      let title = details[0]
      let content = details[1]
      let category = details[2]
      let newsOpts = newsObj.options.split(";");
      let opt1 = newsOpts[0]
      let opt2 = newsOpts[1]
      let allowedGroup = newsObj.groupId;
      let newsBlock = getNewsBlock(title, content, i, category, opt1, opt2)
      news_jsx.push(newsBlock)
    }
    return(
      <div id="news">
      <h2> News List </h2>
      {news_jsx}
    </div>
    )
  }

  async update_news(user_addr){
    let n_news = await this.contractManager.getTopicCount()
    let news_list = []
    for(let i=n_news;i>=1;i--){
      let canView = await this.contractManager.permissionCheck(i)
      if(canView === 0){
        let news = await this.contractManager.getTopic(i, true)
        console.log(news)
        news_list.push(news)
      }
    }
    return {
      n_news: news_list.length,
      news_list: news_list,
    }
  }

  render() {
    var login_state = this.login_state
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
          <UserControl addr={login_state.addr} set_global_ui={this.set_global_ui} cm={this.contractManager}></UserControl>
          {this.list_news()}
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
