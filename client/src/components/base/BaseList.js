import React from 'react'

export default class BaseList extends React.Component {

    constructor(props) {
        super(props);

    }

    checkData() {
        if (this.props.feedQuery.loading) {
            return (<div>Loading</div>)
        }

        if (this.props.feedQuery.error) {
            return (<div>An unexpected error occurred</div>)
        }
    }

}