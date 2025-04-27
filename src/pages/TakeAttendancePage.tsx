
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FingerprintScanner from "@/components/FingerprintScanner";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { toast } from "sonner";

const TakeAttendancePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { currentClass, updateStudentStatus } = useAttendance();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scanningComplete, setScanningComplete] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (!user?.isTeacher) {
      toast.error("Only teachers can take attendance");
      navigate("/dashboard");
    }
    
    if (!currentClass) {
      toast.error("Please select a class first");
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, currentClass, navigate]);
  
  const students = currentClass?.students || [];
  const currentStudent = students[currentIndex];
  
  const handleFingerprintSuccess = () => {
    if (!currentStudent) return;
    
    updateStudentStatus(currentStudent.id, "present");
    
    if (currentIndex < students.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 1000);
    } else {
      setScanningComplete(true);
      toast.success("Attendance completed for all students!");
    }
  };
  
  const handleFingerprintError = () => {
    if (!currentStudent) return;
    
    updateStudentStatus(currentStudent.id, "absent");
    
    if (currentIndex < students.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 1000);
    } else {
      setScanningComplete(true);
      toast.success("Attendance completed for all students!");
    }
  };
  
  const handleManualStatus = (status: "present" | "absent" | "late") => {
    if (!currentStudent) return;
    
    updateStudentStatus(currentStudent.id, status);
    
    if (currentIndex < students.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setScanningComplete(true);
      toast.success("Attendance completed for all students!");
    }
  };
  
  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  if (!currentClass) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Take Attendance</h1>
            <p className="text-muted-foreground mt-1">
              {currentClass.name}
            </p>
          </div>
          <Button variant="outline" onClick={handleReturnToDashboard}>
            Back to Dashboard
          </Button>
        </div>

        {scanningComplete ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Attendance Complete!</h2>
            <p className="mb-6 text-muted-foreground">
              You have successfully recorded attendance for all students.
            </p>
            <Button onClick={handleReturnToDashboard}>
              Return to Dashboard
            </Button>
          </div>
        ) : currentStudent ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {currentStudent.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Student ID: {currentStudent.id}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Student {currentIndex + 1} of {students.length}
                </p>
              </div>
              
              <FingerprintScanner
                onSuccess={handleFingerprintSuccess}
                onError={handleFingerprintError}
              />
              
              <div className="mt-8">
                <p className="text-sm text-center mb-4 text-muted-foreground">
                  Or manually mark attendance:
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="border-attendance-present text-attendance-present"
                    onClick={() => handleManualStatus("present")}
                  >
                    Present
                  </Button>
                  <Button
                    variant="outline"
                    className="border-attendance-late text-attendance-late"
                    onClick={() => handleManualStatus("late")}
                  >
                    Late
                  </Button>
                  <Button
                    variant="outline"
                    className="border-attendance-absent text-attendance-absent"
                    onClick={() => handleManualStatus("absent")}
                  >
                    Absent
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default TakeAttendancePage;
