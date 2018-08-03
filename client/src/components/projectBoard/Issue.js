import React, {Component} from "react";
import moment from "moment";
import {compose, withApollo} from "react-apollo/index";
import IssueModal from "./IssueModal";

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
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    onDoubleClickHandler(){
        this.setState({showModal : true});
    }

    onCloseModal(){
        this.setState({showModal : false});
    }

    render() {
        const { provided, snapshot, item } = this.props;
        const match = {params : {id : item.id}};

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
                {this.state.showModal === true ? <IssueModal showAsModal={true} onCloseModal={this.onCloseModal}  showModal={this.state.showModal} match={match} /> : ''}
            </span>
        );
    }
}


export default compose(
    withApollo
)(Issue);

