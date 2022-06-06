import {gql} from 'apollo-angular';

export const getNotificationConfigQuery = gql`
    query GetNotificationConfig {
        getNotificationConfig {
            adminEmails
            attestationYearsPeriod
            isNotifyAdmins
            isNotifyTeachers
            notifyBeforeDays
            notifyDay
            notifyTime
            notifyType
            requiredInternshipHours
        }
    }
`;

export const updateNotificationConfigQuery = gql`
    mutation UpdateNotificationConfig($body: NotificationUpdateRequest!) {
        updateNotificationConfig(body: $body) {
            adminEmails
            attestationYearsPeriod
            isNotifyAdmins
            isNotifyTeachers
            notifyBeforeDays
            notifyDay
            notifyTime
            notifyType
            requiredInternshipHours
        }
    }
`;

export const getTeachersToNotifyQuery = gql`
    query GetTeachersToNotify {
        getTeachersToNotify {
            teacher {
                name
                id
                email
            }
            nextAttestationDate
            lastAttestationDate
            internshipHours
        }
    }
`;

export const triggerNotifyQuery = gql`
    mutation TriggerNotification {
        triggerNotification {
            result
        }
    }
`;
