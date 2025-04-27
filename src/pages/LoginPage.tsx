import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Fingerprint } from "lucide-react";
import FingerprintScanner from "@/components/FingerprintScanner";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import FingerprintRegistration from "@/components/FingerprintRegistration";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isTeacher: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFingerprint, setShowFingerprint] = useState(false);
  const [fingerprintRegistered, setFingerprintRegistered] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(loginData.email, loginData.password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword ||
      !fingerprintRegistered
    ) {
      toast.error("Please complete all steps including fingerprint registration");
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(
        registerData.name, 
        registerData.email, 
        registerData.password,
        registerData.isTeacher
      );
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFingerprintLogin = () => {
    setShowFingerprint(true);
  };

  const handleFingerprintSuccess = () => {
    // In a real app, this would authenticate using the fingerprint
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const handleFingerprintError = () => {
    toast.error("Fingerprint authentication failed");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-md mx-auto flex flex-col justify-center flex-1 px-4 py-12">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-attendance-background mb-4">
            <Fingerprint size={32} className="text-attendance-primary" />
          </div>
          <h1 className="text-2xl font-bold">Attendance Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student attendance with ease
          </p>
        </div>

        {showFingerprint ? (
          <Card>
            <CardHeader>
              <CardTitle>Fingerprint Authentication</CardTitle>
              <CardDescription>
                Scan your fingerprint to log in
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <FingerprintScanner 
                onSuccess={handleFingerprintSuccess} 
                onError={handleFingerprintError} 
              />
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowFingerprint(false)}
              >
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <form onSubmit={handleLoginSubmit}>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="teacher@example.com"
                        value={loginData.email}
                        onChange={(e) => 
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Logging in..." : "Log in"}
                    </Button>
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleFingerprintLogin}
                    >
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Log in with Fingerprint
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <form onSubmit={handleRegisterSubmit}>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                      Create a new account to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="john@example.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is-teacher"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={registerData.isTeacher}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            isTeacher: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="is-teacher">Register as Teacher</Label>
                    </div>
                    
                    <div className="space-y-4">
                      <FingerprintRegistration 
                        onRegisterSuccess={() => setFingerprintRegistered(true)} 
                      />
                      {fingerprintRegistered && (
                        <p className="text-sm text-green-600 text-center">
                          ✓ Fingerprint registered successfully
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting || !fingerprintRegistered}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo credentials:</p>
          <p>Teacher - teacher@example.com (any password)</p>
          <p>Student - student@example.com (any password)</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
