import { Link } from "react-router-dom";
import { getUser, logout } from "../auth/auth";

export default function Sidebar() {
  const user = getUser();

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Workspace</h2>

      <p style={styles.user}>
        {user.name} <br />
        <small>({user.role})</small>
      </p>

      <nav>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/bookings" style={styles.link}>Bookings</Link>

        {user.role === "ADMIN" && (
          <>
            <Link to="/workspace-types" style={styles.link}>
              Workspace Types
            </Link>
            <Link to="/analytics" style={styles.link}>
              Analytics
            </Link>
          </>
        )}
      </nav>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#1f2937",
    color: "#fff",
    padding: "20px",
    position: "fixed",
  },
  logo: {
    marginBottom: "30px",
  },
  user: {
    marginBottom: "20px",
  },
  link: {
    display: "block",
    color: "#e5e7eb",
    marginBottom: "10px",
    textDecoration: "none",
  },
  logout: {
    marginTop: "30px",
    padding: "8px",
    width: "100%",
    cursor: "pointer",
  },
};
