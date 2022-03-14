import {gql} from 'apollo-angular';

export const getAcademicDegreeListQuery = gql`
    query GetAcademicDegreeList($query: AcademicDegreeGetListRequest!) {
        getAcademicDegreeList(query: $query) {
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

export const getAcademicDegreeByIdQuery = gql`
    query GetAcademicDegreeById($id: ID!) {
        getAcademicDegreeById(query: {id: $id, showDeleted: true}) {
            id
            name
            isDeleted
            guid
        }
    }
`;

export const createAcademicDegreeQuery = gql`
    mutation CreateAcademicDegree($body: AcademicDegreeCreateRequest!) {
        createAcademicDegree(body: $body) {
            id
        }
    }
`;

export const updateAcademicDegreeQuery = gql`
    mutation UpdateAcademicDegree($body: AcademicDegreeUpdateRequest!) {
        updateAcademicDegree(body: $body) {
            id
            guid
            isDeleted
            name
        }
    }
`;

export const deleteAcademicDegreeQuery = gql`
    mutation DeleteAcademicDegree($id: ID!, $guid: String!) {
        deleteAcademicDegree(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getAcademicDegreeTeachersListQuery = gql`
    query GetAcademicDegreeTeachersList($query: TeacherGetListRequest!) {
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
