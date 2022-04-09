import {gql} from 'apollo-angular';

export const getImportTypeDropdownListQuery = gql`
    query GetImportTypeDropdownList($page: Int!, $size: Int!, $name: String!) {
        getImportTypeList(query: {size: $size, page: $page, name: $name}) {
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

export const getImportDropdownItemQuery = gql`
    query GetImportDropdownItem($id: ID!) {
        getImportTypeById(query: {id: $id}) {
            id
            name
        }
    }
`;

export const generateImportTemplateQuery = gql`
    mutation GenerateImportTemplate($type: Int!) {
        generateImportTemplate(body: {type: $type}) {
            url
        }   
    }
`;

export const importQuery = gql`
    mutation Import($body: ImportRequest!) {
        importData(body: $body) {
            errors {
                message
                property
                row
            }
            result
        }
    }
`;
