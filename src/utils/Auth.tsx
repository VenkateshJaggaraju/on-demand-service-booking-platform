    import axios from "axios";

    const AUTH_API_BASE_URL = "http://localhost:1086";

    export interface AuthValidation {
    valid: boolean;
    username?: string;
    role?: string;
    }

    export async function validateToken(): Promise<AuthValidation> {
    const token = localStorage.getItem("token");

    if (!token) {
        return { valid: false };
    }

    try {
        const response = await axios.get<AuthValidation>(
        `${AUTH_API_BASE_URL}/auth/validate`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        return response.data;
    } catch {
        localStorage.removeItem("token");
        return { valid: false };
    }
    }

    export async function isCustomerLoggedIn(): Promise<boolean> {
    const result = await validateToken();
    return result.valid && result.role === "ROLE_CUSTOMER";
    }

    export function logout() {
    localStorage.removeItem("token");
    }