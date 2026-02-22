import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("role");

    if (token) {
      setUser({ name, role });
    }
  }, []);

const login = (userData) => {
  localStorage.setItem("token", userData.token);
  localStorage.setItem("role", userData.role);
  localStorage.setItem("userName", userData.name);

  setUser(userData);   // IMPORTANT
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