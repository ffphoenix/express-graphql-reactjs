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
import {EditorState} from "draft-js";

class Update extends BaseForm {

    state = {
        data : {
            title: '',
            short_name: '',
            description: EditorState.createEmpty(),
        },
        errors : {}
    };

    options = {
        title: {
            type: this.ELEMENT_TYPE_INPUT,
            label: 'Title',
            placeholder: 'Enter title...'
        },
        description: {
            type: this.ELEMENT_TYPE_TEXT,
            label: 'Description',
            placeholder: 'Enter Description...'
        },
        type: {
            type: this.ELEMENT_TYPE_SELECT,
            label: 'Type',
            placeholder: 'Select type...',
            options : {
                'bug' : 'Bug',
                'task' : 'Task',
                'feature' : 'Feature'
            }
        },
        status: {
            type: this.ELEMENT_TYPE_SELECT,
            label: 'Status',
            placeholder: 'Select status...',
            options : {
                'new' : 'New',
                'inprogress' : 'In Progress',
                'reopen' : 'Re-open',
                'feedback' : 'Feedback',
                'testready' : 'Ready for test',
            }
        },
        priority: {
            type: this.ELEMENT_TYPE_SELECT,
            label: 'Priority',
            placeholder: 'Select priority...',
            options : {
                'low' : 'Low',
                'normal' : 'Normal',
                'hight' : 'Hight',
                'urgent' : 'Urgent',
                'immediate' : 'Immediate',
            }
        },
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


        return (
            <Card>
                <CardHeader>
                    <strong>Issue</strong>
                    <small> update</small>
                </CardHeader>
                <CardBody>
                    {this.renderForm(this.options)}
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
