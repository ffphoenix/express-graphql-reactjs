import React from 'react'

export default class baseApollo extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    checkData() {
        if (this.props.feedQuery.loading) {
            return (<div>Loading</div>)
        }

        if (this.props.feedQuery.error) {
            return (<div>An unexpected error occurred</div>)
        }

    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.id;
        console.log(name)
        this.setState({
            [name]: value
        });
    }
}