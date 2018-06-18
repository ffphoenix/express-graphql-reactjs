import React from "react";
import FormGroupError from "./FormGroupError";

import {
    FormGroup,
    Input,
    Label,
} from 'reactstrap';

class CustomFormGroup extends React.Component {

    render() {
        const options = this.props.options;
        const key = options.key;
        const error = options.error || undefined;
        const label  = options.label || `unlabled`;
        const type  = options.type || `text`;
        const placeholder  = options.placeholder || `Enter ` + label;
        const value = options.value  || ``;

        return (
            <FormGroup>
                <Label htmlFor={key}>{label}</Label>
                <Input type={type} invalid={error !== undefined} id={key} placeholder={placeholder}
                       name={key}
                       value={value} onChange={options.handleChange} />
                <FormGroupError error={error} />
            </FormGroup>
        )
    }
}

export default CustomFormGroup;