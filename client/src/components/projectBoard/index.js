import React, {Component} from 'react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DraggableProvided

} from 'react-beautiful-dnd';
import {compose, withApollo} from "react-apollo/index";
import styled from 'styled-components';
import Column from "./Column";
import {FEED_QUERY, UPDATE_POSITION_MUTATION, SUBSCRIPTION_QUERY, EDIT_SUBSCRIPTION, CREATE_SUBSCRIPTION, EDIT_STATUS_SUBSCRIPTION} from "./Schema";
import {FEED_QUERY as FEED_STATUSES_QUERY} from "../issueStatuses/Schema";
import _ from "lodash";

const Container = styled.div`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #fff;
  transition: background-color 0.1s ease;
  &:hover {
    background-color: #eee;
  }
`;

const Title = styled.h4`
  padding: 10px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  &:focus {
    outline: 2px solid #FFF;
    outline-offset: 2px;
  }
`;

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 10,
    width: 250,
    display: "flex",
    flexDirection: "column",
    border: `1px solid #eee`
});


class ProjectBoard extends Component {
    state = {
        items: null,
        statuses: null
    }

    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.reorderBySubscription = this.reorderBySubscription.bind(this);
        this.updateBySubscription = this.updateBySubscription.bind(this);
        this.createBySubscription = this.createBySubscription.bind(this);
        this.updateStatusesBySubscription = this.updateStatusesBySubscription.bind(this);
    }

    updateStatusesBySubscription(status){
        let statuses = _.clone(this.state.statuses);

        for (let i in statuses) {
            if (statuses[i].id === status.id) {
                statuses[i].title = status.title;
                this.setState({statuses : statuses});
                break;
            }
        }
    }

    updateBySubscription(issue){
        let items = _.clone(this.state.items);

        for (let y in items[issue.status]) {
            if (items[issue.status][y].id === issue.id) {
                items[issue.status][y] = issue;
                break;
            }
        }

        this.setState({
            items: items
        });
    }

    createBySubscription(issue){
        let items = _.clone(this.state.items);
        items[issue.status].splice(0, 0, issue);

        this.setState({
            items: items
        });
    }

    reorderBySubscription(issue, nextId){
        let items = _.clone(this.state.items),
        source, destination;

        for (let i in items) {
            for (let y in items[i]) {
                if (items[i][y].id === issue.id) {
                    source = {
                        droppableId : i,
                        index : y
                    }
                }
                if (nextId && items[i][y].id === nextId) {
                    destination = {
                        droppableId : i,
                        index : y
                    }
                }

            }
        }

        if (!nextId) {
            destination = {
                droppableId : issue.status,
                index : 0
            }
        }

        const [removed] = items[source.droppableId].splice(source.index, 1);
        items[destination.droppableId].splice(destination.index, 0, removed);

        this.setState({
            items: items
        });
    }

    onDragEnd({destination, source, draggableId, reason}) {
        if (destination.droppableId === 'board') {
            console.log(destination, source);
            return;
        }

        // dropped outside the list
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }
        let items = _.clone(this.state.items);
        if (items[destination.droppableId] === undefined) {
            items[destination.droppableId] = [];
        }
        const [removed] = items[source.droppableId].splice(source.index, 1);
        items[destination.droppableId].splice(destination.index, 0, removed);

        const nextID = destination.index !== 0 ? items[destination.droppableId][destination.index - 1].id : null;

        this.props.client
            .mutate({
                mutation: UPDATE_POSITION_MUTATION,
                variables: {
                    id: removed.id,
                    status: destination.droppableId,
                    nextId: nextID
                }
            })
            .then(() => {
                // this.setState({
                //     items : items
                // });
            });
        this.setState({
            items: items
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
    }

    componentDidMount() {
        const reorderSubscriptionProcess = this.reorderBySubscription;
        const editSubscriptionProcess = this.updateBySubscription;
        const createSubscriptionProcess = this.createBySubscription;
        const updateStatusesBySubscription = this.updateStatusesBySubscription;
        this.props.client
            .query({
                query: FEED_QUERY
            })
            .then(({data}) => {
                let preparedItems = {};
                for (let i in data.issuesBoard) {
                    preparedItems[data.issuesBoard[i].status] = [].slice.call(data.issuesBoard[i].items);
                }
                this.setState({items: preparedItems})
            });
        this.props.client
            .query({
                query: FEED_STATUSES_QUERY,
                variables : {
                    order : 'order ASC'
                }
            })
            .then(({data}) => {
                let preparedItems = {};
                for (let i in data.issueStatuses.rows) {
                    preparedItems[data.issueStatuses.rows[i].id + data.issueStatuses.rows[i].title] = { id : data.issueStatuses.rows[i].id, title : data.issueStatuses.rows[i].title };
                }
                this.setState({statuses: preparedItems})
            });

        this.props.client.subscribe({
            query: SUBSCRIPTION_QUERY,
            variables: {  },
        }).subscribe({
            next({data : { issuePositionChanged : {issue , nextId} }}) {
                reorderSubscriptionProcess(issue, nextId);
            },
            error(err) { console.error('SUBSCRIPTION ERR => ', err); },
        });

        this.props.client.subscribe({
            query: EDIT_SUBSCRIPTION,
            variables: {  },
        }).subscribe({
            next({data : { issueEdited : issue }}) {
                editSubscriptionProcess(issue);
            },
            error(err) { console.error('SUBSCRIPTION ERR => ', err); },
        });

        this.props.client.subscribe({
            query: CREATE_SUBSCRIPTION,
            variables: {  },
        }).subscribe({
            next({data : { issueCreated : issue }}) {
                createSubscriptionProcess(issue);
            },
            error(err) { console.error('SUBSCRIPTION ERR => ', err); },
        });

        this.props.client.subscribe({
            query: EDIT_STATUS_SUBSCRIPTION,
            variables: {  },
        }).subscribe({
            next({data : { issueStatusEdited : status }}) {
                updateStatusesBySubscription(status);
            },
            error(err) { console.error('SUBSCRIPTION ERR => ', err); },
        });
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        if (this.state.items == undefined
            || this.state.statuses == undefined) {
            return '';
        }

        return (
            <div id="projectBoard">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Container>

                        <Droppable droppableId="board"
                                   type="COLUMN"
                                   direction="horizontal"
                                   ignoreContainerClipping={true}>
                            {(provided, snapshot) => Column(provided, snapshot, this.state)}
                        </Droppable>
                    </Container>

                </DragDropContext>
            </div>
        );
    }
}

export default compose(
    withApollo
)(ProjectBoard);