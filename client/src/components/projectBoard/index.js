import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { compose, withApollo } from "react-apollo/index";
import styled from 'styled-components';
import Column from "./Column";
import { FEED_QUERY } from "./Schema";

import _ from "lodash";
// a little function to help us with reordering the result


const Container = styled.div`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

const StyledList = styled.div`
    display: "flex",
    min-height: 100vh;
    flex-direction: "column"
`;
const boardTypes = ['new', 'inprogress', 'reopen', 'feedback', 'testready', 'closed']
class ProjectBoard extends Component {
    state = {
        items : null
    }

    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        let items = this.state.items;
        const [removed] = items[result.source.droppableId].splice(result.source.index, 1);
        items[result.destination.droppableId].splice(result.destination.index, 0, removed);
        console.log(removed);

        this.setState({
            items,
        });
    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
    }
    componentDidMount() {
        this.props.client
            .query({
                query: FEED_QUERY
            })
            .then(({data}) => {
                let preparedItems = {};
                for (let i in data.issuesBoard) {
                    preparedItems[i] = [].slice.call(data.issuesBoard[i]);
                }
                this.setState({ items : preparedItems})
            });
    }
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        console.log('render', this.state)
        if (this.state.items == undefined) {
            return '';
        }

        const vars = {'project_id' : 1};

        return (

            <DragDropContext onDragEnd={this.onDragEnd}>

                <Container>
                    {boardTypes.map( droppableId => (
                            <Droppable droppableId={droppableId}>
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
) (ProjectBoard);