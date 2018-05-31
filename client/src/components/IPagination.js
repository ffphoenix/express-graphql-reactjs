import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import React, {Component} from "react";

class IPagination extends Component {

    render() {

        console.log(this.props)
        return (
            <Pagination>
                <PaginationItem>
                    <PaginationLink previous tag="button"/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink tag="button">
                        1
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink tag="button">
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink tag="button">
                        3
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink tag="button">
                        4
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink tag="button">
                        5
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink next tag="button"/>
                </PaginationItem>
            </Pagination>
        );
    }
}

export default IPagination;