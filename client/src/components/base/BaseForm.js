import React from 'react'

export default class BaseForm extends React.Component {

    CREATE_MODE = 'create';
    UPDATE_MODE = 'update';

    feedQuery = null;
    feedOneQuery = null;
    feedVariables = {};
    createQueryName = null;
    updateQueryName = null;
    mode = '';

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSendData = this.handleSendData.bind(this);

        if (this.mode == this.UPDATE_MODE) {

        }
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
            this.props[this.createQueryName]({
                variables: {
                    input: this.state.data
                },
                update: (store, { data : respData }) => {
                    const first = 10;
                    const skip = 0;
                    const orderBy = 'createdAt_DESC';
                    const data = store.readQuery({
                        query: this.feedQuery,
                        variables: this.feedVariables,
                    });

                    console.log('-------------->>', data, this.createQueryName, respData);
                    data.users.splice(0, 0, respData[this.createQueryName]);
                    data.users.pop();
                    store.writeQuery({
                        query: this.feedQuery,
                        data,
                        variables: this.feedVariables,
                    });

                },
            })
            .then(response => {
                console.log(response);
                this.props.history.push(`/users`);
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