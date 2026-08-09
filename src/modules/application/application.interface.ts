export type TCreateApplication = {
  jobId: string;
  resumeUrl: string;
  coverLetter?: string;
};

export type TUpdateApplicationStatus = {
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'HIRED' | 'REJECTED';
};