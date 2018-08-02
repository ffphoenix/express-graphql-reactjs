import gql from 'graphql-tag'

const itemType = `{
        id
        project_id
        title
        description
        type
        status
        priority
        create_date
        order
        project {
            id
            short_name
            title
        }
    }`;

const boardType = `board { ` + itemType + ` } `;

export const UPDATE_POSITION_MUTATION = gql`
    mutation updatePosition($id: Int!, $status: Int!, $nextId: Int) {
        updatePosition(id: $id, status: $status, nextId: $nextId) {
            id
            project_id
            title
            description
            type
            status
            priority
            create_date
            order
            project {
                id
                short_name
                title
            }
        }
    }
`;

export const FEED_QUERY = gql(`
    query issuesBoard {
        issuesBoard {
            status,
            items {
                id
                project_id
                title
                description
                type
                status
                priority
                create_date
                order
                project {
                    id
                    short_name
                    title
                }
            }
        }
    }
`);

export const SUBSCRIPTION_QUERY = gql`
    subscription {
        issuePositionChanged {
            nextId
            issue {
                id
                project_id
                title
                description
                type
                status
                priority
                create_date
                order
                project {
                    id
                    short_name
                    title
                }
            }
        }
    }

`;

export const EDIT_SUBSCRIPTION = gql`
    subscription {
        issueEdited {
            id
            project_id
            title
            description
            type
            status
            priority
            create_date
            order
            project {
                id
                short_name
                title
            }
        }
    }

`;
export const CREATE_SUBSCRIPTION = gql`
    subscription {
        issueCreated {
            id
            project_id
            title
            description
            type
            status
            priority
            create_date
            order
            project {
                id
                short_name
                title
            }
        }
    }

`;

export const EDIT_STATUS_SUBSCRIPTION = gql`
    subscription {
        issueStatusEdited {
            id
            title
        }
    }

`;
