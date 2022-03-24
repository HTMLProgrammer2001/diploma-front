import {gql} from 'apollo-angular';

export const getInternshipListQuery = gql`
    query GetInternshipList($query: InternshipGetListRequest!) {
        getInternshipList(query: $query) {
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
                hours
                title
                place
                from
                to
                code
            }
        }
    }
`;

export const getInternshipByIdQuery = gql`
    query GetInternshipById($id: ID!) {
        getInternshipById(query: {id: $id, showDeleted: true}) {
            id
            teacher {
                id
                name
            }
            description
            place
            code
            from
            to
            hours
            title
            credits
            isDeleted
            guid
        }
    }
`;

export const createInternshipQuery = gql`
    mutation CreateInternship($body: InternshipCreateRequest!) {
        createInternship(body: $body) {
            id
        }
    }
`;

export const updateInternshipQuery = gql`
    mutation UpdateInternship($body: InternshipUpdateRequest!) {
        updateInternship(body: $body) {
            id
            teacher {
                id
                name
            }
            description
            place
            code
            title
            from
            to
            hours
            credits
            isDeleted
            guid
        }
    }
`;

export const deleteInternshipQuery = gql`
    mutation DeleteInternship($id: ID!, $guid: String!) {
        deleteInternship(id: $id, guid: $guid) {
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
