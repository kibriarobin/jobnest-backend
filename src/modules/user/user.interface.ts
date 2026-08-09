export type TUpdateBasicInfo = {
  name?: string;
  profilePhoto?: string;
};

export type TUpdateCandidateProfile = {
  resumeUrl?: string;
  skills?: string[];
  experience?: string;
  bio?: string;
};

export type TUpdateCompanyProfile = {
  name?: string;
  logo?: string;
  description?: string;
  website?: string;
};
