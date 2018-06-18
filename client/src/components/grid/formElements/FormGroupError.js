import { FormFeedback } from 'reactstrap';
import React from "react";

class FormGroupError extends React.Component {

    render() {
        let errorsHTML = [];
        if (this.props.error !== undefined) {
            for (let key in this.props.error) {
                errorsHTML.push(<FormFeedback key={key}>{this.props.error[key]}</FormFeedback>)
            }
        }
        return errorsHTML;
    }
}

export default FormGroupError;