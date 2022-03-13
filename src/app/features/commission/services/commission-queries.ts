import {gql} from 'apollo-angular';

export const getCommissionListQuery = gql`
    query GetCommissionList($query: CommissionGetListRequest!) {
        getCommissionsList(query: $query) {
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

export const getCommissionByIdQuery = gql`
    query GetCommissionById($id: ID!) {
        getCommissionById(query: {id: $id, showDeleted: true}) {
            id
            name
            isDeleted
            guid
        }
    }
`;

export const createCommissionQuery = gql`
    mutation CreateCommission($body: CommissionCreateRequest!) {
        createCommission(body: $body) {
            id
        }
    }
`;

export const updateCommissionQuery = gql`
    mutation UpdateCommission($body: CommissionUpdateRequest!) {
        updateCommission(body: $body) {
            id
            guid
            isDeleted
            name
        }
    }
`;

export const deleteCommissionQuery = gql`
    mutation DeleteCommission($id: ID!, $guid: String!) {
        deleteCommission(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getCommissionTeachersListQuery = gql`
    query GetCommissionTeachersList($query: TeacherGetListRequest!) {
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
