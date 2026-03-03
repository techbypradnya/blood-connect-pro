import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type Status = "loading" | "success" | "error";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the URL.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed.");
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (err: unknown) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground text-lg">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-14 w-14 text-green-500" />
              <h2 className="text-xl font-semibold text-foreground">Verified!</h2>
              <p className="text-muted-foreground">{message}</p>
              <Button className="mt-2" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-14 w-14 text-destructive" />
              <h2 className="text-xl font-semibold text-foreground">Verification Failed</h2>
              <p className="text-muted-foreground">{message}</p>
              <Button variant="outline" className="mt-2" onClick={() => navigate("/login")}>
                Back to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
