import {gql} from 'apollo-angular';

export const getUserInfoQuery = gql`
    query GetUserInfo {
        getProfile {
            fullName
            id
            avatarUrl
            email
        }
    }
`;
