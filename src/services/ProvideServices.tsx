    import { useNavigate } from "react-router-dom";
    import "./ProvideServices.css";

    export const ProvideServices = () => {
    const navigate = useNavigate();

    const handleProvideService = () => {
        navigate("/service-provider/add");
    };

    return (
        <div className="provide-services-page">

        <div className="provide-services-card">

            <div className="provide-services-icon">
            🛠️
            </div>

            <h1 className="provide-services-title">
            Provide Your Service
            </h1>

            <p className="provide-services-description">
            Share your professional services with customers and
            start receiving service requests.
            </p>

            <button
            className="provide-services-button"
            onClick={handleProvideService}
            >
            <span>＋</span>
            Provide Service
            </button><br />

            <button onClick={() => navigate("/")}>
            Back to Home
            </button>

        </div>

        </div>
    );
    };