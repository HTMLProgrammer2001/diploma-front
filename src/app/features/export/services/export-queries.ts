import {gql} from 'apollo-angular';

export const getExportCommissionDropdownListQuery = gql`
    query GetExportCommissionDropdownList($page: Int!, $size: Int!, $name: String!) {
        getCommissionsList(query: {size: $size, page: $page, name: $name}) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                name
            }
        }
    }
`;

export const getExportCommissionDropdownItemQuery = gql`
    query GetExportCommissionDropdownItem($id: ID!) {
        getCommissionById(query: {id: $id, showDeleted: false}) {
            id
            name
        }
    }
`;

export const getExportDepartmentDropdownListQuery = gql`
    query GetExportDepartmentDropdownList($page: Int!, $size: Int!, $name: String!) {
        getDepartmentsList(query: {page: $page, size: $size, name: $name}) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                name
            }
        }
    }
`;

export const getExportDepartmentDropdownItemQuery = gql`
    query GetExportDepartmentDropdownItem($id: ID!) {
        getDepartmentById(query: {id: $id, showDeleted: false}) {
            id
            name
        }
    }
`;

export const getExportTeacherDropdownListQuery = gql`
    query GetExportTeacherDropdownList($page: Int!, $size: Int!, $name: String!) {
        getTeacherList(query: {size: $size, page: $page, fullName: $name}) {
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

export const getExportTeacherDropdownItemsQuery = gql`
    query GetExportTeacherDropdownItems($ids: [ID!]!) {
        getTeachersByIds(query: {ids: $ids}) {
            id
            name: fullName
        }
    }
`;

export const getExportTypesQuery = gql`
    query GetExportTypes($query: ExportTypeGetListRequest!) {
        getExportTypeList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                name
            }
        }
    }
`;

export const generateReportQuery = gql`
    mutation GenerateReport($body: ExportRequest!) {
        generateReport(body: $body) {
            url
        }
    }
`;
