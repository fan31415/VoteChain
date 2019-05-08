import React from 'react'
import { Button, Form } from 'react-bootstrap';

class AddMember extends React.Component {
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
        let validGroup = 0
        for(var i=0;i<this.state.ownedGroups.length;i++){
            let check_name = "am_radio" + String(this.state.ownedGroups[i])
            let isChecked = target.elements[check_name].checked
            if(isChecked){
                validGroup = this.state.ownedGroups[i]
            }
        }
        let member = target.elements.member.value
        if(validGroup === 0){
            alert("Please click a group!")
            return
        }
        this.contractManager.addMember(validGroup, member)
    }

    getForm() {
        return (
            <Form onSubmit={e => this.handleSubmit(e)}>
                <Form.Group controlId="Address-member">
                    <Form.Label>Your chain address:  </Form.Label>
                    <p> {this.chain_addr} </p>
                </Form.Group>
                <Form.Group controlId="groups-addmember">
                <Form.Label> Group Id: </Form.Label>
                {(() => {
                    var checks = [
                    ]
                    for(var i=0;i<this.state.ownedGroups.length;i++){
                        console.log(this.state.ownedGroups[i])
                        checks.push(
                            <Form.Check inline label={this.state.ownedGroups[i]} type='radio' name="group" id={"am_radio" + String(this.state.ownedGroups[i])} key={this.state.ownedGroups[i]} />
                        )                    }
                    return checks
                })()}
                <Form.Text className="text-muted">
                    Choose a group to add a member.
                </Form.Text>
                </Form.Group>
                <Form.Group controlId="member">
                    <Form.Label> Members to add: </Form.Label>
                    <Form.Control as="textarea" rows="3"/>
                    <Form.Text className="text-muted">
                        Please input the member to be added here.
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
                <h2> Add more members to a group </h2>
                {this.getForm()}
            </div>
        );
    }
}

export { AddMember };
