import React from 'react';
import { Button, ButtonToolbar, ButtonGroup} from 'react-bootstrap';

class UserControl extends React.Component {
    constructor(props){
        super(props);
        this.contractManager = props.cm
        this.buttons = this.buttons.bind(this)
        this.get_tokens = this.get_tokens.bind(this)
        this.apply_rewards = this.apply_rewards.bind(this)
        this.test_button = this.test_button.bind(this)
        this.addr = props.addr;
        this.state = {token: -1, loaded: false}
        this.get_tokens();
        this.set_global_ui = props.set_global_ui; // todo: implement a global ui state
    }

    get_tokens(){
        // call get tokens()
        (async () => {
            console.log(this)
            let tokens = await this.contractManager.balanceOf(this.addr)
            this.setState({token: tokens, loaded: true})
        })()
    }

    apply_rewards(){
        // decrepted!
        // todo: call apply rewards
        // todo: tell user rewards will be added after a while
        // this.setState({token: 2.0})
        console.log("apply_rewards")
        console.log(this.contractManager.addOpenTopic)
        window.cm = this.contractManager
        // this.contractManager.getTopic(1, false)
    }

    async test_button(){
        // let ret = await this.contractManager.getOwnedGroups()
        let ret = await this.contractManager.permissionCheck(5)
        console.log("owned group:", ret)
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
            {/* <ButtonGroup className="mr-2">
                <Button onClick={this.apply_rewards}> Reward Test </Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2">
                <Button onClick={this.test_button}> Test USE </Button>
            </ButtonGroup> */}
            </ButtonToolbar>
        )
    }
    render(){
        return (
            <div id="user_control">
                <div id="user_info">
                    <p>your address: {this.addr} </p>
                    <p>your tokens: {this.state.loaded? this.state.token: "loading..."} </p>
                </div>
                {this.buttons()}
            </div>
        )
    }
}

export default UserControl;