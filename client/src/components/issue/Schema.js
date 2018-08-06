import gql from 'graphql-tag'

export const MODULE_URL = 'issues';

export const DELETE_QUERY_NAME = 'deleteMutation';
export const CREATE_QUERY_NAME = 'createMutation';
export const UPDATE_QUERY_NAME = 'updateMutation';
export const FEED_QUERY_NAME   = 'issues';
export const FEED_QUERY_ONE_NAME = 'issue';

export const CREATE_MUTATION = gql`
    mutation createMutation($input: modifIssueType!) {
        createIssue(input: $input) {
            id   
            project_id   
            title
            description
            type
            status
            priority
            create_date
        }
    }
`;

export const UPDATE_MUTATION = gql`
    mutation updateMutation($id: Int!, $input: modifIssueType!) {
        updateIssue(id: $id, input: $input) {
            id   
            project_id   
            title
            description
            type
            status
            priority
            create_date
        }
    }
`;

export const PROCESS_MUTATION = gql`
    mutation editProcess($id: Int!, $input: issueEditProcessType) {
        editProcess(id: $id, input: $input) {
            issueProcessType
        }
    }
`;

export const DELETE_MUTATION = gql`
    mutation deleteMutation($id: Int!) {
        deleteIssue(id: $id) {
            id   
            project_id   
            title
            description
            type
            status
            priority
            create_date
        }
    }
`;

export const FEED_QUERY = gql`
    query issues($offset: Int, $limit: Int, $order: String, $search: String) {
        issues (offset: $offset, limit: $limit, order: $order, search : $search) {
            count
            rows {
                id   
                project_id   
                title
                description
                type
                status
                priority
                create_date
            }
        }
    }
`;

export const FEED_ONE_QUERY = gql`
    query issues($id: Int!, $collab: Boolean) {
        issue (id: $id, collaborative: $collab) {
            id   
            project_id   
            title
            description
            type
            status
            priority
            create_date
        }
    }
`;
