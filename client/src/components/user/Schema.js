import gql from 'graphql-tag'

export const CREATE_QUERY_NAME = 'createMutation';
export const UPDATE_QUERY_NAME = 'updateMutation';
export const FEED_QUERY_NAME   = 'users';
export const FEED_QUERY_ONE_NAME   = 'user';


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
  mutation updateMutation($id: Int!, $input: updateUserType!) {
    updateUser(id: $id, input: $input) {
      id
      username
      email
    }
  }
`;

export const FEED_QUERY = gql`
    query users($offset: Int, $limit: Int, $order: String, $search: String) {
        users (offset: $offset, limit: $limit, order: $order, search : $search) {
            count
            rows {
                id      
                email
                username
                create_date
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
