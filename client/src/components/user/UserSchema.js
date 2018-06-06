import gql from 'graphql-tag'

export const CREATE_QUERY_NAME = 'createUser';
export const UPDATE_QUERY_NAME = 'updateMutation';

export const CREATE_MUTATION = gql`
  mutation createMutation($input: modifUserType!) {
    createUser(input: $input) {
      id
      username
      email
      created_at
    }
  }
`;

export const UPDATE_MUTATION = gql`
  mutation UserMutation($input: modifUserType!) {
    createUser(input: $input) {
      id
      username
      email
    }
  }
`;

export const FEED_QUERY = gql`
    query users($offset: Int!, $limit: Int!, $orderBy: String!) {
        users (offset: $offset, limit: $limit, orderBy: $orderBy) {
            count
            rows {
                id      
                email
                username
                created_at
            }
        }
    }
`;

export const FEED_ONE_QUERY = gql`
    query users($id: Int!) {
        user (id: $id) {
            id      
            email
            username
            created_at
        }
    }
`;
