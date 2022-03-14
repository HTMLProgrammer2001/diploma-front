import {gql} from 'apollo-angular';

export const getDepartmentListQuery = gql`
    query GetDepartmentList($query: DepartmentGetListRequest!) {
        getDepartmentsList(query: $query) {
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

export const getDepartmentByIdQuery = gql`
    query GetDepartmentById($id: ID!) {
        getDepartmentById(query: {id: $id, showDeleted: true}) {
            id
            name
            isDeleted
            guid
        }
    }
`;

export const createDepartmentQuery = gql`
    mutation CreateDepartment($body: DepartmentCreateRequest!) {
        createDepartment(body: $body) {
            id
        }
    }
`;

export const updateDepartmentQuery = gql`
    mutation UpdateDepartment($body: DepartmentUpdateRequest!) {
        updateDepartment(body: $body) {
            id
            guid
            isDeleted
            name
        }
    }
`;

export const deleteDepartmentQuery = gql`
    mutation DeleteDepartment($id: ID!, $guid: String!) {
        deleteDepartment(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getDepartmentTeachersListQuery = gql`
    query GetDepartmentTeachersList($query: TeacherGetListRequest!) {
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
