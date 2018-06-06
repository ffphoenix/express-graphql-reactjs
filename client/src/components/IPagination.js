import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import React, {Component} from "react";

class IPagination extends Component {

    render() {
        const data = {
            total : this.props.pagesTotal,
            ...this.props.settings
        }

        let pages = [];
        for (let i = 1; i <= data.total; ++i ){
            pages.push(
                <PaginationItem active={(i === data.page)}  key={i}>
                <PaginationLink tag="button" onClick={() => this.props.handleChangePage(i)}>
                    {i}
                </PaginationLink></PaginationItem>
            );
        }
        return (
            <Pagination>
                {(data.page > 1 && data.total > 1) ?
                    (<PaginationItem>
                        <PaginationLink previous tag="button"
                            onClick={() => this.props.handleChangePage(data.page - 1)}
                        />
                    </PaginationItem>) : ''
                }
                {pages}
                {(data.page < data.total && data.total > 1) ?
                    (<PaginationItem>
                        <PaginationLink next tag="button"
                            onClick={() => this.props.handleChangePage(data.page + 1)}
                        />
                    </PaginationItem>) : ''
                }
            </Pagination>
        );
    }
}

export default IPagination;