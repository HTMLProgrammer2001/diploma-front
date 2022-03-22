import {gql} from 'apollo-angular';

export const getTeacherListQuery = gql`
    query GetTeacherList($query: TeacherGetListRequest!) {
        getTeacherList(query: $query) {
            size
            page
            skip
            totalElements
            totalPages
            responseList {
                id
                isDeleted
                fullName
                email
                department {
                    id
                    name
                }
                commission {
                    id
                    name
                }
                academicTitle {
                    id
                    name
                }
                academicDegree {
                    id
                    name
                }
                teacherRank {
                    id
                    name
                }
            }
        }
    }
`;

export const getTeacherByIdQuery = gql`
    query GetTeacherById($id: ID!) {
        getTeacherById(query: {id: $id, showDeleted: true}) {
            id
            fullName
            email
            avatarUrl
            academicDegree {
                id
                name
            }
            academicTitle {
                id
                name
            }
            address
            birthday
            phone
            commission {
                id
                name
            }
            department {
                id
                name
            }
            teacherRank {
                id
                name
            }
            workStartDate
            isDeleted
            guid
        }
    }
`;

export const createTeacherQuery = gql`
    mutation CreateTeacher($body: TeacherCreateRequest!) {
        createTeacher(body: $body) {
            id
        }
    }
`;

export const updateTeacherQuery = gql`
    mutation UpdateTeacher($body: TeacherUpdateRequest!) {
        updateTeacher(body: $body) {
            id
            fullName
            email
            avatarUrl
            academicDegree {
                id
                name
            }
            academicTitle {
                id
                name
            }
            address
            birthday
            phone
            commission {
                id
                name
            }
            department {
                id
                name
            }
            teacherRank {
                id
                name
            }
            workStartDate
            isDeleted
            guid
        }
    }
`;

export const deleteTeacherQuery = gql`
    mutation DeleteTeacher($id: ID!, $guid: String!) {
        deleteTeacher(id: $id, guid: $guid) {
            id
        }
    }
`;

export const getCommissionDropdownQuery = gql`
    query GetCommissionDropdown($page: Int, $size: Int, $name: String) {
        getCommissionsList(query: {page: $page, size: $size, name: $name, showDeleted: false}) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                name
            }
        }
    }
`;

export const getCommissionDropdownItemQuery = gql`
    query GetCommissionDropdownItem($id: ID!) {
        getCommissionById(query: {id: $id, showDeleted: true}) {
            id
            name
        }
    }
`;

export const getDepartmentDropdownQuery = gql`
    query GetDepartmentDropdown($page: Int, $size: Int, $name: String) {
        getDepartmentsList(query: {page: $page, size: $size, name: $name, showDeleted: false}) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                name
            }
        }
    }
`;

export const getDepartmentDropdownItemQuery = gql`
    query GetDepartmentDropdownItem($id: ID!) {
        getDepartmentById(query: {id: $id, showDeleted: true}) {
            id
            name
        }
    }
`;

export const getTeachingRankDropdownQuery = gql`
    query GetTeachingRankDropdown($page: Int, $size: Int, $name: String) {
        getTeachingRankList(query: {page: $page, size: $size, name: $name, showDeleted: false}) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                name
            }
        }
    }
`;

export const getTeachingRankDropdownItemQuery = gql`
    query GetTeachingRankDropdownItem($id: ID!) {
        getTeachingRankById(query: {id: $id, showDeleted: true}) {
            id
            name
        }
    }
`;

export const getAcademicDegreeDropdownQuery = gql`
    query GetAcademicDegreeDropdown($page: Int, $size: Int, $name: String) {
        getAcademicDegreeList(query: {page: $page, size: $size, name: $name, showDeleted: false}) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                name
            }
        }
    }
`;

export const getAcademicDegreeDropdownItemQuery = gql`
    query GetAcademicDegreeDropdownItem($id: ID!) {
        getAcademicDegreeById(query: {id: $id, showDeleted: true}) {
            id
            name
        }
    }
`;

export const getAcademicTitleDropdownItemQuery = gql`
    query GetAcademicTitleDropdownItem($id: ID!) {
        getAcademicTitleById(query: {id: $id, showDeleted: true}) {
            id
            name
        }
    }
`;

export const getAcademicTitleDropdownQuery = gql`
    query GetAcademicTitleDropdown($page: Int, $size: Int, $name: String) {
        getAcademicTitleList(query: {page: $page, size: $size, name: $name, showDeleted: false}) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                name
            }
        }
    }
`;

export const getTeacherAttestationListQuery = gql`
    query GetTeacherAttestationList($query: AttestationGetListRequest!, $teacherId: ID!) {
        attestationList: getAttestationList(query: $query) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                category {
                    id
                    name
                }
                date
            }
        }
        
        attestationDates: getLastAttestationDate(query: {teacherId: $teacherId}) {
            lastAttestationDate
            nextAttestationDate
        }
    }
`;

export const getTeacherHonorListQuery = gql`
    query GetTeacherHonorList($query: HonorGetListRequest!) {
        getHonorList(query: $query) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                title
                orderNumber
                date
                isActive
            }
        }
    }
`;

export const getTeacherRebukeListQuery = gql`
    query GetTeacherRebukeList($query: RebukeGetListRequest!) {
        getRebukeList(query: $query) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                title
                orderNumber
                date
                isActive
            }
        }
    }
`;

export const getTeacherEducationListQuery = gql`
    query GetTeacherEducationList($query: EducationGetListRequest!) {
        getEducationList(query: $query) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                educationQualification {
                    id
                    name
                }
                institution
                specialty
                yearOfIssue
            }
        }
    }
`;

export const getTeacherInternshipListQuery = gql`
    query GetTeacherInternshipList($query: InternshipGetListRequest!, $teacherId: ID!) {
        internshipList: getInternshipList(query: $query) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                title
                place
                hours
                credits
                from
                to
            }
        }
        
        hoursFromLastAttestation: getInternshipHoursFromLastAttestation(query: {teacherId: $teacherId}) {
            hours
        }
    }
`;

export const getTeacherPublicationListQuery = gql`
    query GetTeacherPublicationList($query: PublicationGetListRequest!) {
        getPublicationList(query: $query) {
            size
            page
            totalPages
            totalElements
            skip
            responseList {
                id
                title
                date
            }
        }
    }
`;
