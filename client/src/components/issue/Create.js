import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import { graphql, withApollo, compose } from 'react-apollo'
import { CREATE_MUTATION, FEED_QUERY_NAME, CREATE_QUERY_NAME, UPDATE_QUERY_NAME, MODULE_URL } from './Schema'
import BaseForm from '../grid/BaseForm'

class Create extends BaseForm {

    state = {
        data : {
            title: '',
            description: '',
            type: '',
            status: '',
        },
        errors : {}
    }

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
    };

    constructor(props) {
        super(props);
        this.backURL = MODULE_URL;
        this.mode = this.CREATE_MODE;
        this.feedQueryName = FEED_QUERY_NAME;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateQueryName = UPDATE_QUERY_NAME;
    }

    render() {


        return (
            <Card>
                <CardHeader>
                    <strong>Issue</strong>
                    <small> create</small>
                </CardHeader>
                <CardBody>
                    {this.renderForm(this.options)}
                </CardBody>
            </Card>
        )
    }
}

export default compose(
    graphql(CREATE_MUTATION, { name: CREATE_QUERY_NAME }),
    withApollo
)(Create)