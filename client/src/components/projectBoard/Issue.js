import React from "react";

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 20,
    margin: `0 0 10px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '#999',

    // styles we need to apply on draggables
    ...draggableStyle,
});


export default (provided, snapshot, item) => (
    <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
        )}
    >

        <p>{item.type} | {item.create_date}</p>
        <p>{item.project.short_name}-{item.id}</p>
        <p>{item.title}</p>
    </div>
);