import React from "react";
import FormGroupError from "./FormGroupError";

import {
    FormGroup,
    Input,
    Label,
} from 'reactstrap';

class CSelect extends React.Component {

    render() {
        const options = this.props.options;
        const key = options.key;
        const error = options.error || undefined;
        const label  = options.label || `unlabled`;
        const type  = options.type || `text`;
        const placeholder  = options.placeholder || `Select ` + label;
        const value = options.value  || ``;

        return (
            <FormGroup>
                <Label htmlFor={key}>{label}</Label>
                <Input type={type}  id={key}
                       invalid={error !== undefined}
                       name={key}
                       defaultValue={value}
                       onChange={options.handleChange} >
                    <option value="">{placeholder}</option>
                    { Object.keys(options.options).map( skey => {
                        return (<option key={skey} value="key" >{options.options[skey]}</option>);
                    })}

                </Input>

                <FormGroupError error={error} />
            </FormGroup>
        )
    }
}

export default CSelect;