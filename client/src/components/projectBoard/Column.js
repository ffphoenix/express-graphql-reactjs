import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 20,
    margin: `0 0 10px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
});

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
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )}
                    >
                        {items[index].title}
                    </div>
                )}
            </Draggable>
        ))}
        {provided.placeholder}
    </div>
)