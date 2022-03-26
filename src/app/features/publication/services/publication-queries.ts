import {gql} from 'apollo-angular';

export const getPublicationListQuery = gql`
    query GetPublicationList($query: PublicationGetListRequest!) {
        getPublicationList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                title
                date
                anotherAuthors
                teachers {
                    id
                    name
                }
                isDeleted
            }
        }
    }
`;

export const getPublicationByIdQuery = gql`
    query GetPublicationById($id: ID!) {
        getPublicationById(query: {id: $id, showDeleted: true}) {
            id
            teachers {
                id
                name
            }
            anotherAuthors
            url
            title
            description
            date
            isDeleted
            guid
        }
    }
`;

export const createPublicationQuery = gql`
    mutation CreatePublication($body: PublicationCreateRequest!) {
        createPublication(body: $body) {
            id
        }
    }
`;

export const updatePublicationQuery = gql`
    mutation UpdatePublication($body: PublicationUpdateRequest!) {
        updatePublication(body: $body) {
            id
            teachers {
                id
                name
            }
            anotherAuthors
            url
            title
            description
            date
            isDeleted
            guid
        }
    }
`;

export const deletePublicationQuery = gql`
    mutation DeletePublication($id: ID!, $guid: String!) {
        deletePublication(id: $id, guid: $guid) {
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

export const getTeacherDropdownItemsQuery = gql`
    query GetTeacherDropdownItems($ids: [ID!]) {
        getTeachersByIds(query: {ids: $ids}) {
            id
            name: fullName
        }
    }
`;
