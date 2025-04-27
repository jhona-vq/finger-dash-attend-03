
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FingerprintScanner from "./FingerprintScanner";

interface FingerprintRegistrationProps {
  onRegisterSuccess: () => void;
}

const FingerprintRegistration = ({ onRegisterSuccess }: FingerprintRegistrationProps) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleStartRegistration = () => {
    setIsRegistering(true);
  };

  const handleSuccess = () => {
    toast.success("Fingerprint registered successfully");
    onRegisterSuccess();
    setIsRegistering(false);
  };

  const handleError = () => {
    toast.error("Failed to register fingerprint. Please try again.");
    setIsRegistering(false);
  };

  if (!isRegistering) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleStartRegistration}>
          Register Fingerprint
        </Button>
        <p className="text-sm text-muted-foreground">
          You'll need to scan your fingerprint to complete registration
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <FingerprintScanner onSuccess={handleSuccess} onError={handleError} />
      <Button variant="outline" onClick={() => setIsRegistering(false)}>
        Cancel
      </Button>
    </div>
  );
};

export default FingerprintRegistration;
