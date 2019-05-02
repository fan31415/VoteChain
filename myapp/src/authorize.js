import React from 'react'
import { Button, Form } from 'react-bootstrap';

class AuthorizePage extends React.Component {
    constructor(props) {
        super(props);
        this.chainAcct = props.chainAcct;
    }

    handleSubmit(event) {
        // send authorize info to the chain
        event.preventDefault();
        console.log("submit:", event)
    }
    getForm() {
        return (
            <Form onSubmit={e => this.handleSubmit(e)}>
                <Form.Group controlId="Address">
                    <Form.Label>Your chain address:  </Form.Label>
                    <p> {this.chainAcct} </p>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="formBasicChecbox">
                    <Form.Check type="checkbox" label="Check me out" />
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
                <h2> Before your vote, please supply your own information for verification: </h2>
                {this.getForm()}
            </div>
        );
    }
}

export { AuthorizePage };
