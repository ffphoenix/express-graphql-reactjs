import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Issue from "./Issue"
import styled from 'styled-components';
import ColumnHeader from "./ColumnHeader";
const grid = 10;
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 10,
    width: 250,
    display: "flex",
    flexDirection: "column",
    border: `1px solid #eee`,
    minHeight: `100vh`,
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  minHeight: 100vh;
`;

const divStyle = {
    minHeight: `100vh`,
    /* like display:flex but will allow bleeding over the window width */
    minWidth : `100vw`,
    display: `inline-flex`,
};


export default (provided, snapshot, data) => {
    const {statuses, items} = data;
    return (
        <div
            ref={provided.innerRef}
            style={divStyle}
        >
            {Object.keys(statuses).map(droppableId => {
                const dropKey = statuses[droppableId].id.toString();
                return (
                <Draggable draggableId={droppableId} key={droppableId} index={droppableId} >
                    {(prov, snap) => (
                        <Container innerRef={prov.innerRef} {...prov.draggableProps} >
                            <div {...prov.dragHandleProps}>
                            <ColumnHeader prov={prov} snap={snap} status={statuses[droppableId]}></ColumnHeader>
                            </div>
                            <Droppable key={dropKey} droppableId={dropKey}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        {items[dropKey] ? Object.keys(items[dropKey]).map(index => (
                                            <Draggable key={items[dropKey][index].id} draggableId={items[dropKey][index].id} index={index}>
                                                {(provided, snapshot) => Issue(provided, snapshot, items[dropKey][index])}
                                            </Draggable>
                                        )) : ''}
                                    </div>
                                )}
                            </Droppable>
                        </Container>
                    )}
                </Draggable>
            )
            })}
        </div>
    );
};
