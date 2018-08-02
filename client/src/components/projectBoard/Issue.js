import React, {Component} from "react";
import moment from "moment";
import IssueModal from "./IssueModal";
import {compose, withApollo} from "react-apollo/index";

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 20,
    margin: `0 0 10px 0`,
    borderRadius : 10,
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '#FFF',

    // styles we need to apply on draggables
    ...draggableStyle,
});

function getPriorityHTML(priority) {
    switch (priority) {
        case 'low':
            return (<span className="badge badge-light">Low</span>);
        case 'normal':
            return (<span className="badge badge-secondary">Normal</span>);
        case 'hight':
            return (<span className="badge badge-success">Hight</span>);
        case 'urgent':
            return (<span className="badge badge-warning">Urgent</span>);
        case 'immediate':
            return (<span className="badge badge-danger">Immediate</span>);

    }
}

class Issue extends Component {
    state = {
        showModal : false
    };

    constructor(props) {
        super(props);
        this.onDoubleClickHandler = this.onDoubleClickHandler.bind(this);
    }

    onDoubleClickHandler(){

        this.setState({showModal : true});
    }

    render() {
        console.log(this.state.showModal);
        const {provided, snapshot, item} = this.props;
        return (
            <span>
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}
                    onDoubleClick={this.onDoubleClickHandler}
                >
                    <p><code>{item.project.short_name}-{item.id}</code> {getPriorityHTML(item.priority)} | {moment(item.create_date).format('DD/MM/Y')} ({item.order})</p>
                    <p><code>></code>{item.title}</p>
                    <p dangerouslySetInnerHTML={{ __html: item.description }} ></p>


                </div>

                <IssueModal showModal={this.state.showModal} item={item}/>
            </span>
        );
    }
}


export default compose(
    withApollo
)(Issue);

