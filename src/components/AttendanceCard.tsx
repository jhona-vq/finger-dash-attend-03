
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AttendanceCardProps {
  title: string;
  value: number;
  total: number;
  variant?: "primary" | "present" | "absent" | "late";
  className?: string;
}

const AttendanceCard = ({
  title,
  value,
  total,
  variant = "primary",
  className,
}: AttendanceCardProps) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const getVariantStyles = () => {
    switch (variant) {
      case "present":
        return "text-attendance-present";
      case "absent":
        return "text-attendance-absent";
      case "late":
        return "text-attendance-late";
      default:
        return "text-attendance-primary";
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-2xl font-bold", getVariantStyles())}>
            {value}
          </span>
          <span className="text-sm text-muted-foreground">/ {total}</span>
          <span className="ml-auto text-sm font-medium">{percentage}%</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full", {
              "bg-attendance-present": variant === "present",
              "bg-attendance-absent": variant === "absent",
              "bg-attendance-late": variant === "late",
              "bg-attendance-primary": variant === "primary",
            })}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
