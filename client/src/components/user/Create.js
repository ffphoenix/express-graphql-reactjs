import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import { graphql, withApollo, compose } from 'react-apollo'
import { CREATE_MUTATION, FEED_QUERY_NAME, CREATE_QUERY_NAME, UPDATE_QUERY_NAME } from './Schema'
import BaseForm from '../grid/BaseForm'

class Create extends BaseForm {

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
        this.backURL = `users`;
        this.mode = this.CREATE_MODE;
        this.feedQueryName = FEED_QUERY_NAME;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateQueryName = UPDATE_QUERY_NAME;
    }

    render() {
        const options = {
            username: {
                type: this.ELEMENT_TYPE_INPUT,
                label: 'Username',
                placeholder: 'Enter username...'
            },
            email: {
                type: this.ELEMENT_TYPE_INPUT,
                label: 'Email',
                placeholder: 'Enter email...'
            },
            password: {
                type: this.ELEMENT_TYPE_PASSWORD,
                label: 'Pass',
                placeholder: 'Enter password...'
            },
        }

        return (
            <Card>
                <CardHeader>
                    <strong>User</strong>
                    <small> create</small>
                </CardHeader>
                <CardBody>
                    {this.renderForm(options)}
                </CardBody>
            </Card>
        )
    }


}

export default compose(
    graphql(CREATE_MUTATION, { name: CREATE_QUERY_NAME }),
    withApollo
)(Create)