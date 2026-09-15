    import { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import axios from "axios";
    import "./CustomerLogin.css";

    export const CustomerLogin = () => {
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
        const response = await axios.post("http://localhost:1086/customer/login", {
            username,
            password,
        });

        // Store JWT
        localStorage.setItem("token", response.data);

        // Go to <Services/> 
        navigate("/services");
        } catch (error: any) {
        console.error(error);

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
        <div className="customer-login-page">

        <div className="customer-login-card">

            <h1 className="customer-login-title">
            Customer Login
            </h1>

            <p className="customer-login-subtitle">
            Login to book your services
            </p>

            {error && (
            <p className="customer-login-error">
                {error}
            </p>
            )}

            <form onSubmit={handleLogin}>

            <div className="customer-login-field">
                <label>Username</label>

                <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
            </div>

            <div className="customer-login-field">
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
                className="customer-login-button"
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            </form>

            <div className="customer-login-signup">
            <p>Don't have an account?</p>

            <Link to="/customer/register">
                Create new account
            </Link>
            </div>

        </div>

        </div>
    );
    };
