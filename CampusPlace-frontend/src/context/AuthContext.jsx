import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { backendWarmer } from "../utils/backendWarmer";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (token) {
      setUser({ name, role, email });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Start warming up the backend when app loads
    const warmBackend = async () => {
      const result = await backendWarmer.warmUp((status) => {
        console.log('Backend warming:', status);
      });
      setBackendReady(result.success);
    };

    warmBackend();

    // Cleanup on unmount
    return () => {
      backendWarmer.stopPeriodicPing();
    };
  }, []);

const login = (token, role, name, email) => {
  // Save under both keys so ALL pages work consistently
  localStorage.setItem("token", token);
  localStorage.setItem("accessToken", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userName", name);
  if (email) localStorage.setItem("email", email);

  setUser({ role, name, email });

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, backendReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
