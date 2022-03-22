import {gql} from 'apollo-angular';

export const getCategoryListQuery = gql`
    query GetCategoryList($query: CategoryGetListRequest!) {
        getCategoryList(query: $query) {
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

export const getCategoryByIdQuery = gql`
    query GetCategoryById($id: ID!) {
        getCategoryById(query: {id: $id, showDeleted: true}) {
            id
            name
            isDeleted
            guid
        }
    }
`;

export const createCategoryQuery = gql`
    mutation CreateCategory($body: CategoryCreateRequest!) {
        createCategory(body: $body) {
            id
        }
    }
`;

export const updateCategoryQuery = gql`
    mutation UpdateCategory($body: CategoryUpdateRequest!) {
        updateCategory(body: $body) {
            id
            guid
            isDeleted
            name
        }
    }
`;

export const deleteCategoryQuery = gql`
    mutation DeleteCategory($id: ID!, $guid: String!) {
        deleteCategory(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getCategoryAttestationsListQuery = gql`
    query GetCategoryAttestationsList($query: AttestationGetListRequest!) {
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
                date
            }
        }
    }
`;
