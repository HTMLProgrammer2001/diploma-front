export interface ITeacherDetailsViewState {
  restoring: boolean;
  isNotFound: boolean;
  panels: {
    personal: boolean;
    professional: boolean;
    attestations: boolean;
    internships: boolean;
    publications: boolean;
    honors: boolean;
    rebukes: boolean;
    educations: boolean;
  };
}
