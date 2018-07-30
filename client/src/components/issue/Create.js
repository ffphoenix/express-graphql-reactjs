import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import { graphql, withApollo, compose } from 'react-apollo'
import { CREATE_MUTATION, FEED_QUERY_NAME, CREATE_QUERY_NAME, UPDATE_QUERY_NAME, MODULE_URL } from './Schema'
import BaseForm from '../grid/BaseForm'
import { EditorState } from 'draft-js';
import {FEED_QUERY as FEED_STATUSES_QUERY} from "../issueStatuses/Schema";

class Create extends BaseForm {

    state = {
        statuses : null,
        data : {
            title: '',
            description: EditorState.createEmpty(),
            project_id : 1,
            type: null,
            status: null,
            priority: null,
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
            options : {}
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
        this.mode = this.CREATE_MODE;
        this.feedQueryName = FEED_QUERY_NAME;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateQueryName = UPDATE_QUERY_NAME;
    }

    componentDidMount() {
        this.props.client
            .query({
                query: FEED_STATUSES_QUERY,
                variables: {
                    order: 'order ASC'
                }
            })
            .then(({data}) => {
                let preparedItems = {};
                for (let i in data.issueStatuses.rows) {
                    preparedItems[data.issueStatuses.rows[i].id] = data.issueStatuses.rows[i].title;
                }
                let newState = this.state;
                newState.statuses = preparedItems;
                this.setState(newState);
            });
    }
    render() {
        if (this.state.statuses === null ) return (<div>Loading...</div>);
        this.options.status.options = this.state.statuses;

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