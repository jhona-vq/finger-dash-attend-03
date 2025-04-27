
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import AttendanceCard from "@/components/AttendanceCard";
import StudentCard from "@/components/StudentCard";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    classes, 
    currentClass, 
    setCurrentClass, 
    updateStudentStatus,
    getStatistics 
  } = useAttendance();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const stats = getStatistics();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage student attendance
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Class Selection</CardTitle>
              <CardDescription>
                Select a class to view and manage attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={currentClass?.id || ""}
                onValueChange={setCurrentClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          {currentClass && (
            <>
              <h2 className="text-xl font-semibold mt-2">
                {currentClass.name} - Attendance Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AttendanceCard
                  title="Present Students"
                  value={stats.present}
                  total={stats.total}
                  variant="present"
                />
                <AttendanceCard
                  title="Absent Students"
                  value={stats.absent}
                  total={stats.total}
                  variant="absent"
                />
                <AttendanceCard
                  title="Late Students"
                  value={stats.late}
                  total={stats.total}
                  variant="late"
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Student List</h2>
                  {user?.isTeacher && (
                    <Button onClick={() => navigate("/take-attendance")}>
                      Take Attendance
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentClass.students.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onStatusChange={updateStudentStatus}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
