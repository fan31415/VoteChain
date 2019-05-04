import React from 'react'
import { Button, Form } from 'react-bootstrap';

class RiseVotePage extends React.Component {
    constructor(props) {
        super(props);
        this.chain_addr = props.chain_addr;
        this.set_global_ui = props.set_global_ui; // todo: implement a global ui state
    }

    handleSubmit(event) {
        // send new vote info to the chain
        event.preventDefault();
        console.log("submit:", event);
        this.set_global_ui(0);
    }

    getForm() {
        return (
            <Form onSubmit={e => this.handleSubmit(e)}>
                <Form.Group controlId="Address">
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
