import {gql} from 'apollo-angular';

export const getHonorListQuery = gql`
    query GetHonorList($query: HonorGetListRequest!) {
        getHonorList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                isDeleted
                teacher {
                    id
                    name
                }
                title
                orderNumber
                isDeleted
                isActive
                date
            }
        }
    }
`;

export const getHonorByIdQuery = gql`
    query GetHonorById($id: ID!) {
        getHonorById(query: {id: $id, showDeleted: true}) {
            id
            date
            isActive
            orderNumber
            title
            teacher {
                id
                name
            }
            description
            isDeleted
            guid
        }
    }
`;

export const createHonorQuery = gql`
    mutation CreateHonor($body: HonorCreateRequest!) {
        createHonor(body: $body) {
            id
        }
    }
`;

export const updateHonorQuery = gql`
    mutation UpdateHonor($body: HonorUpdateRequest!) {
        updateHonor(body: $body) {
            id
            date
            isActive
            orderNumber
            title
            teacher {
                id
                name
            }
            description
            isDeleted
            guid
        }
    }
`;

export const deleteHonorQuery = gql`
    mutation DeleteHonor($id: ID!, $guid: String!) {
        deleteHonor(id: $id, guid: $guid) {
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
