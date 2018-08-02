import React from 'react';
import Update from '../issue/Update';

class IssueModal extends Update {

    constructor(props) {
        super(props);
    }

    render() {
        const { item } = this.props;
        const match = {params : {id : item.id}};
        if (!this.props.showModal) {
            return '';
        } else {
            return (<Update showModal={this.props.showModal} match={match} />)
        }
    }

}

export default IssueModal;
