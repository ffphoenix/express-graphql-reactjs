import React from 'react';
import {
    Card,
    CardBody,
    CardHeader
} from 'reactstrap';

import { graphql, compose, withApollo } from 'react-apollo'
import {
    UPDATE_MUTATION,
    FEED_ONE_QUERY,
    CREATE_QUERY_NAME,
    UPDATE_QUERY_NAME,
    FEED_QUERY_ONE_NAME, MODULE_URL
} from './Schema'
import BaseForm from '../grid/BaseForm'

class Update extends BaseForm {

    state = {
        data : {
            title: '',
            short_name: '',
            description: '',
        },
        errors : {}
    };

    constructor(props) {
        super(props);
        this.backURL = MODULE_URL;
        this.mode = this.UPDATE_MODE;
        this.feedOneQuery = FEED_ONE_QUERY;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateQueryName = UPDATE_QUERY_NAME;
        this.feedOneQueryName = FEED_QUERY_ONE_NAME;
    }

    render() {
        const  { error, loading } = this.props.feedOne;

        if (loading) return (<div>Loading...</div>);
        if (error) return (<div>`Error! ${error.message}`</div>);

        const options = {
            title: {
                type: this.ELEMENT_TYPE_INPUT,
                label: 'Title',
                placeholder: 'Enter title...'
            },
            short_name: {
                type: this.ELEMENT_TYPE_INPUT,
                label: 'Short name',
                placeholder: 'Enter Short name...'
            },
            description: {
                type: this.ELEMENT_TYPE_PASSWORD,
                label: 'Description',
                placeholder: 'Enter Description...'
            },
        }
        return (
            <Card>
                <CardHeader>
                    <strong>Project</strong>
                    <small> update</small>
                </CardHeader>
                <CardBody>
                    {this.renderForm(options)}
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
