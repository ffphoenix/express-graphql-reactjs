import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
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
import {FEED_QUERY as FEED_STATUSES_QUERY} from "../issueStatuses/Schema";

class Update extends BaseForm {

    state = {
        statuses : null,
        data : {
            title: '',
            description: EditorState.createEmpty(),
            project_id: 1,
            type: '',
            status: '',
            priority: ''
        },
        errors: {},
        showModal : false,
        showAsModal : false
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
        this.mode = this.UPDATE_MODE;
        this.feedOneQuery = FEED_ONE_QUERY;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateQueryName = UPDATE_QUERY_NAME;
        this.feedOneQueryName = FEED_QUERY_ONE_NAME;
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
                newState.showModal = true;
                console.log(newState);
                this.setState(newState);
            });
    }

    renderModal() {
        console.log('render modal', this.state.showModal)
        return ( <div>
            <Modal isOpen={this.state.showModal} toggle={this.props.onCloseModal} className="">
                <ModalHeader toggle={this.props.onCloseModal}>Issue update</ModalHeader>
                <ModalBody>
                    {this.renderForm(this.options)}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleSendData}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.props.onCloseModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
        );
    }

    render() {
        const  { error, loading } = this.props.feedOne;

        if (loading || this.state.statuses === null ) return (<div>Loading...</div>);
        if (error) return (<div>`Error! ${error.message}`</div>);
        this.options.status.options = this.state.statuses;
        if (this.props.showAsModal !== undefined && this.props.showAsModal === true) {
            return this.renderModal();
        } else {
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
