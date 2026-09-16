import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedInAs, type AppRole } from "./Auth";

interface PrivateRouteProps {
  children: JSX.Element;
  role: AppRole; // "CUSTOMER" | "SERVICEPROVIDER" | "ADMIN"
  redirectTo?: string; // where to send them if not logged in as that role
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  role,
  redirectTo,
}) => {
  const [status, setStatus] = useState<"checking" | "ok" | "no">("checking");

  useEffect(() => {
    let mounted = true;

    isLoggedInAs(role).then((ok) => {
      if (mounted) setStatus(ok ? "ok" : "no");
    });

    return () => {
      mounted = false;
    };
  }, [role]);

  if (status === "checking") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

  if (status === "no") {
    const fallback =
      redirectTo ??
      (role === "SERVICEPROVIDER"
        ? "/service-provider/login"
        : role === "ADMIN"
        ? "/admin/login"
        : "/customer/login");

    return <Navigate to={fallback} replace />;
  }

  return children;
};
