import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import baseApollo from '../baseApollo';

class User extends baseApollo {
    static propTypes = {
        data: React.PropTypes.shape({
            loading: React.PropTypes.bool,
            error: React.PropTypes.object,
            users: [
                React.PropTypes.object
            ],
        }).isRequired,
    }

    render() {
        const renderData = this.checkData();
        if (renderData !== '') {
            return renderData;
        }
        return (
           <div>User test</div>
        );
    }
}

export default User;
