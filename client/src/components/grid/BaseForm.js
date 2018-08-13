import React from 'react'

import {
    Button,
    Form
} from 'reactstrap';
import { Link } from 'react-router-dom'
import CInput from "./formElements/CInput";
import Cwysiwyg from "./formElements/Cwysiwyg";
import CSelect from "./formElements/CSelect";
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import _ from 'lodash';
import { EditorState } from 'draft-js';

export default class BaseForm extends React.Component {

    ELEMENT_TYPE_INPUT = `input`;
    ELEMENT_TYPE_TEXT = `text`;
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
        this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
        this.handleSendData = this.handleSendData.bind(this);
        this.reciveDataForForm = this.reciveDataForForm.bind(this);
    }

    reciveDataForForm(props) {
        return props.feedOne[this.feedOneQueryName];
    }
    componentWillReceiveProps(nextProps) {
        // networkStatus changed from 1 to 7, meaning initial load finished successfully
        if (this.mode === this.UPDATE_MODE
            && this.props.feedOne.networkStatus === 1
            && nextProps.feedOne.networkStatus === 7) {
            if (!nextProps.error) {
                const propsData = this.reciveDataForForm(nextProps);
                let newStateData = this.state.data;
                if (propsData !== undefined && propsData !== null) {
                    for (let key in this.options) {
                        if (propsData[key] !== undefined) {
                            if (this.options[key].type === this.ELEMENT_TYPE_TEXT) {
                                newStateData[key] = EditorState.createWithContent(stateFromHTML(propsData[key]));
                            } else {
                                newStateData[key] = propsData[key];
                            }
                        } else {
                            console.log(`Not found props in [` + this.feedQueryName + `]`);
                        }
                    }
                    this.setState({data: newStateData})
                }
            }
        }
    }

    handleChangeTextarea(name, editorState) {
        let newState = this.state;
        newState.data[name] = editorState;
        this.setState(newState)
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let newState = this.state;
        newState.data[name] = value;
        this.setState(newState);
    }

    prepareDataToSend(){
        var data = _.clone(this.state.data);
        for (let i in this.options) {
            if (this.options[i].type === this.ELEMENT_TYPE_TEXT && data[i] !== undefined && data[i] !== null) {
                data[i] = stateToHTML(data[i].getCurrentContent())
            }
        }
        return data;
    }

    handleSendData(event) {
        event.preventDefault();
        event.stopPropagation();
        let dataToSend = this.prepareDataToSend();
        if (this.mode === this.CREATE_MODE) {
            this.props[this.createQueryName]({
                variables: {
                    input: dataToSend
                },
                refetchQueries: [this.feedQueryName]
            })
            .then(response => {
                if (this.props.showAsModal !== undefined && this.props.showAsModal) {
                    this.props.onCloseModal();
                } else {
                    this.props.history.push(`/` + this.backURL);
                }
            })
            .catch(response => {
                if (response.graphQLErrors !== undefined && response.graphQLErrors.length > 0) {
                    let newState = this.state;
                    newState.errors = response.graphQLErrors[0].data;
                    this.setState(newState);
                }
                else if (response.message !== null) {
                    console.error('Error mutation',response.message );
                }
            })
        } else if (this.mode === this.UPDATE_MODE) {
            this.props[this.updateQueryName]({
                variables: {
                    id: parseInt(this.props.match.params.id),
                    input: dataToSend
                }
            })
            .then(response => {
                if (this.props.showAsModal !== undefined && this.props.showAsModal) {
                    this.props.onCloseModal();
                } else {
                    this.props.history.push(`/` + this.backURL);
                }
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

    renderButtons(){
        if (this.props.showAsModal !== undefined && this.props.showAsModal === true) {
            return '';
        }

        return (
            <div className="form-actions custom-control-inline">
                <div className="pr-1">
                    <Button className="" type="button" color="primary" onClick={this.handleSendData}>Save
                        changes</Button>
                </div>
                <div className="pr-1">
                    <Link className="btn btn-secondary" to={`/` + this.backURL}>Cancel</Link>
                </div>
            </div>
        );
    }
    renderForm(options) {
        return (
            <Form>
                {this.renderFormElements(options)}
                {this.renderButtons()}
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
                    formElements.push(<CInput key={key} options={option}/>)
                    break;
                case this.ELEMENT_TYPE_TEXT:
                    option.handleChange = this.handleChangeTextarea;
                    formElements.push(<Cwysiwyg key={key} options={option}/>)
                    break;
                case this.ELEMENT_TYPE_SELECT:
                    formElements.push(<CSelect key={key} options={option}/>)
                    break;
            }
        }

        return formElements;
    }
}
