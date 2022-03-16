import {gql} from 'apollo-angular';

export const getAcademicTitleListQuery = gql`
    query GetAcademicTitleList($query: AcademicTitleGetListRequest!) {
        getAcademicTitleList(query: $query) {
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

export const getAcademicTitleByIdQuery = gql`
    query GetAcademicTitleById($id: ID!) {
        getAcademicTitleById(query: {id: $id, showDeleted: true}) {
            id
            name
            isDeleted
            guid
        }
    }
`;

export const createAcademicTitleQuery = gql`
    mutation CreateAcademicTitle($body: AcademicTitleCreateRequest!) {
        createAcademicTitle(body: $body) {
            id
        }
    }
`;

export const updateAcademicTitleQuery = gql`
    mutation UpdateAcademicTitle($body: AcademicTitleUpdateRequest!) {
        updateAcademicTitle(body: $body) {
            id
            guid
            isDeleted
            name
        }
    }
`;

export const deleteAcademicTitleQuery = gql`
    mutation DeleteAcademicTitle($id: ID!, $guid: String!) {
        deleteAcademicTitle(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getAcademicTitleTeachersListQuery = gql`
    query GetAcademicTitleTeachersList($query: TeacherGetListRequest!) {
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
