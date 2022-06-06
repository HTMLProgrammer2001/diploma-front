export interface INotificationTeacherModel {
  teacher: {
    id: number;
    name: string;
    email: string;
  };
  internshipHours: number;
  lastAttestationDate: string;
  nextAttestationDate: string;
}
