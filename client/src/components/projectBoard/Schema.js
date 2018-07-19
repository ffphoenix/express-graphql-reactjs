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
        project {
            id
            short_name
            title
        }
    }`;

const boardType = `new ` + itemType +
    ` inprogress ` + itemType +
    ` reopen ` + itemType +
    ` feedback ` + itemType +
    ` testready ` + itemType +
    ` closed ` + itemType;

export const FEED_QUERY = gql(`
    query issuesBoard {
        issuesBoard { ` + boardType + ` }
    }
`);

// export const UPDATE_POSITION_MUTATION = gql(`
//     mutation updatePosition($id: Int!, $input: modifIssueType!) {
//         updatePosition(id: $id, input: $input) {
//             ` + itemType + `
//         }
//     }
// `);
