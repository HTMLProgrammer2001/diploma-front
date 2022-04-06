import {gql} from 'apollo-angular';

export const getProfileQuery = gql`
    query GetProfile {
        getProfile {
            avatarUrl
            phone
            email
            fullName
            role {
                name
            }
            id
            guid
        }
    }
`;

export const editProfileQuery = gql`
    mutation EditProfile($body: EditProfileRequest!) {
        editProfile(body: $body) {
            avatarUrl
            phone
            email
            fullName
            role {
                name
            }
            id
            guid
        }
    }
`;

export const deleteProfile = gql`
    mutation DeleteProfile($guid: String!) {
        deleteProfile(guid: $guid) {
            id
        }
    }
`;

