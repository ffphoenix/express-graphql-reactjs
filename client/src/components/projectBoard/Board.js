import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Column from "./Column";
import {FEED_QUERY} from "./Schema";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    // const result = Array.from(list);
    // const [removed] = result.splice(startIndex, 1);
    // result.splice(endIndex, 0, removed);

    return list;
};

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
const boardTypes = ['new', 'inprogress', 'reopen', 'feedback', 'testready', 'closed'];

class ProjectBoard extends Component {
    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount(){
        console.log('mount');
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        console.log(this.props);
        // const items = reorder(
        //     this.state.items,
        //     result.source.index,
        //     result.destination.index
        // );

        // this.setState({
        //     items,
        // });
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        const vars = {'project_id' : 1};
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Query
                    query={FEED_QUERY}
                    variables={ vars }
                    notifyOnNetworkStatusChange
                    errorPolicy="all"
                >
                    {({ loading, error, data, networkStatus }) => {
                        if (networkStatus === 4) return <tr><td>"Refetching!"</td></tr>;
                        if (loading) return <div>Loading</div>;
                        if (error) {
                            return (<pre>Error: {error.message}</pre>);
                        }
                        console.log(data);
                        return (
                            <Container>
                                {boardTypes.map( droppableId => (

                                    <Droppable droppableId={droppableId}>
                                        {(provided, snapshot) => Column(provided, snapshot, droppableId, data.issuesBoard[droppableId])}
                                    </Droppable>
                                ))


                                }
                            </Container>
                        );
                    }}
                </Query>

            </DragDropContext>
        );
    }
}

export default ProjectBoard;