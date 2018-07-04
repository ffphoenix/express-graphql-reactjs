import gql from 'graphql-tag'

export const MODULE_URL = 'projects';

export const DELETE_QUERY_NAME = 'deleteMutation';
export const CREATE_QUERY_NAME = 'createMutation';
export const UPDATE_QUERY_NAME = 'updateMutation';
export const FEED_QUERY_NAME   = 'projects';
export const FEED_QUERY_ONE_NAME = 'project';

export const CREATE_MUTATION = gql`
    mutation createMutation($input: modifProjectType!) {
        createProject(input: $input) {
            id      
            title
            short_name
            description
            create_date
        }
    }
`;

export const UPDATE_MUTATION = gql`
  mutation updateMutation($id: Int!, $input: modifProjectType!) {
    updateProject(id: $id, input: $input) {
      id
      short_name
      title
    }
  }
`;

export const DELETE_MUTATION = gql`
    mutation deleteMutation($id: Int!) {
        deleteProject(id: $id) {
            id
            short_name
            title
        }
    }
`;

export const FEED_QUERY = gql`
    query projects($offset: Int, $limit: Int, $order: String, $search: String) {
        projects (offset: $offset, limit: $limit, order: $order, search : $search) {
            count
            rows {
                id      
                title
                short_name
                description
                create_date
            }
        }
    }
`;

export const FEED_ONE_QUERY = gql`
    query projects($id: Int!) {
        project (id: $id) {
            id      
            title
            short_name
            description
            create_date
        }
    }
`;
