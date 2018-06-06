import React from 'react';
import { Badge, Card, CardBody, CardHeader, Table, Button,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Input
} from 'reactstrap';
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo';
import { FEED_QUERY } from './UserSchema'

import IPagination from '../IPagination'
import moment from 'moment';
import BaseList from "../base/BaseList";


class UserList extends BaseList {

    constructor(props) {
        super(props);
    }

    render() {
        let pagesTotal = 0;
        return (

            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i> Users List
                </CardHeader>
                <CardBody>
                    <Form action="" method="post" inline>
                        <FormGroup className="pr-1">
                            <Link to={`/users/create`}><Button color="primary">Create new</Button></Link>
                        </FormGroup>
                        <FormGroup className="pr-1 float-right">
                            <InputGroup>
                                <Input type="search" id="search" placeholder="search" />
                                <InputGroupAddon addonType="append">
                                    <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                    <br/>
                    <Query
                        query={FEED_QUERY}
                        variables={this.state}
                        fetchPolicy="cache-and-network"
                    >
                        {({ loading, error, data, fetchMore }) => {

                            if (loading) return (<div>Loading...</div>);
                            if (error) return (<div>`Error! ${error.message}`</div>);

                            pagesTotal = Math.ceil(data.users.count / this.state.limit);
                            return (
                                <div>
                                    <Table hover bordered striped responsive>
                                        <thead>
                                        <tr>
                                            <th>id</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Create Date</th>
                                            <th className="text-center"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {data.users.rows.map(row => (
                                                <tr key={row.id}>
                                                    <td>{row.id}</td>
                                                    <td>{row.username}</td>
                                                    <td>{row.email}</td>
                                                    <td>{moment(row.create_date).format('MM/DD/YY HH:mm:ss')}</td>
                                                    <td className="text-center">
                                                        <Button size="sm" outline type="submit" color="warning" onClick={() => this.props.history.push(`/users/update/` + row.id)}>Edit</Button>
                                                        &nbsp;
                                                        <Button size="sm" outline type="submit" color="danger" onClick={() => this.handleDeleteAction(row.id)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>

                                    </Table>
                                    <IPagination handleChangePage={this.handleChangePage} pagesTotal={pagesTotal} settings={this.state}></IPagination>
                                </div>
                            );
                        }}
                    </Query>

                </CardBody>
            </Card>
        )
    }
}

export default UserList;