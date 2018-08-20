import gql from 'graphql-tag'

const itemType = `
    {
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
`;

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
export const UPDATE_SET_USER_OFFLINE = gql`
    mutation setUserOffline($id: Int!) {
        setUserOffline(id: $id) 
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

export const CHANGE_ONLINE_SUBSCRIPTION = gql`
    subscription {
        changeOnlineUser {
            id      
            email
            username
            action
        }
    }
`;

export const CHANGE_ISSUE_SUBSCRIPTION = gql`
    subscription {
        issueOnChange {
            id
            delta
            hash
        }
    }
`;

export const INIT_REVISION_MUTATION = gql`
    mutation initIssueRevision($id: Int!, $input: updateAttiributes!) {
        initIssueRevision(id: $id, input: $input) 
    }
`;

export const ONCHANGE_MUTATION = gql`
    mutation onChangeIssue($id: Int!, $input: JSON, $hash: String!) {
        onChangeIssue(id: $id, input: $input, hash: $hash) {
            id
            delta
            hash
        }
    }
`;


export const USERS_ONLINE_FEED = gql`
    query issueUsersOnline($id: Int!) {
        issueUsersOnline(id : $id)
            {
                id      
                email
                username
            }
        
    }
`;
