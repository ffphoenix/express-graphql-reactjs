import React from 'react';
import BaseForm from '../grid/BaseForm';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import {EditorState} from "draft-js";
import {compose, graphql, withApollo} from "react-apollo/index";
import {
    CREATE_QUERY_NAME,
    FEED_ONE_QUERY,
    FEED_QUERY_ONE_NAME,
    MODULE_URL,
    UPDATE_MUTATION,
    UPDATE_QUERY_NAME
} from "../issue/Schema";
import {FEED_QUERY as FEED_STATUSES_QUERY} from "../issueStatuses/Schema";
import {
    USERS_ONLINE_FEED,
    UPDATE_SET_USER_OFFLINE,
    CHANGE_ONLINE_SUBSCRIPTION,
} from "./Schema";

class IssueModal extends BaseForm {

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
        users : [],
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
        this.reciveDataForForm = this.reciveDataForForm.bind(this);
        this.changeOnline = this.changeOnline.bind(this);
        this.setOnlineUsers = this.setOnlineUsers.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    reciveDataForForm(props) {
        return props.feedOne[this.feedOneQueryName].object;
    }

    changeOnline(user) {
        let users = this.state.users;
        if (user.action !== null && user.action === 'add') {
            users.push(user);
        } else {
            for (let i in users) {
                if (users[i].id === user.id) {
                    users = users.splice(i, 1);
                    break;
                }
            }
        }

        this.setState({ users : users });
    }

    setOnlineUsers(users) {
        this.setState({ users : users });
    }

    componentDidMount() {
        const changeOnlineProcess = this.changeOnline;
        const setOnlineProcess = this.setOnlineUsers;
        this.props.client
            .query({
                query: FEED_STATUSES_QUERY,
                variables: {
                    order: 'order ASC'
                },
                fetchPolicy: 'network-only'
            })
            .then(({data}) => {
                let preparedItems = {};
                for (let i in data.issueStatuses.rows) {
                    preparedItems[data.issueStatuses.rows[i].id] = data.issueStatuses.rows[i].title;
                }
                let newState = this.state;
                newState.statuses = preparedItems;
                newState.showModal = true;
                this.setState(newState);
            });

        this.props.client
            .query({
                query: USERS_ONLINE_FEED,
                variables: {
                    id: this.props.match.params.id
                },
                fetchPolicy: 'network-only'
            })
            .then(({data : { issueUsersOnline }}) => {
                if (issueUsersOnline !== null && issueUsersOnline !== undefined) {
                    setOnlineProcess(Object.values(issueUsersOnline));
                }
            });

        this.props.client.subscribe({
            query: CHANGE_ONLINE_SUBSCRIPTION,
            variables: {  },
        }).subscribe({
            next({data : { changeOnlineUser }}) {
                changeOnlineProcess(changeOnlineUser);
            },
            error(err) { console.error('SUBSCRIPTION ERR => ', err); },
        });
    }

    renderUsersOnline(users) {
        if (users !== null && users.length > 0) {
            return <span>Users online:
                    {Object.keys(this.state.users).map(key => {
                        return <span key={key} className="badge badge-light">{this.state.users[key].username}</span>
                    })}
                </span>
        }
        return '';
    }

    onCloseModal() {
        this.props.client
            .mutate({
                mutation: UPDATE_SET_USER_OFFLINE,
                variables: {
                    id: this.props.match.params.id
                }
            });

        this.props.onCloseModal();
    }

    render() {
        console.log(this.state.users);
        const  { error, loading } = this.props.feedOne;

        if (loading || this.state.statuses === null ) return (<div>Loading...</div>);
        if (error) return (<div>`Error! ${error.message}`</div>);
        this.options.status.options = this.state.statuses;

        return (
            <div>
                <Modal isOpen={this.state.showModal} toggle={this.onCloseModal} size="lg" >
                    <ModalHeader toggle={this.onCloseModal}>Issue update</ModalHeader>
                    <ModalBody>
                        {this.renderUsersOnline(this.state.users)}
                        {this.renderForm(this.options)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleSendData}>Save</Button>{' '}
                        <Button color="secondary" onClick={this.onCloseModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

}

export default
compose(
    graphql(FEED_ONE_QUERY, {
        options: ({ match }) => ({
            variables: { id: match.params.id, collab: true },
            fetchPolicy: 'cache-and-network'
        }),
        name: 'feedOne'
    }),
    graphql(UPDATE_MUTATION, {
        name: UPDATE_QUERY_NAME
    }),
    withApollo
)(IssueModal);