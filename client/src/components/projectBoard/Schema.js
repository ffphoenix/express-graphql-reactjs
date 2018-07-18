import gql from 'graphql-tag'

export const FEED_QUERY = gql`
    query issuesBoard {
        issuesBoard {
            new {
                id   
                project_id   
                title
                description
                type
                status
                priority
                create_date
            }
            inprogress {
                id   
                project_id   
                title
                description
                type
                status
                priority
                create_date
            }
            reopen {
                id   
                project_id   
                title
                description
                type
                status
                priority
                create_date
            }
            feedback {
                id   
                project_id   
                title
                description
                type
                status
                priority
                create_date
            }
            testready {
                id   
                project_id   
                title
                description
                type
                status
                priority
                create_date
            }
            closed {
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
