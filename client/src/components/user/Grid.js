import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FEED_QUERY, FEED_QUERY_NAME } from './Schema'

import BaseGrid from "../grid/BaseGrid";
import BaseTable from "../grid/BaseTable";
import BaseListFilters from "../grid/BaseListFilters";

class Grid extends BaseGrid {
    constructor(props) {
        super(props);
    }

    render() {
        const filterOptions = {
            createButton : true,
            submitButton : true,
            filters : {
                createButton : true,
                search : {
                    name : 'search',
                    type  : 'text',
                    value : '',
                }
            }};
        const tableOptions = {
                'id' : {
                    sorted : true,
                    name : 'ID'
                },
                'email' : {
                    sorted : true,
                    name : 'Email'
                },
                'username' : {
                    sorted : true,
                    name : 'Username'
                },
                'create_date' : {
                    sorted : {
                        colname : 'created_at'
                    },
                    name : 'Date',
                },
                'actions' : {
                    keycol : 'id'
                }
            };

        return (

            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i> Users List
                </CardHeader>
                <CardBody>
                    <BaseListFilters options={filterOptions} />
                    <br/>
                    <BaseTable
                        options={tableOptions}
                        query={FEED_QUERY}
                        queryName={FEED_QUERY_NAME}
                        filters={this.state}
                        handleClickSortAction={this.handleClickSortAction}
                        handleChangePage={this.handleChangePage}
                        handleDeleteAction={this.handleDeleteAction}
                        handleEditAction={this.handleEditAction}
                    />
                </CardBody>
            </Card>
        )
    }
}

export default (Grid);