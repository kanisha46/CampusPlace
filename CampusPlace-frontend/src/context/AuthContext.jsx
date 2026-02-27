import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("role");

  if (token) {
  setUser({ name, role });

  axios.defaults.headers.common["Authorization"] =
    `Bearer ${token}`;
}
}, []);

const login = (token, role, name) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userName", name);

  setUser({ role, name });

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};