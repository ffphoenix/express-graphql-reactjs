import React from 'react';
import BaseForm from '../grid/BaseForm';
import _ from "lodash";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import {EditorState, convertToRaw, convertFromRaw} from "draft-js";
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
    CHANGE_ISSUE_SUBSCRIPTION,
    INIT_REVISION_MUTATION,
    ONCHANGE_MUTATION
} from "./Schema";
import * as j from 'jsondiffpatch';
import {stateFromHTML} from "draft-js-import-html";

export const colors = [
    '#c8ea09',
    '#f8b220',
    '#e1b337',
    '#d1c449',
    '#c5c559',
    '#bbd66b',
    '#b3e77c',
    '#b2e882',
    '#b2d99b',
    '#c8ea09'
]

class IssueModal extends BaseForm {

    state = {
        statuses : null,
        data : {
            title: '',
            description: EditorState.createEmpty(),
            // description_custom_style: {},
            project_id: 1,
            type: '',
            status: '',
            priority: ''
        },
        errors: {},
        users : [],
        cursors : [],
        showModal : false,
        showAsModal : false,
        revisions : [],
        revisionId : null
    };

    options = {
        title: {
            type: this.ELEMENT_TYPE_INPUT,
            label: 'Title',
            placeholder: 'Enter title...'
        },
        description: {
            type: this.ELEMENT_TYPE_TEXT_COLLAB,
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
        this.changeIssue = this.changeIssue.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.propsProcessing = this.propsProcessing.bind(this);
    }

    reciveDataForForm(props) {
        let data = _.clone(props.feedOne[this.feedOneQueryName].object);
        if (props.feedOne[this.feedOneQueryName].lastRevId !== 0) {
            console.log('reciveDataForForm---->', data, props.feedOne[this.feedOneQueryName].lastRevId);
            data.description = EditorState.createWithContent(convertFromRaw(JSON.parse(data.description)));
        }
        this.setState({ revisionId : props.feedOne[this.feedOneQueryName].lastRevId });
        return {propsData : data, revisionId : props.feedOne[this.feedOneQueryName].lastRevId};
    }

    propsProcessing({propsData, revisionId}){
        let newStateData = _.clone(this.state.data);
        for (let key in this.options) {
            if (propsData[key] !== undefined) {
                console.log('4$$$$$$$$$$$$$$$', revisionId);
                if ((this.options[key].type === this.ELEMENT_TYPE_TEXT ||
                    this.options[key].type === this.ELEMENT_TYPE_TEXT_COLLAB)
                    && revisionId === 0) {
                    newStateData[key] = EditorState.createWithContent(stateFromHTML(propsData[key]));
                } else {
                    newStateData[key] = propsData[key];
                }
            } else {
                console.log(`Not found props in [` + this.feedQueryName + `]`);
            }
        }
        console.log('edit init )))))',newStateData);
        this.setState({data: newStateData})
    }

    onFormDataDidChange(left, right) {

        console.log(right.description.getSelection());

        left.description = convertToRaw(left.description.getCurrentContent());
        right.description = convertToRaw(right.description.getCurrentContent());
        const delta = j.diff(left, right);

        if(delta !== undefined && delta !== null) {
            const revHash = '_' + Math.random().toString(36).substr(2, 9);
            let revisions = _.clone(this.state.revisions);
            revisions.push({hash : revHash, delta : delta});
            this.setState({revisions : revisions});
            this.props.client
                .mutate({
                    mutation: ONCHANGE_MUTATION,
                    variables: {
                        id: this.props.match.params.id,
                        input: delta,
                        hash: revHash
                    }
                }).then(resp => {
                    console.log('ssssss->>>>>>>>>', resp);
                });
        }
    }

    componentDidUpdate() {
        console.log('-------->', this.state.revisionId);
        let data = _.clone(this.state.data);
        data.description = convertToRaw(data.description.getCurrentContent());

        if (this.state.revisionId === 0) {
            console.log('INIT_REVISION_MUTATION', {
                id : this.props.match.params.id,
                input : this.state.data
            });
            this.props.client
                .mutate({
                    mutation: INIT_REVISION_MUTATION,
                    variables: {
                        id : this.props.match.params.id,
                        input : data
                    }
                }).then(()=> {
                this.state.revisionId = 1;
            });
        }
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

    changeIssue({id , delta, hash}) {
        let issueState = _.clone(this.state.data);

        let revisions = _.clone(this.state.revisions);
        for (let i in revisions) {
            if (revisions[i].hash === hash) {
                console.log('rev found', hash, revisions);
                revisions.splice(i, 1);
                return this.setState({
                    revisionId : id,
                    revisions : revisions
                });
            }
        }
        console.log('patch----->', issueState, delta)
        issueState.description = convertToRaw(issueState.description.getCurrentContent());
        issueState = j.patch(issueState, delta);
        issueState.description = EditorState.createWithContent(convertFromRaw(issueState.description));

        // this.setState({
        //     customStyleMap: {
        //         ...customStyleMap,
        //         [this.props.userId]: {
        //             backgroundColor: 'transparent'
        //         }
        //     },
        //     editorState: nextEditorState
        // }, () => {
        //     deferredUpdates(() => {
        //         let cursors = users
        //             .filter(user => user.selection && user.id !== this.props.userId)
        //             .map(({ selection, id }) => getCursorStyle(nextEditorState, selection))
        //             .filter(style => style)
        //         this.setState({
        //             cursors
        //         })
        //     })
        // })

        this.setState({ data : issueState, revisionId : id });
    }

    componentDidMount() {
        const changeOnlineProcess = this.changeOnline;
        const setOnlineProcess = this.setOnlineUsers;
        const changeIssueProcess = this.changeIssue;
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

        this.props.client.subscribe({
            query: CHANGE_ISSUE_SUBSCRIPTION,
            variables: {  },
        }).subscribe({
            next({data : { issueOnChange }}) {
                console.log('CHANGE_ISSUE_SUBSCRIPTION', issueOnChange);
                changeIssueProcess(issueOnChange);
            },
            error(err) { console.error('SUBSCRIPTION ERR => ', err); },
        });

    }

    renderUsersOnline(users) {
        if (users !== null && users.length > 0) {
            return <span>Users online : {' '}
                    {Object.keys(users).map(key => {
                        return <span key={key} className="badge badge-pill" style={{backgroundColor : colors[key], margin: '2px'}}>{users[key].username}</span>
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