    import { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import "./CustomerRegister.css";
import axios from "axios";

    export const CustomerRegister = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState<File | null>(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:1086/customer/register", {
                username,
                password,
                mobileNumber: Number(mobileNumber),
                email,
            });

            console.log("Status:", response.status);
            console.log("Backend response:", response.data);

            alert("Account created successfully!");

            navigate("/customer/login");

        } catch (error: any) {

            console.error("Registration error:", error);

            if (error.response?.status === 409) {
                setError(
                    "Username, email or mobile number already exists"
                );
            } else if (error.response?.status === 400) {
                setError("Invalid registration details.");
            } else if (!error.response) {
                setError("Unable to connect to server.");
            } else {
                setError("Registration failed. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="customer-register-page">

        <div className="customer-register-card">

            <h1 className="customer-register-title">
            Create Account
            </h1>

            <p className="customer-register-subtitle">
            Create your customer account
            </p>

            {error && (
            <p className="customer-register-error">
                {error}
            </p>
            )}

            <form onSubmit={handleRegister}>

            {/* Username */}
            <div className="customer-register-field">
                <label>Username</label>

                <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
            </div>

            {/* Password */}
            <div className="customer-register-field">
                <label>Password</label>

                <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            {/* Mobile Number */}
            <div className="customer-register-field">
                <label>Mobile Number</label>

                <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                />
            </div>

            {/* Email */}
            <div className="customer-register-field">
                <label>Email</label>

                <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            {/* Profile */}
            <div className="customer-register-field">
                <label>Profile Image</label>

                <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                    setProfile(e.target.files?.[0] || null)
                }
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="customer-register-button"
            >
                {loading ? "Creating account..." : "Create Account"}
            </button>

            </form>

            <div className="customer-register-login">

            <p>Already have an account?</p>

            <Link to="/customer/login">
                Login
            </Link>

            </div>

        </div>

        </div>
    );
    };
