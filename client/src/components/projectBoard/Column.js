import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Issue from "./Issue"
import styled from 'styled-components';


const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 10,
    width: 250,
    display: "flex",
    flexDirection: "column",
    border: `1px solid #eee`
});

const ColHeader = styled.div`
  background: #fff,
  display: "flex",
  
`;

export default (provided, snapshot, columnName, items) => (
    <div
        ref={provided.innerRef}
        style={getListStyle(snapshot.isDraggingOver)}
    >
        <ColHeader>{columnName}</ColHeader>
        {Object.keys(items).map(index => (
            <Draggable key={items[index].id} draggableId={items[index].id} index={index}>
                {(provided, snapshot) => Issue(provided, snapshot, items[index])}
            </Draggable>
        ))}
        {provided.placeholder}
    </div>
)