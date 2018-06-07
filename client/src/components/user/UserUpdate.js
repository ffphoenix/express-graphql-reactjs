import React from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Input,
    Label,
    Form
} from 'reactstrap';
import { Link } from 'react-router-dom'
import { graphql, Query } from 'react-apollo'
import { UPDATE_MUTATION, FEED_ONE_QUERY, FEED_QUERY, CREATE_QUERY_NAME, UPDATE_QUERY_NAME } from './UserSchema'
import BaseForm from '../base/BaseForm'
import InputGroupError from "../InputGroupError";

class UserUpdate extends BaseForm {

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
        console.log(this);
        this.mode = this.UPDATE_MODE;
        this.feedQuery = FEED_QUERY;
        this.feedOneQuery = FEED_ONE_QUERY;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateFeedQuery = UPDATE_QUERY_NAME;
    }

    render() {
        const  { data : formData, errors } = this.state;
        return (
            <Card>
                <CardHeader>
                    <strong>User</strong>
                    <small> update</small>
                </CardHeader>
                <CardBody>
                    <Query
                        query={FEED_ONE_QUERY}
                        variables={{id : 4}}
                        fetchPolicy="cache-and-network"
                    >
                        {({ loading, error, data, fetchMore }) => {

                            if (loading) return (<div>Loading...</div>);
                            if (error) return (<div>`Error! ${error.message}`</div>);

                            return (
                                <Form>
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
                                </Form>
                            );
                        }}
                    </Query>
                </CardBody>
            </Card>
        )
    }
}

export default graphql(UPDATE_MUTATION, { name: UPDATE_QUERY_NAME })(UserUpdate)