import React from 'react';
import {
    Table,
    Button
} from 'reactstrap';
import { Query } from 'react-apollo';

import IPagination from '../IPagination'

class BaseTable extends React.Component {

    getTableHeader(options) {
        let header = [];
        for (let key in options) {
            if (options[key].sorted !== undefined
                && options[key].sorted) {
                let sortKey = (options[key].sorted.colname !== undefined) ? options[key].sorted.colname : key;
                header.push(
                    <th key={key} onClick={() => this.props.handleClickSortAction(sortKey)}
                        className={this.getSortingClass(sortKey)}>{options[key].name}
                    </th>
                )
            } else {
                header.push(
                    <th key={key}>{options[key].name}</th>
                )
            }
        }
        header = (
            <thead>
                <tr>
                    {header}
                </tr>
            </thead>);
        return header;
    }

    getTableRow(options, rowData) {
        let rowHtml = [];
        for (let key in options) {
            if (key === 'actions') {
                const keycol = rowData[options.actions.keycol];
                rowHtml.push(
                    <td className="text-center" key={key + keycol}>
                        <Button size="sm" outline type="submit" color="warning"
                                onClick={() => this.props.handleEditAction(keycol)}>Edit</Button>
                        &nbsp;
                        <Button size="sm" outline type="submit" color="danger"
                                onClick={() => this.props.handleDeleteAction(keycol)}>Delete</Button>
                    </td>
                );
                continue;
            }
            if (options[key].formatter !== undefined) {
                rowHtml.push(
                    <td key={key}>
                        {options[key].formatter(rowData[key])}
                    </td>
                )
            } else {
                rowHtml.push(
                    <td key={key}>{rowData[key]}</td>
                )
            }
        }
        return rowHtml;
    }
    getSortingClass(col) {
        return (col === this.props.filters.sort) ? 'sorting ' + this.props.filters.dir : 'sorting';
    }

    render() {
        const options = this.props.options;
        let vars = {...this.props.filters, ...this.props.filters.filters};

        return (
            <div>
                <Query
                    query={this.props.query}
                    variables={ vars }
                    notifyOnNetworkStatusChange
                >
                    {({ loading, error, data, refetch, networkStatus }) => {
                        if (networkStatus === 4) return <tr><td>"Refetching!"</td></tr>;
                        if (loading) return <div>Loading</div>;
                        if (error) return <div>`Error!: ${error}`</div>;

                        const totalPages = Math.ceil(data[this.props.queryName].count / this.props.filters.limit);
                        return (
                            <div>
                                <Table hover bordered striped responsive>
                                    {this.getTableHeader(options)}
                                    <tbody>
                                    {data[this.props.queryName].rows.map(row => (
                                        <tr key={row.id}>
                                            {this.getTableRow(options, row)}
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                                <IPagination handleChangePage={this.props.handleChangePage}
                                    pagesTotal={totalPages}
                                    settings={this.props.filters}/>
                            </div>
                        );
                    }}
                </Query>

            </div>
        );
    }
}

export default BaseTable;