import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import { graphql, withApollo, compose } from 'react-apollo'
import { CREATE_MUTATION, FEED_QUERY_NAME, CREATE_QUERY_NAME, UPDATE_QUERY_NAME, MODULE_URL } from './Schema'
import BaseForm from '../grid/BaseForm'

class Create extends BaseForm {

    state = {
        data : {
            title: '',
            short_name: '',
            description: '',
        },
        errors : {}
    }

    constructor(props) {
        super(props);
        this.backURL = MODULE_URL;
        this.mode = this.CREATE_MODE;
        this.feedQueryName = FEED_QUERY_NAME;
        this.createQueryName = CREATE_QUERY_NAME;
        this.updateQueryName = UPDATE_QUERY_NAME;
    }

    render() {
        const options = {
            title: {
                type: this.ELEMENT_TYPE_INPUT,
                label: 'Title',
                placeholder: 'Enter title...'
            },
            short_name: {
                type: this.ELEMENT_TYPE_INPUT,
                label: 'Short name',
                placeholder: 'Enter Short name...'
            },
            description: {
                type: this.ELEMENT_TYPE_PASSWORD,
                label: 'Description',
                placeholder: 'Enter Description...'
            },
        }

        return (
            <Card>
                <CardHeader>
                    <strong>Project</strong>
                    <small> create</small>
                </CardHeader>
                <CardBody>
                    {this.renderForm(options)}
                </CardBody>
            </Card>
        )
    }


}

export default compose(
    graphql(CREATE_MUTATION, { name: CREATE_QUERY_NAME }),
    withApollo
)(Create)