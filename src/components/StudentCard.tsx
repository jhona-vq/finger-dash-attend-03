
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pen, Eye } from "lucide-react";
import { Student, AttendanceStatus } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface StudentCardProps {
  student: Student;
  onStatusChange: (id: string, status: AttendanceStatus) => void;
}

const StudentCard = ({ student, onStatusChange }: StudentCardProps) => {
  const { user } = useAuth();
  const isTeacher = user?.isTeacher || false;

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <span className="attendance-badge-present">Present</span>;
      case "absent":
        return <span className="attendance-badge-absent">Absent</span>;
      case "late":
        return <span className="attendance-badge-late">Late</span>;
      default:
        return <span className="attendance-badge-present">Present</span>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{student.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {student.id}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge(student.status)}
            
            {isTeacher ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pen className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onStatusChange(student.id, "present")}>
                    Mark Present
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(student.id, "absent")}>
                    Mark Absent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(student.id, "late")}>
                    Mark Late
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
