
import { createContext, useContext, useState, ReactNode } from "react";
import { Student, AttendanceStatus, Class } from "@/types";
import { toast } from "sonner";

// Sample data for demo
const DEMO_CLASSES: Class[] = [
  {
    id: "1",
    name: "Computer Science 101",
    students: [
      { id: "s1", name: "Alex Johnson", status: "present" },
      { id: "s2", name: "Maria Garcia", status: "absent" },
      { id: "s3", name: "James Wilson", status: "present" },
      { id: "s4", name: "Emma Brown", status: "late" },
      { id: "s5", name: "Michael Davis", status: "present" },
      { id: "s6", name: "Sophia Martinez", status: "present" },
      { id: "s7", name: "Daniel Lee", status: "absent" },
      { id: "s8", name: "Olivia Miller", status: "present" },
    ]
  },
  {
    id: "2",
    name: "Mathematics 202",
    students: [
      { id: "s9", name: "William Moore", status: "present" },
      { id: "s10", name: "Ava Taylor", status: "present" },
      { id: "s11", name: "Ethan Anderson", status: "late" },
      { id: "s12", name: "Charlotte Thomas", status: "absent" },
    ]
  }
];

interface AttendanceContextType {
  classes: Class[];
  currentClass: Class | null;
  setCurrentClass: (classId: string) => void;
  updateStudentStatus: (studentId: string, status: AttendanceStatus) => void;
  getStatistics: (classId?: string) => {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<Class[]>(DEMO_CLASSES);
  const [currentClassId, setCurrentClassId] = useState<string | null>(DEMO_CLASSES[0]?.id || null);

  const currentClass = classes.find(c => c.id === currentClassId) || null;

  const setCurrentClass = (classId: string) => {
    setCurrentClassId(classId);
  };

  const updateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    if (!currentClassId) return;

    setClasses(prevClasses => 
      prevClasses.map(cls => {
        if (cls.id === currentClassId) {
          return {
            ...cls,
            students: cls.students.map(student => 
              student.id === studentId ? { ...student, status } : student
            )
          };
        }
        return cls;
      })
    );

    const student = currentClass?.students.find(s => s.id === studentId);
    if (student) {
      toast.success(`${student.name} marked as ${status}`);
    }
  };

  const getStatistics = (classId?: string) => {
    const targetClass = classId 
      ? classes.find(c => c.id === classId) 
      : currentClass;
    
    if (!targetClass) {
      return { present: 0, absent: 0, late: 0, total: 0 };
    }

    const students = targetClass.students;
    const present = students.filter(s => s.status === "present").length;
    const absent = students.filter(s => s.status === "absent").length;
    const late = students.filter(s => s.status === "late").length;
    
    return {
      present,
      absent,
      late,
      total: students.length
    };
  };

  return (
    <AttendanceContext.Provider
      value={{
        classes,
        currentClass,
        setCurrentClass,
        updateStudentStatus,
        getStatistics
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}
