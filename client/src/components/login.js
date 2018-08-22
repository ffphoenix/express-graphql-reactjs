import React, { Component } from 'react'
import { AUTH_TOKEN } from '../config'
import {
    Button,
    Card,
    CardBody,
    CardGroup,
    Col,
    Container,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Alert
} from 'reactstrap';
import axios from 'axios';
//const basePORT = (window.location.hostname === 'localhost') ?  ':4000' : '';
const basePORT = ':4000';
const baseURL = (window.location.protocol === 'https:') ? 'https://' + window.location.hostname : 'http://' + window.location.hostname ;
export default class Login extends Component {
    state = {
        data : {
            password: '',
            email: ''
        },
        error : null
    };

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        if (localStorage.getItem(AUTH_TOKEN)) {
            this.props.history.push(`/`);
        }
    }

    handleChange(e) {
        const name = e.target.name;
        let newState = this.state;
        newState.data[name] = e.target.value;
        newState.error = null;
        this.setState(newState);
    }

    handleSubmit(event) {
        event.preventDefault();

        const variables = this.state.data;
        axios.post(`${baseURL}${basePORT}/api/login`, variables)
            .then(res => {
                if (res.data.success === true){
                    if (res.data.token){
                        localStorage.setItem(AUTH_TOKEN, res.data.token);
                        this.props.history.push(`/`);
                    }
                } else if (res.data.error){
                    this.setState({error : res.data.error})
                }
            })
    }

    render() {
        const formData = this.state;
        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="8">
                            <CardGroup>
                                <Card className="p-4">
                                    <CardBody>
                                        <h1>Login</h1>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                                <Input
                                                    name='email'
                                                    value={formData.data.email}
                                                    onChange={this.handleChange}
                                                    type="text"
                                                    placeholder="Your Email"
                                                />
                                        </InputGroup>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                name='password'
                                                value={formData.data.password}
                                                onChange={this.handleChange}
                                                type="password"
                                                placeholder="Your Password"
                                            />
                                        </InputGroup>
                                        {formData.error ? (<Alert color="danger">{formData.error}</Alert>) : ''}
                                        <Row>
                                            <Col xs="6">
                                                <Button color="primary" className="px-4" onClick={this.handleSubmit}>Login</Button>
                                            </Col>
                                            <Col xs="6" className="text-right">
                                                <Button color="link" className="px-0">Forgot password?</Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}