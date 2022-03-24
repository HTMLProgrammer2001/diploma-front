import {gql} from 'apollo-angular';

export const getEducationListQuery = gql`
    query GetEducationList($query: EducationGetListRequest!) {
        getEducationList(query: $query) {
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
                yearOfIssue
                institution
                specialty
                educationQualification {
                    name
                    id
                }
            }
        }
    }
`;

export const getEducationByIdQuery = gql`
    query GetEducationById($id: ID!) {
        getEducationById(query: {id: $id, showDeleted: true}) {
            id
            specialty
            institution
            yearOfIssue
            educationQualification {
                id
                name
            }
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

export const createEducationQuery = gql`
    mutation CreateEducation($body: EducationCreateRequest!) {
        createEducation(body: $body) {
            id
        }
    }
`;

export const updateEducationQuery = gql`
    mutation UpdateEducation($body: EducationUpdateRequest!) {
        updateEducation(body: $body) {
            id
            specialty
            institution
            yearOfIssue
            educationQualification {
                id
                name
            }
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

export const deleteEducationQuery = gql`
    mutation DeleteEducation($id: ID!, $guid: String!) {
        deleteEducation(id: $id, guid: $guid) {
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

export const getEducationQualificationDropdownQuery = gql`
    query GetEducationQualificationDropdown($page: Int, $size: Int, $name: String) {
        getEducationQualificationList(query: {page: $page, size: $size, name: $name, showDeleted: false}) {
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

export const getEducationQualificationDropdownItemQuery = gql`
    query GetEducationQualificationDropdownItem($id: ID!) {
        getEducationQualificationById(query: {id: $id, showDeleted: false}) {
            id
            name
        }
    }
`;
