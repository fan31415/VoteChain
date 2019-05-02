import React from 'react';


const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false, sent: false };
    this.news_id = props.news_id;
    this.send_like.bind(this);
  }

  send_like(){
    let send_result = Math.random();
    let send_result_bool = false;
    console.log(send_result);
    if(send_result > 0.5){
      send_result_bool = true;
    }
    this.setState({ liked: true, sent: send_result_bool })
  }

  render() {
    if (this.state.liked && this.state.sent) {
      return 'You liked this.';
    }
    if(this.state.liked && !this.state.sent) {
      return this.news_id + 'Sent failed.';
    }

    return e(
      'button',
      { onClick: () => this.send_like() },
      'Like'
    );
  }
}

function NewsTitle(props){
  return (<h2>{props.title}</h2>);
}

function NewsContent(props){
  return (<div>{props.content}</div>);
}

function RenderNews(props){
  return (
      <div>
        <NewsTitle title={props.title}/>
        <NewsContent content={props.content}/>
        <LikeButton news_id="123"/>
      </div>
  );
}

export {RenderNews};
