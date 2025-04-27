
import { Fingerprint } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FingerprintScannerProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const FingerprintScanner = ({
  onSuccess,
  onError,
}: FingerprintScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setError(false);
    setSuccess(false);

    // Simulate fingerprint scanning
    setTimeout(() => {
      setScanning(false);
      
      // Simulate success (80% of the time) or failure
      const isSuccessful = Math.random() > 0.2;
      
      if (isSuccessful) {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(true);
        onError?.();
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleScan}
        disabled={scanning}
        className={cn(
          "fingerprint-scanner w-24 h-24 md:w-32 md:h-32 cursor-pointer",
          {
            "fingerprint-animation": scanning,
            "bg-red-50": error,
            "bg-green-50": success,
          }
        )}
      >
        <Fingerprint
          size={64}
          className={cn({
            "text-slate-400": !scanning && !success && !error,
            "text-slate-600": scanning,
            "text-red-500": error,
            "text-green-500": success,
          })}
        />
      </button>
      <div className="text-center">
        {scanning ? (
          <p className="text-sm text-slate-600">Scanning...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Scan failed. Try again.</p>
        ) : success ? (
          <p className="text-sm text-green-500">Scan successful!</p>
        ) : (
          <p className="text-sm text-slate-500">Tap to scan fingerprint</p>
        )}
      </div>
    </div>
  );
};

export default FingerprintScanner;
