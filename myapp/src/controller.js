import React from 'react';
import { Button, ButtonToolbar, ButtonGroup} from 'react-bootstrap';

class UserControl extends React.Component {
    constructor(props){
        super(props);
        this.buttons = this.buttons.bind(this)
        this.get_tokens = this.get_tokens.bind(this)
        this.apply_rewards = this.apply_rewards.bind(this)
        this.username = props.username;
        let now_tokens = this.get_tokens();
        this.state = {token: now_tokens}
        this.set_global_ui = props.set_global_ui; // todo: implement a global ui state
    }
    get_tokens(){
        // call get tokens()
        let tokens = 1.0
        return tokens;
    }
    apply_rewards(){
        // todo: call apply rewards
        // todo: tell user rewards will be added after a while
        this.setState({token: 2.0})
        console.log("apply_rewards")
    }
    buttons(){
        return(
            <ButtonToolbar>
            <ButtonGroup className="mr-2">
                <Button onClick={() => {this.set_global_ui(0)}}> Check News </Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2">
                <Button onClick={() => {this.set_global_ui(1)}}> Create Groups </Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2">
                <Button onClick={() => {this.set_global_ui(2)}}> Add Users to group </Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2">
                <Button onClick={() => {this.set_global_ui(3)}}> Create News </Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2">
                <Button onClick={this.apply_rewards}> Get rewards </Button>
            </ButtonGroup>
            </ButtonToolbar>
        )
    }
    render(){
        return (
            <div id="user_control">
                <div id="user_info">
                    <p>your address: {this.username} </p>
                    <p>your tokens: {this.state.token} </p>
                </div>
                {this.buttons()}
            </div>
        )
    }
}

export default UserControl;