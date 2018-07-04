import React from 'react'

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Input,
    Label,
    Form
} from 'reactstrap';
import { Link } from 'react-router-dom'
import CustomFormGroup from "./formElements/CustomFormGroup";

export default class BaseForm extends React.Component {

    ELEMENT_TYPE_INPUT = `input`;
    ELEMENT_TYPE_PASSWORD = `password`;
    ELEMENT_TYPE_SELECT = `select`;
    ELEMENT_TYPE_CHECKBOX = `checkbox`;
    ELEMENT_TYPE_RADIO = `radio`;
    ELEMENT_TYPE_AUTOCOMPLETE = `autocomplete`; //autocomplete

    CREATE_MODE = 'create';
    UPDATE_MODE = 'update';

    backURL = ``;
    feedOneQuery = null;
    createQueryName  = null;
    updateQueryName  = null;
    feedOneQueryName = null;
    feedQueryName = null;
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
            this.props[this.createQueryName]({
                variables: {
                    input: this.state.data
                },
                refetchQueries: [this.feedQueryName]
            })
            .then(response => {
                this.props.history.push(`/` + this.backURL);
            })
            .catch(response => {
                if (response.graphQLErrors !== undefined) {
                    let newState = this.state;
                    // console.log(response.errors)
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

    renderForm(options) {

        return (
            <Form>
                {this.renderFormElements(options)}
                <div className="form-actions custom-control-inline">
                    <div className="pr-1">
                        <Button className="" type="submit" color="primary" onClick={this.handleSendData}>Save changes</Button>
                    </div>
                    <div className="pr-1">
                        <Link className="btn btn-secondary" to={`/` + this.backURL} >Cancel</Link>
                    </div>
                </div>
            </Form>
        )
    }


    renderFormElements(options){
        let formElements = [];
        for (let key in options) {
            let option = options[key];
            if (option.type === undefined) {
                continue;
            }

            if (this.state.data[key] !== undefined) {
                option.value = this.state.data[key];
            }

            if (this.state.errors[key] !== undefined) {
                option.error = this.state.errors[key];
            }

            option.key = key;
            option.handleChange = this.handleChange;

            switch (option.type) {
                case this.ELEMENT_TYPE_INPUT :
                case this.ELEMENT_TYPE_PASSWORD :
                    formElements.push(<CustomFormGroup key={key} options={option}/>)
            }
        }

        return formElements;
    }
}
