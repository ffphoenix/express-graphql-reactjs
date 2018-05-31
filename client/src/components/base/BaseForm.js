import React from 'react'

export const CREATE_QUERY_NAME = 'createMutation';
export const UPDATE_QUERY_NAME = 'updateMutation';

export default class BaseForm extends React.Component {

    CREATE_MODE = 'create';
    UPDATE_MODE = 'update';

    mode = '';

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSendData = this.handleSendData.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let newState = this.state;
        newState.data[name] = value;
        this.setState(newState);
    }

    handleSendData = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (this.mode === this.CREATE_MODE) {
            await this.props[CREATE_QUERY_NAME]({
                variables: {
                    input: this.state.data
                },
                update: (store, {data: {post}}) => {
                    console.log(store);
                },
            })
            .then(function () {
                console.log('ddd');
                this.props.history.push(`/users/`);
            })
            .catch(response => {
                if (response.graphQLErrors !== undefined) {
                    let newState = this.state;
                    newState.errors = response.graphQLErrors[0].data;
                    this.setState(newState);
                }
            })
        } else if (this.mode === this.UPDATE_MODE) {

        }
    }

}