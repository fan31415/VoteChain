import React from 'react';
import { Button, ButtonToolbar, Jumbotron, Container, ButtonGroup, Alert } from 'react-bootstrap';

class RealButtons extends React.Component {
  constructor(props) {
    super(props);
    this.contractManager = props.cm
    this.bt0 = props.bt0 // button 0 name
    this.bt1 = props.bt1 // button 1 name
    this.useraddr = props.addr
    this.expired = props.expired
    this.state = { loaded:false, clicked: false, selectedIdx: 0, sent: false, expired: this.expired, reward: 2}; // reward: 0=have reward, 1=reward paid, 2=no reward
    this.news_id = props.news_id;
    this.send_click = this.send_click.bind(this);
    this.get_reward = this.get_reward.bind(this);
  }

  async componentDidMount(){
    // check vote
    let isUserVote = await this.contractManager.isUserVote(this.news_id, this.useraddr)
    console.log("have_vote", isUserVote)
    if(isUserVote){
      let userChoiceIdx = await this.contractManager.getVotedOption(this.news_id)
      // check reward
      var reward
      let rewardStatus = await this.contractManager.checkPayPermission(this.news_id)
      if(rewardStatus === 0){
        reward = 0
      } else if(rewardStatus === 3){
        reward = 1
      } else {
        reward = 2
      }
      this.setState({loaded:true, clicked: true, selectedIdx: userChoiceIdx, sent: true, reward: reward})
    } else {
      this.setState({loaded:true, clicked: false})
    }
  }

  send_click(selectedIdx) {
    // todo: call send_click()
    console.log(this.news_id, selectedIdx)
    this.contractManager.vote(this.news_id, selectedIdx)
    this.setState({ clicked: true, selectedIdx: selectedIdx, sent: true })
  }

  get_reward(){
    if(this.state.reward === 0){
      this.contractManager.payoff(this.news_id)
    }
  }

  render() {
    console.log(this.state.clicked)
    if(this.state.expired){
      if(this.state.reward === 0){
        // can get reward
        return (
          <ButtonGroup className="mr-2" aria-label="Reward group">
          <Button size='sm' onClick={() => this.get_reward()}> {"Get Reward"} </Button>
          </ButtonGroup>
        )

      } else if(this.state.reward === 1){
        // have been paid for reward
        return(
          <Alert variant="primary">
          {"You have got reward for your vote."}
        </Alert>
        )
      } else {
        // no reward
        return (
          <Alert variant="danger">
          {"This topic is expired."}
        </Alert>
        )
      }
    }
    if(!this.state.loaded){
      return "loading..."
    }
    if (!this.state.clicked) {
      return (
        <ButtonToolbar>
          <RealButton selectedIdx={1} states={this.state} news_id={this.news_id} display={this.bt0} onClick={this.send_click} />
          <RealButton selectedIdx={2} states={this.state} news_id={this.news_id} display={this.bt1} onClick={this.send_click} />
        </ButtonToolbar>
      )
    } else {
      if (!this.state.sent) {
        return (
          <Alert variant="danger">
            {"You send " + (this.state.selectedIdx === 1 ? this.bt0 : this.bt1) + " for news " + this.news_id + " failed."}
          </Alert>
        )
      } else {
        return (
          <Alert variant="primary">
            {"You have voted " + (this.state.selectedIdx === 1 ? this.bt0 : this.bt1) + " for news " + this.news_id}
          </Alert>
        )
      }
    }
  }
}

class RealButton extends React.Component {
  constructor(props) {
    super(props);
    this.selectedIdx = props.selectedIdx; // 1 or 2
    this.states = props.states;
    this.news_id = props.news_id;
    this.onClick = props.onClick;
    this.bt_display = props.display;
  }

  origin_button() {
    if (this.selectedIdx === 1) {
      return (
        <ButtonGroup className="mr-2" aria-label="Second group">
          <Button size='sm' onClick={() => this.onClick(this.selectedIdx)}> {this.bt_display} </Button>
        </ButtonGroup>
      )
    } else {
      return (
        <ButtonGroup className="mr-2" aria-label="Second group">
          <Button size='sm' variant="danger" onClick={() => this.onClick(this.selectedIdx)}> {this.bt_display} </Button>
        </ButtonGroup>
      )
    }
    // return e(
    //   'button',
    //   { onClick: () => this.onClick(this.selectedIdx)},

    // );
  }

  render() {
    return this.origin_button();
  }
}

function NewsTitle(props) {
  return (<h2>{props.title}</h2>);
}

function NewsContent(props) {
  return (<p>{props.content}</p>);
}

function NewsAttribute(props) {
  return (<div>
    <b>category:</b> {props.category}
  </div>)
}

function RenderNews(props) {
  return (
    <Jumbotron>
      <Container>
        <NewsTitle title={props.title} />
        <NewsAttribute category={props.category}> </NewsAttribute>
        <NewsContent content={props.content} />
        <RealButtons news_id={props.news_id} bt0={props.bt0} bt1={props.bt1} cm={props.cm} addr={props.addr} expired={props.expired} />
      </Container>
    </Jumbotron>
  );
}

export { RenderNews };
