import React from 'react'

class BaseList extends React.Component {

    state = {
        limit : 10,
        offset : 0,
        page: 1,
        orderBy : 'createdAt_DESC'
    }

    constructor(props) {
        super(props);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleEditAction = this.handleEditAction.bind(this);
    }

    handleChangePage(page) {

        this.setState({
            page : page,
            offset : this.state.limit * (page - 1)
        });
    }

    handleEditAction(){
        ;
    }

    render() {
        return;
    }

}

export default BaseList;
