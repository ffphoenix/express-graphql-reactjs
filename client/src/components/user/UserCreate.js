import React, { Component } from 'react';
import {
    Badge,
    Button,
    ButtonDropdown,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormGroup,
    FormText,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Row,
} from 'reactstrap';

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './UserList'
import baseApollo from '../baseApollo'

class UserCreate extends baseApollo {
    state = {
        username: '',
        email: '',
        password: '',
    }

    constructor(props) {
        super(props);

        this.handleClick = this._create.bind(this);
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <strong>User</strong>
                    <small> create</small>
                </CardHeader>
                <CardBody>
                    <FormGroup>
                        <Label htmlFor="username">User name</Label>
                        <Input type="text" id="username" placeholder="Enter user name"
                               value={this.state.username} onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input type="text" id="email" placeholder="Enter user email"
                               value={this.state.email} onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" placeholder="Enter password"
                               value={this.state.password} onChange={this.handleChange}/>
                    </FormGroup>
                    <div className="form-actions">
                        <Button type="submit" color="primary" onClick={this.handleClick}>Save changes</Button>
                        <Button color="secondary">Cancel</Button>
                    </div>
                </CardBody>
            </Card>
        )
    }

    _create = async () => {
        const { username, email, password } = this.state
        await this.props.postMutation({
            variables: {
                input : {
                    username : username,
                    email : email,
                    password : password
                }
            },
            update: (store, { data: { post } }) => {

            },
        })
        this.props.history.push(`/new/1`)
    }
}

const POST_MUTATION = gql`
  mutation UserMutation($input: modifUserType!) {
    createUser(input: $input) {
      id
      username
      email
    }
  }
`

export default graphql(POST_MUTATION, { name: 'postMutation' })(UserCreate)