export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  phone?: string;
  officeRoom?: string;
  image?: string;
}

export const INITIAL_FACULTY: FacultyMember[] = [];