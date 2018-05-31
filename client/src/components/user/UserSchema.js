import gql from 'graphql-tag'

export const CREATE_MUTATION = gql`
  mutation UserMutation($input: modifUserType!) {
    createUser(input: $input) {
      id
      username
      email
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
    query users  {
        users {
          id      
          email
          username
          created_at
        }
    }
`;