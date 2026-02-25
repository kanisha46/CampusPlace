import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    const usersRes = await axios.get("http://localhost:8082/auth/users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const companiesRes = await axios.get("http://localhost:8082/api/companies");

    setUsers(usersRes.data);
    setCompanies(companiesRes.data);
  };

  const deleteUser = async (email) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:8082/admin/delete/${email}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setUsers(users.filter(u => u.email !== email));

  } catch (error) {
    console.error("Delete error:", error);
  }
};

  const promoteUser = async (email) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:8082/admin/promote/${email}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchData();

  } catch (error) {
    console.error("Promote error:", error);
  }
};

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? "admin-container dark" : "admin-container"}>
      
      <div className="top-bar">
        <h1>Admin Dashboard</h1>
        <button 
          className="toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* STATISTICS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Companies</h3>
          <p>{companies.length}</p>
        </div>
      </div>

      {/* USERS SECTION */}
      <div className="card">
        <div className="card-header">
          <h2>Users</h2>
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.email}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={u.role === "ADMIN" ? "badge admin" : "badge student"}>
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.role !== "ADMIN" && (
                    <button 
                      className="promote-btn"
                      onClick={() => promoteUser(u.email)}
                    >
                      Promote
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={() => deleteUser(u.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPANIES */}
      <div className="card">
        <h2>Companies</h2>
        <div className="company-grid">
          {companies.map((c) => (
            <div key={c.id} className="company-card">
              <h3>{c.name}</h3>
              <p>{c.industry}</p>
              <span>{c.location}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}