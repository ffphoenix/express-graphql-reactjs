import React from 'react'
class BaseGrid extends React.Component {

    state = {
        limit : 10,
        offset : 0,
        page: 1,
        order : 'id desc',
        sort : 'id',
        dir: 'desc',

        filters : {
            search : ''
        }
    }

    deleteQueryName = ``;

    constructor(props) {
        super(props);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleClickSortAction = this.handleClickSortAction.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.handleDeleteAction = this.handleDeleteAction.bind(this);
        this.handleEditAction = this.handleEditAction.bind(this);
    }

    handleChangePage(page) {
        this.setState({
            page : page,
            offset : this.state.limit * (page - 1)
        });
    }

    handleClickSortAction(col){
        if (this.state.sort === col) {
            const newDir = (this.state.dir === 'desc' ? 'asc' : 'desc');
            this.setState({
                dir: newDir,
                order : this.state.sort + ' ' + newDir
            });
        } else {
            this.setState({
                sort : col,
                dir: 'desc',
                order : col + ' ' + 'desc'
            });
        }
    }

    onFilter(e, filters) {
        this.setState({filters: filters});
        e.stopPropagation();
        e.preventDefault();
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let newState = this.state;
        newState[name] = value;
        this.setState(newState);
    }

    handleEditAction(id) {
        this.props.history.push(`/` + this.backURL + `/update/` + id);
    }

    handleDeleteAction(id) {
        this.props[this.deleteQueryName]({
            variables: {
                id: id
            },
            refetchQueries: [this.feedQueryName]
        })
        .then(response => {
            this.props.history.push(`/` + this.backURL);
        })
        .catch(response => {
            if (response.graphQLErrors !== undefined) {
                let newState = this.state;
                newState.errors = response.graphQLErrors[0].data;
                this.setState(newState);
            }
        })
    }
}

export default BaseGrid;
