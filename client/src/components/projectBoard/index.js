import React, {Component} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {compose, withApollo} from "react-apollo/index";
import styled from 'styled-components';
import Column from "./Column";
import {FEED_QUERY, UPDATE_POSITION_MUTATION, SUBSCRIPTION_QUERY} from "./Schema";
import _ from "lodash";


const Container = styled.div`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

const boardTypes = ['new', 'inprogress', 'reopen', 'feedback', 'testready', 'closed']

class ProjectBoard extends Component {
    state = {
        items: null
    }

    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.reorderBySubscription = this.reorderBySubscription.bind(this);
    }

    reorderBySubscription(issue, nextId){
        let items = _.clone(this.state.items),
        source, destination;

        for (let i in items) {
            for (let y in items[i]) {
                console.log(items[i][y], issue);
                if (items[i][y].id === issue.id) {
                    source = {
                        droppableId : i,
                        index : y
                    }
                }
                if (items[i][y].id === nextId) {
                    destination = {
                        droppableId : i,
                        index : y
                    }
                }

            }
        }

        const [removed] = items[source.droppableId].splice(source.index, 1);
        items[destination.droppableId].splice(destination.index, 0, removed);

        this.setState({
            items: items
        });
    }

    onDragEnd({destination, source, draggableId, reason}) {
        // dropped outside the list
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }
        let items = _.clone(this.state.items);

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
        const subscriptionProcess = this.reorderBySubscription
        this.props.client
            .query({
                query: FEED_QUERY
            })
            .then(({data}) => {
                let preparedItems = {};
                for (let i in data.issuesBoard) {
                    preparedItems[i] = [].slice.call(data.issuesBoard[i]);
                }
                this.setState({items: preparedItems})
            });
        this.props.client.subscribe({
            query: SUBSCRIPTION_QUERY,
            variables: {  },
        }).subscribe({
            next({data : { issuePositionChanged : {issue , nextId} }}) {
                subscriptionProcess(issue, nextId);
                // ... call updateQuery to integrate the new comment
                // into the existing list of comments
            },
            error(err) { console.error('SUBSCRIPTION ERR => ', err); },
        });
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        if (this.state.items == undefined) {
            return '';
        }

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Container>
                    {boardTypes.map(droppableId => (
                        <Droppable key={droppableId} droppableId={droppableId}>
                            {(provided, snapshot) => Column(provided, snapshot, droppableId, this.state.items[droppableId])}
                        </Droppable>
                    ))}
                </Container>
            </DragDropContext>
        );
    }
}

export default compose(
    withApollo
)(ProjectBoard);