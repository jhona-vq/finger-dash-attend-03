
export type AttendanceStatus = "present" | "absent" | "late";

export interface Student {
  id: string;
  name: string;
  status: AttendanceStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isTeacher: boolean;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  studentId: string;
  status: AttendanceStatus;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, isTeacher: boolean) => Promise<void>;
  logout: () => void;
  authenticateWithFingerprint: () => Promise<void>;
}
