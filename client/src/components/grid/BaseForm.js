import React from 'react'
import { lifecycle } from 'recompose'
export default class BaseForm extends React.Component {
    httpDataUpdated = false;

    CREATE_MODE = 'create';
    UPDATE_MODE = 'update';

    feedQuery = null;
    feedOneQuery = null;
    createQueryName  = null;
    updateQueryName  = null;
    feedOneQueryName = null;
    mode = '';

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSendData = this.handleSendData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // networkStatus changed from 1 to 7, meaning initial load finished successfully
        if (this.mode === this.UPDATE_MODE
            && this.props.feedOne.networkStatus === 1
            && nextProps.feedOne.networkStatus === 7) {
            if (!nextProps.error) {
                const propsData = nextProps.feedOne[this.feedOneQueryName];
                let newStateData = this.state.data;
                for (let key in this.state.data) {
                    newStateData[key] = propsData[key];
                }
                this.setState({ data : newStateData })
            }
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
            console.log('send---->',this.props);
            return;
            this.props[this.createQueryName]({
                variables: {
                    input: this.state.data
                }
            })
            .then(response => {


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

            this.props[this.updateQueryName]({
                variables: {
                    id: parseInt(this.props.match.params.id),
                    input: this.state.data
                }
            })
            .then(response => {

                this.props.history.push(`/users`);
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
}
