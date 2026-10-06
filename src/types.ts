export type JobCategory = 
  | 'Warehouse & Logistics'
  | 'Construction & Engineering'
  | 'Security Services'
  | 'Hospitality & Catering'
  | 'Manufacturing & Factory'
  | 'Agriculture & Farming'
  | 'Cleaning & Facility';

export type DestinationCountry = 
  | 'Greece'
  | 'Malaysia'
  | 'UAE'
  | 'Poland'
  | 'Saudi Arabia'
  | 'Qatar'
  | 'Japan'
  | 'Croatia';

export interface Vacancy {
  id: string;
  title: string;
  companyName: string;
  country: DestinationCountry;
  countryCode: string; // e.g. 'GR', 'MY', 'AE'
  city: string;
  category: JobCategory;
  salaryMonthly: string;
  salaryNPRApprox: string;
  dutyHours: string;
  overtime: string;
  contractPeriod: string;
  foodAccommodation: string;
  vacancyCount: number;
  appliedCount: number;
  deadline: string;
  isUrgent?: boolean;
  featured?: boolean;
  posterImage: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'closed' | 'interviewing';
  createdAt: string;
}

export type ApplicationStatus = 
  | 'Pending'
  | 'Under Review'
  | 'Interview Scheduled'
  | 'Interviewed'
  | 'Selected'
  | 'Visa Processing'
  | 'Rejected';

export interface CandidateApplication {
  id: string;
  applicationCode: string;
  jobId: string;
  jobTitle: string;
  country: string;
  fullName: string;
  phone: string;
  passportNumber: string;
  passportExpiry?: string;
  email?: string;
  currentAddress: string;
  dateOfBirth?: string;
  gender: 'Male' | 'Female' | 'Other';
  documents: {
    passportFrontUrl?: string;
    passportBackUrl?: string;
    photoUrl?: string;
    experienceCertUrl?: string;
  };
  notes?: string;
  status: ApplicationStatus;
  appliedDate: string;
  interviewDate?: string;
  adminRemarks?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'staff' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  applicantPhone?: string;
}

export type UserRole = 'client' | 'admin';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  phoneOrEmail: string;
  passportNumber?: string;
  officeBranch?: string;
  createdAt: string;
}
