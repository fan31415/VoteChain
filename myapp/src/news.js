import React from 'react';
import { Button, ButtonToolbar, Jumbotron, Container, ButtonGroup, Alert } from 'react-bootstrap';

class RealButtons extends React.Component {
  constructor(props) {
    super(props);
    this.bt0 = props.bt0 // button 0 name (is_real to false)
    this.bt1 = props.bt1 // button 1 name (is_real to true)
    this.state = { clicked: false, realed: false, sent: false };
    this.news_id = props.news_id;
    this.send_click = this.send_click.bind(this);
  }

  send_click(is_real) {
    let send_result = Math.random();
    let send_result_bool = false;
    if (send_result > 0.1) {
      send_result_bool = true;
    }
    // todo: call send_click()
    this.setState({ clicked: true, realed: is_real, sent: send_result_bool })
  }

  render() {
    console.log(this.state.clicked)
    if (!this.state.clicked) {
      return (
        <ButtonToolbar>
          <RealButton is_real={true} states={this.state} news_id={this.news_id} display={this.bt1} onClick={this.send_click} />
          <RealButton is_real={false} states={this.state} news_id={this.news_id} display={this.bt0} onClick={this.send_click} />
        </ButtonToolbar>
      )
    } else {
      if (!this.state.sent) {
        return (
          <Alert variant="danger">
            {"You send " + (this.state.realed ? this.bt1 : this.bt0) + " for news " + this.news_id + " failed."}
          </Alert>
        )
      } else {
        return (
          <Alert variant="primary">
            {"You vote " + (this.state.realed ? this.bt1 : this.bt0) + " for news " + this.news_id}
          </Alert>
        )
      }
    }
  }
}

class RealButton extends React.Component {
  constructor(props) {
    super(props);
    this.is_real = props.is_real; // 0 = false, 1 = true
    this.states = props.states;
    this.news_id = props.news_id;
    this.onClick = props.onClick;
    this.bt_display = props.display;
  }

  origin_button() {
    if (this.is_real) {
      return (
        <ButtonGroup className="mr-2" aria-label="Second group">
          <Button size='sm' onClick={() => this.onClick(this.is_real)}> {this.bt_display} </Button>
        </ButtonGroup>
      )
    } else {
      return (
        <ButtonGroup className="mr-2" aria-label="Second group">
          <Button size='sm' variant="danger" onClick={() => this.onClick(this.is_real)}> {this.bt_display} </Button>
        </ButtonGroup>
      )
    }
    // return e(
    //   'button',
    //   { onClick: () => this.onClick(this.is_real)},

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
    <b>topic:</b> {props.topic}
    <b>category:</b> {props.category}
  </div>)
}

function RenderNews(props) {
  return (
    <Jumbotron>
      <Container>
        <NewsTitle title={props.title} />
        <NewsAttribute topic={props.topic} category={props.category}> </NewsAttribute>
        <NewsContent content={props.content} />
        <RealButtons news_id={props.news_id} bt0={props.bt0} bt1={props.bt1} />
      </Container>
    </Jumbotron>
  );
}

export { RenderNews };
