import { FormFeedback } from 'reactstrap';
import React from "react";

class CustomFormGroup extends React.Component {

    render() {
        const error = this.props.error | undefined;
        const label  = this.props.label | "unlabled";
        const name  = this.props.name | "unnamed";
        const type  = this.props.type | "text";
        const placeholder  = this.props.placeholder | "Enter " + label;
        const value = this.props.type;
        return (
            <FormGroup>
                <Label htmlFor={name}>{label}</Label>
                <Input type={type} invalid={error !== undefined} id={name} placeholder={placeholder}
                       name={name}
                       value={formData.username} onChange={this.handleChange} />
                <FormFeedback>{error[Object.keys(error)[0]]}</FormFeedback>
            </FormGroup>
        )
    }
}

export default InputGroupError;