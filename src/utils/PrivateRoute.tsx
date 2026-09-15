    import { useEffect, useState, type JSX } from "react";
    import { Navigate } from "react-router-dom";
    import { isCustomerLoggedIn } from "./Auth";

    interface PrivateRouteProps {
    children: JSX.Element;
    }

    export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [status, setStatus] = useState<"checking" | "ok" | "no">("checking");

    useEffect(() => {
        let mounted = true;

        isCustomerLoggedIn().then((ok) => {
        if (mounted) setStatus(ok ? "ok" : "no");
        });

        return () => {
        mounted = false;
        };
    }, []);

    if (status === "checking") {
        return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
    }

    if (status === "no") {
        return <Navigate to="/customer/login" replace />;
    }

    return children;
    };