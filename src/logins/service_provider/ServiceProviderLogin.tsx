import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ServiceProviderLogin.css";

export const ServiceProviderLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:1086/service-provider/login",
        {
          username,
          password,
        }
      );

      // Store JWT token — this is the only thing auth checks rely on now.
      localStorage.setItem("token", response.data);

      // Respect wherever the user was trying to go before being sent here
      // (e.g. clicking "Become a Provider" while already logged in shouldn't
      // bounce back to this page again next time).
      const state = location.state as { redirectTo?: string } | null;
      const redirectTo = state?.redirectTo || "/service-provider/provide-services";

      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setError("Invalid username or password");
      } else if (error.response?.status === 403) {
        setError("Access denied");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-provider-login-page">
      <div className="service-provider-login-card">
        <h1 className="service-provider-login-title">
          Service Provider Login
        </h1>

        <p className="service-provider-login-subtitle">
          Login to manage your services
        </p>

        {error && <p className="service-provider-login-error">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="service-provider-login-field">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="service-provider-login-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="service-provider-login-button"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="service-provider-login-signup">
          <p>Don't have an account?</p>

          <Link to="/service-provider/register">Create new account</Link>
        </div>
      </div>
    </div>
  );
};
