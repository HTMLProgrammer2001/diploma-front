import {gql} from 'apollo-angular';

export const getRebukeListQuery = gql`
    query GetRebukeList($query: RebukeGetListRequest!) {
        getRebukeList(query: $query) {
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

export const getRebukeByIdQuery = gql`
    query GetRebukeById($id: ID!) {
        getRebukeById(query: {id: $id, showDeleted: true}) {
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

export const createRebukeQuery = gql`
    mutation CreateRebuke($body: RebukeCreateRequest!) {
        createRebuke(body: $body) {
            id
        }
    }
`;

export const updateRebukeQuery = gql`
    mutation UpdateRebuke($body: RebukeUpdateRequest!) {
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

export const deleteRebukeQuery = gql`
    mutation DeleteRebuke($id: ID!, $guid: String!) {
        deleteRebuke(id: $id, guid: $guid) {
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
