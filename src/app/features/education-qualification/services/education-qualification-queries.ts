import {gql} from 'apollo-angular';

export const getEducationQualificationListQuery = gql`
    query GetEducationQualificationList($query: EducationQualificationGetListRequest!) {
        getEducationQualificationList(query: $query) {
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

export const getEducationQualificationByIdQuery = gql`
    query GetEducationQualificationById($id: ID!) {
        getEducationQualificationById(query: {id: $id, showDeleted: true}) {
            id
            name
            isDeleted
            guid
        }
    }
`;

export const createEducationQualificationQuery = gql`
    mutation CreateEducationQualification($body: EducationQualificationCreateRequest!) {
        createEducationQualification(body: $body) {
            id
        }
    }
`;

export const updateEducationQualificationQuery = gql`
    mutation UpdateEducationQualification($body: EducationQualificationUpdateRequest!) {
        updateEducationQualification(body: $body) {
            id
            guid
            isDeleted
            name
        }
    }
`;

export const deleteEducationQualificationQuery = gql`
    mutation DeleteEducationQualification($id: ID!, $guid: String!) {
        deleteEducationQualification(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getEducationQualificationEducationsListQuery = gql`
    query getEducationQualificationEducationsList($query: EducationGetListRequest!) {
        getEducationList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                specialty
                institution
                yearOfIssue
                teacher {
                    id
                    name
                }
            }
        }
    }
`;
