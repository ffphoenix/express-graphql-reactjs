import React from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Input,
    Label,
    FormFeedback,
} from 'reactstrap';
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { CREATE_MUTATION } from './UserSchema'
import BaseForm, { CREATE_QUERY_NAME }from '../base/BaseForm'

class UserCreate extends BaseForm {

    state = {
        data : {
            username: '',
            email: '',
            password: '',
        },
        errors : {}
    }

    constructor(props) {
        super(props);
        this.mode = this.CREATE_MODE;
    }

    render() {
        const  { data : formData, errors } = this.state;
        return (
            <Card>
                <CardHeader>
                    <strong>User</strong>
                    <small> create</small>
                </CardHeader>
                <CardBody>
                    <FormGroup>
                        <Label htmlFor="username">User name</Label>
                        <Input type="text" invalid={errors.username !== undefined} id="username" placeholder="Enter user name"
                               name="username"
                               value={formData.username} onChange={this.handleChange} />
                        {errors.username ? (<FormFeedback>{errors.username[Object.keys(errors.username)[0]]}</FormFeedback>) : ''}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input type="text" invalid={errors.email !== undefined} id="email" placeholder="Enter user email"
                               name="email"
                               value={formData.email} onChange={this.handleChange}/>
                        {errors.email ? (<FormFeedback>{errors.email[Object.keys(errors.email)[0]]}</FormFeedback>) : ''}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" invalid={errors.password !== undefined} id="password" placeholder="Enter password"
                               name="password"
                               value={formData.password} onChange={this.handleChange}/>
                        {errors.password ? Object.keys(errors.password).map((index) => (<FormFeedback key={index}>{errors.password[index]}</FormFeedback>)) : ''}
                    </FormGroup>
                    <div className="form-actions">
                        <Button type="submit" color="primary" onClick={this.handleSendData}>Save changes</Button>
                        <Link className="btn btn-secondary" to={`/users`} >Cancel</Link>
                    </div>
                </CardBody>
            </Card>
        )
    }


}
export default graphql(CREATE_MUTATION, { name: CREATE_QUERY_NAME })(UserCreate)