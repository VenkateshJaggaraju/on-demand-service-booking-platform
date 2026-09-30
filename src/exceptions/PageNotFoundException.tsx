import { Link, useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import "./PageNotFoundException.css";

export const PageNotFoundException = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  // No error object means it was rendered by a catch-all "*" route
  const isNotFound = !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <div className="nf-container">
      <div className="nf-blob nf-blob-1"></div>
      <div className="nf-blob nf-blob-2"></div>

      {/* .nf-fish holds the shadow and animation; .nf-card is the fish-shaped glass */}
      <div className="nf-fish">
        <div className="nf-card">
          <div className="nf-code-wrap">
            <div className="nf-ring"></div>
            <div className="nf-ring nf-ring-2"></div>
            <div className="nf-code">{isNotFound ? "404" : "Oops"}</div>
          </div>

          <h1 className="nf-title">
            {isNotFound ? "Page not found" : "Something went wrong"}
          </h1>

          <p className="nf-text">
            {isNotFound
              ? "The page you're looking for doesn't exist or may have been moved."
              : "An unexpected error occurred. Please try again or head back home."}
          </p>

          <div className="nf-actions">

            <Link to="/" className="nf-btn nf-btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};