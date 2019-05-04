import React from 'react'
import { Button, Form } from 'react-bootstrap';

class AddMember extends React.Component {
    constructor(props) {
        super(props);
        this.chain_addr = props.chain_addr;
        this.set_global_ui = props.set_global_ui; // todo: implement a global ui state
    }

    handleSubmit(event) {
        // send new vote info to the chain
        event.preventDefault();
        console.log("submit:", event);
        console.log("please add more member again.")
    }

    getForm() {
        return (
            <Form onSubmit={e => this.handleSubmit(e)}>
                <Form.Group controlId="Address">
                    <Form.Label>Your chain address:  </Form.Label>
                    <p> {this.chain_addr} </p>
                </Form.Group>
                <Form.Group controlId="group_id">
                    <Form.Label> Group id: </Form.Label>
                    <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="members">
                    <Form.Label> Members to add: </Form.Label>
                    <Form.Control as="textarea" rows="3" />
                    <Form.Text className="text-muted">
                        Please input your members to be added here, one for each line.
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
