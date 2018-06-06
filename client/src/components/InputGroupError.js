import { FormFeedback } from 'reactstrap';
import React from "react";

class InputGroupError extends React.Component {

    render() {
        if (this.props.error) {
            const error = this.props.error;
            return (
                <FormFeedback>{error[Object.keys(error)[0]]}</FormFeedback>
            )
        }
        return ('');
    }
}

export default InputGroupError;