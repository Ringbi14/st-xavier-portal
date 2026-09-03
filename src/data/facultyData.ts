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

export const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: "fac-1",
    name: "Dr. L. Timothy",
    designation: "Assistant Professor & Head of Department",
    qualification: "MSW, Ph.D., UGC-NET",
    specialization: "Community Development & Tribal Studies",
    email: "hod.socialwork@stxaviers.edu.in",
    officeRoom: "Academic Block A, Room 204",
  },
  {
    id: "fac-2",
    name: "Prof. Mary Grace",
    designation: "Assistant Professor & Fieldwork Coordinator",
    qualification: "MSW (Medical & Psychiatric), M.Phil",
    specialization: "Mental Health & Fieldwork Practicum Supervision",
    email: "fieldwork.sw@stxaviers.edu.in",
    officeRoom: "Academic Block A, Room 206",
  },
  {
    id: "fac-3",
    name: "Prof. K. John Vianney",
    designation: "Assistant Professor",
    qualification: "MSW (HRM), UGC-NET",
    specialization: "Human Resource Management & Social Policy",
    email: "john.sw@stxaviers.edu.in",
    officeRoom: "Academic Block A, Room 207",
  },
];