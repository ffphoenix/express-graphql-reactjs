import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './UserSchema'

class UserCreate extends Component {
    state = {
        description: '',
        url: '',
    }

    render() {
        return (
            <div>
                test
            </div>
        )
    }

    _createLink = async () => {
        const { description, url } = this.state
        await this.props.postMutation({
            variables: {
                description,
                url,
            },
            update: (store, { data: { post } }) => {
                const first = 10
                const skip = 0
                const orderBy = 'createdAt_DESC'
                const data = store.readQuery({
                    query: FEED_QUERY,
                    variables: { first, skip, orderBy },
                })
                data.feed.links.splice(0, 0, post)
                data.feed.links.pop()
                store.writeQuery({
                    query: FEED_QUERY,
                    data,
                    variables: { first, skip, orderBy },
                })
            },
        })
        this.props.history.push(`/new/1`)
    }
}

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

export default graphql(POST_MUTATION, { name: 'postMutation' })(UserCreate)