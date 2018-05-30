import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Table, Row, Button } from 'reactstrap';
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import baseApollo from '../baseApollo'
import IPagination from '../IPagination'
import moment from 'moment';

class UserList extends baseApollo {

    constructor(props) {
        super(props);
    }

    render() {
        const checkResult = this.checkData();
        if (checkResult !== undefined) {
            return checkResult;
        }

        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i> Simple Table
                </CardHeader>
                <CardBody>
                    <Row>
                        <Link to={`/users/create`}><Button color="primary" onClick={this._createNew()}>Create new</Button></Link>
                    </Row>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.feedQuery.users.map((row, index) => (
                            <tr key={row.id}>
                                <td>{row.username}</td>
                                <td>{row.email}</td>
                                <td>{moment(row.created_at).format('MMMM DD YYYY h:mm:ss')}</td>
                                <td>
                                    <Badge color="success">Active</Badge>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </Table>
                    <IPagination></IPagination>
                </CardBody>
            </Card>

        )
    }

    _createNew() {
        
    }

}
export const FEED_QUERY = gql`
    query users  {
        users {
          id      
          email
          username
          created_at
        }
    }
`

export default graphql(FEED_QUERY, { name: 'feedQuery' }) (UserList)
