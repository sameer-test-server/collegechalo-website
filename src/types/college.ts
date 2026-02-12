// types/college.ts
export interface College {
  id: string;
  name: string;
  location: string;
  founded: number;
  ranking: number;
  fees: number;
  placement_rate: number;
  description: string;
  courses: string[];
  reviews_count: number;
  rating: number;
  image_url: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  board: string;
  score: number;
  preferences: string[];
  applications: Application[];
  created_at: Date;
}

export interface Application {
  id: string;
  student_id: string;
  college_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'waitlisted';
  applied_date: Date;
  response_date?: Date;
}

export interface Review {
  id: string;
  college_id: string;
  student_id: string;
  rating: number;
  title: string;
  content: string;
  created_at: Date;
}
