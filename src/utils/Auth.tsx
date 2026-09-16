    import axios from "axios";

    const AUTH_API_BASE_URL = "http://localhost:1086";

    export interface AuthValidation {
    valid: boolean;
    username?: string;
    role?: string; // e.g. "ROLE_CUSTOMER", "ROLE_SERVICEPROVIDER", "ROLE_ADMIN"
    }

    // Single source of truth: always asks the backend, never trusts stale localStorage flags.
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
        // token missing/expired/invalid -> clean up so we don't keep sending a dead token
        localStorage.removeItem("token");
        return { valid: false };
    }
    }

    export async function isCustomerLoggedIn(): Promise<boolean> {
    const result = await validateToken();
    return result.valid && result.role === "ROLE_CUSTOMER";
    }

    export async function isServiceProviderLoggedIn(): Promise<boolean> {
    const result = await validateToken();
    return result.valid && result.role === "ROLE_SERVICEPROVIDER";
    }

    export async function isAdminLoggedIn(): Promise<boolean> {
    const result = await validateToken();
    return result.valid && result.role === "ROLE_ADMIN";
    }

    // Generic helper in case more roles get added later.
    export type AppRole = "CUSTOMER" | "SERVICEPROVIDER" | "ADMIN";

    export async function isLoggedInAs(role: AppRole): Promise<boolean> {
    const result = await validateToken();
    return result.valid && result.role === `ROLE_${role}`;
    }

    export function logout() {
    localStorage.removeItem("token");
    }
