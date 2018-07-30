import React from 'react';
import styled from 'styled-components';
import {
    Button,
    InputGroup,
} from 'reactstrap';

import {compose, withApollo} from "react-apollo/index";
import {UPDATE_MUTATION} from "../issueStatuses/Schema";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #fff;
  border: 1px solid #eee;
  transition: background-color 0.1s ease;
  background-color: ${({ isDragging }) =>
    isDragging ? 'lightgreen' : '#FFF'};
  &:hover {
    background-color: #eee;
  }
`;

const Title = styled.h4`
  padding: 10px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  background-color: ${({ isDragging }) =>
    isDragging ? 'lightgreen' : '#FFF'};
  &:focus {
    outline: 2px solid #FFF;
    outline-offset: 2px;
  }
`;

const CInput = styled.input`
    width : 60%;
    border : 1px solid #eee;
    background-color: lemonchiffon
`;


class ColumnHeader extends React.Component {
    state = {
        isEdit : false,
        status : null
    }

    constructor(props){
        super(props);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleChangeStatusTitle = this.handleChangeStatusTitle.bind(this);
        this.handleSaveStatusChange = this.handleSaveStatusChange.bind(this);
    }

    handleDoubleClick() {
        this.setState({isEdit : true})
    }

    handleChangeStatusTitle(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        let newState = this.state;
        newState.status.title = value;
        this.setState(newState);
    }

    handleSaveStatusChange() {
        this.props.client
            .mutate({
                mutation: UPDATE_MUTATION,
                variables: {
                    id : this.state.status.id,
                    input : {
                        title : this.state.status.title
                    }
                }
            })
            .then(() => {
                this.setState({
                    isEdit : false
                });
            });
    }

    componentDidMount(){
        this.setState({status : this.props.status})
    }

    render() {
        if (this.state.status === null) {
            return '';
        }

        let title = this.state.status.title;
        if (this.state.isEdit) {
            title = (<InputGroup>
                        <CInput value={this.state.status.title} onChange={this.handleChangeStatusTitle}/>
                        <Button className="btn-sm" type="button" color="secondary" onClick={this.handleSaveStatusChange}>
                            <i className="nav-icon icon-pencil"></i>
                        </Button>
                    </InputGroup>)
        }

        const {snap, prov} = this.props;
        return (
            <Header onDoubleClick={this.handleDoubleClick}
                    isDragging={snap.isDragging}
            >

                <Title isDragging={snap.isDragging}>
                    {title}
                </Title>
            </Header>
        );
    }
}

export default compose(
    withApollo
)(ColumnHeader);