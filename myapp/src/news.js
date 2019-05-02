import React from 'react';

const e = React.createElement;

class RealButtons extends React.Component{
  constructor(props){
    super(props);
    this.state = { clicked:false, realed: false, sent: false };
    this.news_id = props.news_id;
    this.send_click = this.send_click.bind(this);
  }

  send_click(is_real){
    let send_result = Math.random();
    let send_result_bool = false;
    if(send_result > 0.5){
      send_result_bool = true;
    }
    this.setState({ clicked: true, realed: is_real, sent: send_result_bool })
  }

  render(){
    console.log(this.state.clicked)
    if(!this.state.clicked){
      return(
        <div>
          <RealButton is_real={true} states={this.state} news_id={this.news_id} onClick={this.send_click}/>
          <RealButton is_real={false} states={this.state} news_id={this.news_id} onClick={this.send_click}/>
        </div>
      )
    } else {
      if(!this.state.sent){
        return "send " + (this.state.realed ? 'real' : 'real') + " for news " + this.news_id + " failed."
      } else {
        return "You " + (this.state.realed ? 'real' : 'Unreal') + " for news " + this.news_id
      }
    }
  }
}

class RealButton extends React.Component {
  constructor(props) {
    super(props);
    this.is_real = props.is_real;
    this.states = props.states;
    this.news_id = props.news_id;
    this.onClick = props.onClick;
  }

  origin_button(){
    return e(
      'button',
      { onClick: () => this.onClick(this.is_real)},
      this.is_real? 'real': 'Unreal'
    );
  }

  render() {
    return this.origin_button();
  }
}

function NewsTitle(props){
  return (<h3>{props.title}</h3>);
}

function NewsContent(props){
  return (<div>{props.content}</div>);
}

function RenderNews(props){
  return (
      <div>
        <NewsTitle title={props.title}/>
        <NewsContent content={props.content}/>
        <RealButtons news_id={props.news_id}/>
      </div>
  );
}

export {RenderNews};
