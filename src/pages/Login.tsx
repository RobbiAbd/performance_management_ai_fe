import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { appConfig } from "@/lib/config";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const u = username.trim();
    const p = password;
    if (!u || !p) {
      setError("Username dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await login(u, p);
      if (res.status === "success" && res.data) {
        setAuth(res.data.access_token, res.data.user);
        navigate("/", { replace: true });
      } else {
        setError(res.message || "Login gagal.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Periksa username dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-main/10">
      <Card className="w-full max-w-md bg-main text-main-foreground">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{appConfig.name}</CardTitle>
          <CardDescription className="text-main-foreground/80">
            Masuk dengan username dan password Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-main-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary-background text-foreground border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-main-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary-background text-foreground border-border"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              variant="reverse"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
