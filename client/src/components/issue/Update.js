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
import { graphql, compose, withApollo } from 'react-apollo'
import { UPDATE_MUTATION,
    FEED_ONE_QUERY,
    FEED_QUERY,
    CREATE_QUERY_NAME,
    UPDATE_QUERY_NAME,
    FEED_QUERY_ONE_NAME
} from './Schema'
import BaseForm from '../grid/BaseForm'
import InputGroupError from "../grid/formElements/InputGroupError";

class Update extends BaseForm {

    state = {
        data : {
            username: '',
            email: '',
            password: null,
        },
        errors : {}
    }

    constructor(props) {
        super(props);

        this.mode = this.UPDATE_MODE;
        this.feedQuery = FEED_QUERY;
        this.feedOneQuery = FEED_ONE_QUERY;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateQueryName = UPDATE_QUERY_NAME;
        this.feedOneQueryName = FEED_QUERY_ONE_NAME;
    }

    render() {
        const  { error, loading } = this.props.feedOne;
        const  { errors,  data : formData  } = this.state;

        if (loading) return (<div>Loading...</div>);
        if (error) return (<div>`Error! ${error.message}`</div>);

        return (
            <Card>
                <CardHeader>
                    <strong>User</strong>
                    <small> update</small>
                </CardHeader>
                <CardBody>
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
                </CardBody>
            </Card>
        )
    }
}

export default
    compose(
        graphql(FEED_ONE_QUERY, {
            options: ({ match }) => ({
                variables: { id: match.params.id },
                fetchPolicy: 'cache-and-network'
            }),
            name: 'feedOne'
        }),
        graphql(UPDATE_MUTATION, {
            name: UPDATE_QUERY_NAME
        }),
        withApollo
    )(Update);
