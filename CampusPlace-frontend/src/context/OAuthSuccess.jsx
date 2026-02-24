import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const role = params.get("role");
    const name = params.get("name");

    if (token) {
      login({ token, role, name });

      if (role === "ADMIN") navigate("/admin");
      else navigate("/dashboard");
    }
  }, []);

  return <div>Signing you in...</div>;
}