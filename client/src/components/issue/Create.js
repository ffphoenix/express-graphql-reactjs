import React from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Input,
    Label,
} from 'reactstrap';
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { CREATE_MUTATION, FEED_QUERY, CREATE_QUERY_NAME, UPDATE_QUERY_NAME } from './UserSchema'
import BaseForm from '../grid/BaseForm'
import InputGroupError from "../InputGroupError";

class UserCreate extends BaseForm {

    state = {
        data : {
            username: '',
            email: '',
            password: '',
        },
        errors : {}
    }

    constructor(props) {
        super(props);

        this.mode = this.CREATE_MODE;
        this.feedQuery = FEED_QUERY;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateFeedQuery = UPDATE_QUERY_NAME;
    }

    render() {
        const  { data : formData, errors } = this.state;
        return (
            <Card>
                <CardHeader>
                    <strong>User</strong>
                    <small> create</small>
                </CardHeader>
                <CardBody>

                    <FormGroup>
                        <Label htmlFor="username">User name</Label>
                        <Input type="text" invalid={errors.username !== undefined} id="username" placeholder="Enter user name"
                               name="username"
                               value={formData.username} onChange={this.handleChange} />
                        <InputGroupError error={errors.username}/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input type="text" invalid={errors.email !== undefined} id="email" placeholder="Enter user email"
                               name="email"
                               value={formData.email} onChange={this.handleChange}/>
                        <InputGroupError error={errors.email}/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" invalid={errors.password !== undefined} id="password" placeholder="Enter password"
                               name="password"
                               value={formData.password} onChange={this.handleChange}/>
                        <InputGroupError error={errors.password}/>
                    </FormGroup>
                    <div className="form-actions custom-control-inline">
                        <div className="pr-1">
                            <Button className="" type="submit" color="primary" onClick={this.handleSendData}>Save changes</Button>
                        </div>
                        <div className="pr-1">
                            <Link className="btn btn-secondary" to={`/users`} >Cancel</Link>
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }


}
export default graphql(CREATE_MUTATION, { name: CREATE_QUERY_NAME })(UserCreate)