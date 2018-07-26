import gql from 'graphql-tag'

export const MODULE_URL = 'projects';

export const DELETE_QUERY_NAME = 'deleteMutation';
export const CREATE_QUERY_NAME = 'createMutation';
export const UPDATE_QUERY_NAME = 'updateMutation';
export const FEED_QUERY_NAME   = 'issueStatuses';
export const FEED_QUERY_ONE_NAME = 'issueStatus';

export const CREATE_MUTATION = gql`
    mutation createMutation($input: modifIssueStatusType!) {
        createIssueStatus(input: $input) {
            id      
            title
        }
    }
`;

export const UPDATE_MUTATION = gql`
  mutation updateMutation($id: Int!, $input: updateIssueStatusType) {
    updateIssueStatus(id: $id, input: $input) {
      id
      title
    }
  }
`;

export const DELETE_MUTATION = gql`
    mutation deleteMutation($id: Int!) {
        deleteIssueStatus(id: $id) {
            id
            title
        }
    }
`;

export const FEED_QUERY = gql`
    query issueStatuses($offset: Int, $limit: Int, $order: String, $search: String) {
        issueStatuses (offset: $offset, limit: $limit, order: $order, search : $search) {
            count
            rows {
                id      
                title
                create_date
            }
        }
    }
`;

export const FEED_ONE_QUERY = gql`
    query issueStatus($id: Int!) {
        issueStatus (id: $id) {
            id      
            title
            create_date
        }
    }
`;
