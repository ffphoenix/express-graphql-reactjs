import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Issue from "./Issue"


const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 10,
    width: 250,
    display: "flex",
    flexDirection: "column",
    border: `1px solid #eee`
});

export default (provided, snapshot, columnName, items) => (
    <div
        ref={provided.innerRef}
        style={getListStyle(snapshot.isDraggingOver)}
    >
        <h1>{columnName}</h1>
        {Object.keys(items).map(index => (
            <Draggable key={items[index].id} draggableId={items[index].id} index={index}>
                {(provided, snapshot) => Issue(provided, snapshot, items[index])}
            </Draggable>
        ))}
        {provided.placeholder}
    </div>
)