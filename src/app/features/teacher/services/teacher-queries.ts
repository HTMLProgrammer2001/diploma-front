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
                    name
                }
                commission {
                    name
                }
                academicTitle {
                    name
                }
                academicDegree {
                    name
                }
                teacherRank {
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

export const getCommissionDropdown = gql`
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

export const getDepartmentDropdown = gql`
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

export const getTeachingRankDropdown = gql`
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

export const getAcademicDegreeDropdown = gql`
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

export const getAcademicTitleDropdown = gql`
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

export const getTeacherAttestationList = gql`
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

export const getTeacherHonorList = gql`
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

export const getTeacherRebukeList = gql`
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

export const getTeacherEducationList = gql`
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
                    name
                }
                institution
                specialty
                yearOfIssue
            }
        }
    }
`;

export const getTeacherInternshipList = gql`
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

export const getTeacherPublicationList = gql`
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
