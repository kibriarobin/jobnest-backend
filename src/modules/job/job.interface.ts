export type TCreateJob = {
  categoryId: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'REMOTE' | 'ONSITE' | 'HYBRID';
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel: string;
  vacancy?: number;
  deadline: string;
};

export type TJobFilters = {
  searchTerm?: string;
  category?: string;
  location?: string;
  type?: string;
  minSalary?: string;
  maxSalary?: string;
};