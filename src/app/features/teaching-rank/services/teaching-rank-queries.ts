import {gql} from 'apollo-angular';

export const getTeachingRankListQuery = gql`
    query GetTeachingRankList($query: TeachingRankGetListRequest!) {
        getTeachingRankList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                name
                isDeleted
            }
        }
    }
`;

export const getTeachingRankByIdQuery = gql`
    query GetTeachingRankById($id: ID!) {
        getTeachingRankById(query: {id: $id, showDeleted: true}) {
            id
            name
            isDeleted
            guid
        }
    }
`;

export const createTeachingRankQuery = gql`
    mutation CreateTeachingRank($body: TeachingRankCreateRequest!) {
        createTeachingRank(body: $body) {
            id
        }
    }
`;

export const updateTeachingRankQuery = gql`
    mutation UpdateTeachingRank($body: TeachingRankUpdateRequest!) {
        updateTeachingRank(body: $body) {
            id
            guid
            isDeleted
            name
        }
    }
`;

export const deleteTeachingRankQuery = gql`
    mutation DeleteTeachingRank($id: ID!, $guid: String!) {
        deleteTeachingRank(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getTeachingRankTeachersListQuery = gql`
    query GetTeachingRankTeachersList($query: TeacherGetListRequest!) {
        getTeacherList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                name: fullName
            }
        }
    }
`;
