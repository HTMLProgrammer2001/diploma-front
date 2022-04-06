import {gql} from 'apollo-angular';

export const getUserListQuery = gql`
    query GetUserList($query: UserGetListRequest!) {
        getUserList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                fullName
                email
                role {
                    id
                    name
                }
                isDeleted
            }
        }
    }
`;

export const getUserByIdQuery = gql`
    query GetUserById($id: ID!) {
        getUserById(query: {id: $id, showDeleted: true}) {
            id
            fullName
            role {
                id
                name
            }
            email
            phone
            avatarUrl
            isDeleted
            guid
        }
    }
`;

export const createUserQuery = gql`
    mutation CreateUser($body: UserCreateRequest!) {
        createUser(body: $body) {
            id
        }
    }
`;

export const updateUserQuery = gql`
    mutation UpdateUser($body: UserUpdateRequest!) {
        updateUser(body: $body) {
            id
            fullName
            role {
                id
                name
            }
            email
            phone
            avatarUrl
            isDeleted
            guid
        }
    }
`;

export const deleteUserQuery = gql`
    mutation DeleteUser($id: ID!, $guid: String!) {
        deleteUser(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getRoleListDropdownQuery = gql`
    query GetRoleListDropdown($page: Int, $size: Int, $name: String) {
        getRoleList(query: {name: $name, page: $page, size: $size}) {
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

export const getRoleDropdownItemQuery = gql`
    query GetRoleDropdownItem($id: ID!) {
        getRoleById(query: {id: $id}) {
            id
            name
        }
    }
`;
