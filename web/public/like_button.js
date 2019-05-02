// ... the starter code you pasted ...
'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

function NewsTitle(props){
  return (<h1>{props.title}</h1>);
}

function NewsContent(props){
  return (<div>{props.content}</div>);
}

function App(props){
  return (<NewsTitle title={props.title}/> + <NewsContent content={props.content}/> + <LikeButton/>)
}

// const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(<App title="tt" content="a" />, document.getElementById('root'));
