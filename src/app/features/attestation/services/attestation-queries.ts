import {gql} from 'apollo-angular';

export const getAttestationListQuery = gql`
    query GetAttestationList($query: AttestationGetListRequest!) {
        getAttestationList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                teacher {
                    id
                    name
                }
                category {
                    id
                    name
                }
                date
                isDeleted
            }
        }
    }
`;

export const getAttestationByIdQuery = gql`
    query GetAttestationById($id: ID!) {
        getAttestationById(query: {id: $id, showDeleted: true}) {
            id
            category {
                id
                name
            }
            teacher {
                id
                name
            }
            description
            date
            isDeleted
            guid
        }
    }
`;

export const createAttestationQuery = gql`
    mutation CreateAttestation($body: AttestationCreateRequest!) {
        createAttestation(body: $body) {
            id
        }
    }
`;

export const updateAttestationQuery = gql`
    mutation UpdateAttestation($body: AttestationUpdateRequest!) {
        updateAttestation(body: $body) {
            id
            guid
            isDeleted
            date
            description
            teacher {
                id
                name
            }
            category {
                id
                name
            }
        }
    }
`;

export const deleteAttestationQuery = gql`
    mutation DeleteAttestation($id: ID!, $guid: String!) {
        deleteAttestation(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getTeacherDropdownQuery = gql`
    query GetTeacherDropdown($page: Int, $size: Int, $name: String) {
        getTeacherList(query: {page: $page, size: $size, fullName: $name, showDeleted: false}) {
            size
            page
            skip
            totalPages
            totalElements
            responseList {
                id
                name: fullName
            }
        }
    }
`;

export const getTeacherDropdownItemQuery = gql`
    query GetTeacherDropdownItem($id: ID!) {
        getTeacherById(query: {id: $id, showDeleted: false}) {
            id
            name: fullName
        }
    }
`;

export const getCategoryDropdownQuery = gql`
    query GetCategoryDropdown($page: Int, $size: Int, $name: String) {
        getCategoryList(query: {page: $page, size: $size, name: $name, showDeleted: false}) {
            size
            page
            skip
            totalPages
            totalElements
            responseList {
                id
                name
            }
        }
    }
`;

export const getCategoryDropdownItemQuery = gql`
    query GetCategoryDropdownItem($id: ID!) {
        getCategoryById(query: {id: $id, showDeleted: false}) {
            id
            name
        }
    }
`;

