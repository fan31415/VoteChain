import React from 'react'
import { Button, Form } from 'react-bootstrap';

function getUnixSec(){
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    return timestamp
}

class RiseVotePage extends React.Component {
    constructor(props) {
        super(props);
        this.contractManager = props.cm
        this.chain_addr = props.chain_addr;
        this.state = {ownedGroups: []}
        this.set_global_ui = props.set_global_ui; // todo: implement a global ui state
    }

    async componentDidMount(){
        // load my owned groups
        let ownedGroups = await this.contractManager.getOwnedGroups()
        this.setState({ownedGroups: ownedGroups})
    }

    handleSubmit(event) {
        // send new vote info to the chain
        event.preventDefault();
        const target = event.target
        let stake = parseInt(target.elements.stake.value)
        let title = target.elements.title.value
        let category = target.elements.category.value
        let detail = target.elements.detail.value
        let rate = parseInt(target.elements.rate.value)
        let opt1 = target.elements.option_1.value
        let opt2 = target.elements.option_2.value
        let expireSec = parseInt(target.elements.expire.value) * 60
        
        // compute submit queries
        let description = title + ";" + detail + ";" + category
        let options = opt1 + ";" + opt2
        let expiration = expireSec + getUnixSec()
        let validGroup = 0
        for(var i=0;i<this.state.ownedGroups.length;i++){
            let check_name = "radio" + String(this.state.ownedGroups[i])
            let isChecked = target.elements[check_name].checked
            if(isChecked){
                validGroup = this.state.ownedGroups[i]
            }
        }
        if(validGroup === 0){
            this.contractManager.addOpenTopic(stake, description, rate, options, expiration)
        } else {
            this.contractManager.addGroupTopic(stake, description, rate, options, expiration, validGroup)
        }
        this.set_global_ui(0);
    }

    getForm() {
        return (
            <Form onSubmit={e => this.handleSubmit(e)}>
                <Form.Group controlId="Address-1">
                    <Form.Label>Your chain address:  </Form.Label>
                    <p> {this.chain_addr} </p>
                </Form.Group>
                <Form.Group controlId="stake">
                    <Form.Label> Stake: </Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="title">
                    <Form.Label> Title: </Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="category">
                    <Form.Label> Category: </Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="detail">
                    <Form.Label> Detail: </Form.Label>
                    <Form.Control as="textarea" rows="3" />
                </Form.Group>
                <Form.Group controlId="rate">
                    <Form.Label> Rate: </Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="option_1">
                    <Form.Label> Option_1: </Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="option_2">
                    <Form.Label> Option_2: </Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="expire">
                    <Form.Label> Expire Minute: </Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="groups-risevote">
                <Form.Label> Group Id Limit: </Form.Label>
                {(() => {
                    var checks = [
                        <Form.Check inline label='0 (means no limit)' type='radio' name="group" id={"radio" + String(0)} key={0} />
                    ]
                    for(var i=0;i<this.state.ownedGroups.length;i++){
                        console.log(this.state.ownedGroups[i])
                        checks.push(
                            <Form.Check inline label={this.state.ownedGroups[i]} type='radio' name="group" id={"radio" + String(this.state.ownedGroups[i])} key={this.state.ownedGroups[i]} />
                        )                    }
                    return checks
                })()}
                <Form.Text className="text-muted">
                    No check means no limit.
                </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    }
    render() {
        return (
            <div>
                <h2> Create a new vote </h2>
                {this.getForm()}
            </div>
        );
    }
}

export { RiseVotePage };
