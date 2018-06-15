import React from 'react'
import {
    Form,
    FormGroup,
    InputGroup,
    Input,
    Button
} from 'reactstrap';
import { Link } from 'react-router-dom'

class BaseListFilters extends React.Component {

    state = {
        search: ''
    }

    constructor(props) {
        super(props);
        console.log(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let newState = this.state;
        newState[name] = value;
        this.setState(newState);
    }

    getRenderedText(options) {
        return (
            <FormGroup key={options.name} className="pr-1">
                <InputGroup>
                    <Input type="text" id={options.name} value={this.state[options.name]} name="search" onChange={this.handleChange} placeholder={options.name} />
                </InputGroup>
            </FormGroup>
        )
    }

    render() {
        const options = this.props.options;
        console.log(this.props);
        let renderedFilters = [];
        for (let key in options.filters) {
            let filter = options.filters[key];
            switch (filter.type) {
                case 'text' :
                    renderedFilters.push(this.getRenderedText(filter))
            }
        }

        return (
            <Form action="" method="post" inline>
                <FormGroup className="pr-1">
                    <Link to={`/users/create`}><Button color="primary">Create new</Button></Link>
                </FormGroup>
                {renderedFilters}

                <FormGroup className="pr-1">
                    <Button color="primary" onClick={(e) => this.props.onFilter(e, this.state)} >Search</Button>
                </FormGroup>


            </Form>

        );
    }

}

export default BaseListFilters;
