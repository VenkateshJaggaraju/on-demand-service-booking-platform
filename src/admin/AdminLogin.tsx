    import { useState } from "react";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    import "./AdminLogin.css";

    export const AdminLogin = () => {
    const navigate = useNavigate();

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
            "http://localhost:1086/admin/login",
            {
            username: username,
            password: password,
            }
        );

        // JWT returned by Spring Boot
        const token = response.data;

        // Store JWT
        localStorage.setItem("token", token);

        // Go to HomePage
        navigate("/");
        } catch (error: any) {
        console.error(error);

        if (error.response?.status === 401) {
            setError("Invalid username or password");
        } else if (error.response?.status === 403) {
            setError("Access denied. Please check your login configuration.");
        } else {
            setError("Login failed. Please try again.");
        }
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">

        <div className="admin-login-card">

            {/* Heading */}
            <div className="admin-login-header">

            <h1 className="admin-login-title">
                Admin Login
            </h1>

            <p className="admin-login-subtitle">
                Login to your admin account
            </p>

            </div>

            {/* Error */}
            {error && (
            <div className="admin-login-error">
                {error}
            </div>
            )}

            {/* Login Form */}
            <form
            onSubmit={handleLogin}
            className="admin-login-form"
            >

            {/* Username */}
            <div className="admin-login-field">

                <label
                htmlFor="username"
                className="admin-login-label"
                >
                Username
                </label>

                <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="admin-login-input"
                />

            </div>

            {/* Password */}
            <div className="admin-login-field">

                <label
                htmlFor="password"
                className="admin-login-label"
                >
                Password
                </label>

                <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="admin-login-input"
                />

            </div>

            {/* Login Button */}
            <button
                type="submit"
                disabled={loading}
                className="admin-login-button"
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            </form>

        </div>

        </div>
    );
    };