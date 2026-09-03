export interface ResourceItem {
  id: string;
  title: string;
  category: "Fieldwork" | "Syllabus" | "Guidelines" | "Templates";
  description: string;
  fileSize: string;
  downloadUrl: string;
}

export const STUDENT_RESOURCES: ResourceItem[] = [
  {
    id: "fw-log-sheet",
    title: "Concurrent Fieldwork Daily Log Sheet",
    category: "Fieldwork",
    description: "Standard daily attendance and time-log sheet for concurrent agency placements.",
    fileSize: "145 KB",
    downloadUrl: "#",
  },
  {
    id: "fw-process-record",
    title: "Casework & Group Work Process Record Template",
    category: "Templates",
    description: "Official verbatim recording and interaction analysis framework for client sessions.",
    fileSize: "210 KB",
    downloadUrl: "#",
  },
  {
    id: "bsw-syllabus",
    title: "BSW Course Structure & Academic Syllabus",
    category: "Syllabus",
    description: "Complete 3-year curriculum breakdown, credit distribution, and exam regulations.",
    fileSize: "1.2 MB",
    downloadUrl: "#",
  },
  {
    id: "fw-manual",
    title: "Fieldwork Manual & Professional Code of Ethics",
    category: "Guidelines",
    description: "Department code of conduct, supervisor evaluation criteria, and agency ethics rules.",
    fileSize: "480 KB",
    downloadUrl: "#",
  },
  {
    id: "rural-camp-guidelines",
    title: "Rural Educational Camp Guidelines & Report Format",
    category: "Guidelines",
    description: "Preparation checklist, community assessment methods, and post-camp documentation rubric.",
    fileSize: "320 KB",
    downloadUrl: "#",
  },
];