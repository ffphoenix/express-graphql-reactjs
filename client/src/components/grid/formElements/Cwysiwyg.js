import React from "react";
import FormGroupError from "./FormGroupError";

import {
    FormGroup,
    Label,
} from 'reactstrap';
import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Cwysiwyg extends React.Component {

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
                <div className="rdw-storybook-root">
                    <Editor
                        id={key}
                        name={key}
                        editorState={value}
                        toolbarClassName="rdw-storybook-toolbar"
                        wrapperClassName="rdw-storybook-wrapper"
                        editorClassName="rdw-storybook-editor"
                        onEditorStateChange={(state) => options.handleChange(key, state)}
                    />
                </div>
                <FormGroupError error={error} />
            </FormGroup>
        )
    }
}

export default Cwysiwyg;