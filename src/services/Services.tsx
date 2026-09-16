import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Services.css";
import { Link } from "react-router";

interface Service {
  id: number;
  name: string;
  description: string;
  actualPrice: number;
  displayPrice: string; // already formatted as "₹599" — see ServiceMapper.formatPrice on the backend
  icon: string;
  category: string;
  bookingCount: number;
}

// Matches ServiceProviderController: @RequestMapping("/service-provider"), GET /services
const API_BASE_URL = "http://localhost:1086";

export const Services: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // debounced value used for filtering
  const [category, setCategory] = useState("All");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search input so we don't re-filter on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch all services once on mount (no pagination, no query params —
  // the backend endpoint just returns the full list)
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Service[]>(
          `${API_BASE_URL}/service-provider/services`
        );
        setServices(response.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Could not load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Categories derived from the fetched services themselves
  const categories = useMemo(() => {
    const unique = Array.from(new Set(services.map((s) => s.category)));
    return ["All", ...unique];
  }, [services]);

  // Client-side filtering by category + search since the backend
  // doesn't take any query params and everything is already fetched
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        category === "All" || service.category === category;
      const matchesSearch =
        search.trim() === "" ||
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, category, search]);

  const handleBookNow = (service: Service) => {
    console.log("Selected service:", service);
  };

  return (
    <div className="service-page">
      {/* HEADER */}
      <section className="service-header">
        <div className="service-container">
          <div className="service-header-content">
            <span className="service-label">HOMESERVE SERVICES</span>

            <h1>
              Professional Services
              <span>At Your Doorstep</span>
            </h1>

            <p>
              Find trusted professionals for all your home service
              requirements. Book reliable experts quickly and easily.
            </p>
          </div>

          {/* SEARCH */}
          <div className="service-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search for a service..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section">
        <div className="service-container">
          {/* CATEGORY FILTER */}
          <div className="category-container">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* RESULT */}
          <div className="service-result">
            <div>
              <h2>All Services</h2>
              <p>{filteredServices.length} services available</p>
            </div>
          </div>

          {error && <div className="service-error">{error}</div>}

          {/* SERVICE CARDS */}
          {!loading && (
            <div className="service-grid">
              {filteredServices.map((service) => (
                <div className="service-card" key={service.id}>
                  <div className="service-card-top">
                    <div className="service-icon">{service.icon}</div>
                    <span className="service-category">
                      {service.category}
                    </span>
                  </div>

                  <h3>{service.name}</h3>
                  <p>{service.description}</p>

                  <div className="service-card-bottom">
                    <div>
                      <small>Starting from</small>
                      <strong>{service.displayPrice}</strong>
                    </div>

                    <button
                      onClick={() => handleBookNow(service)}
                      className="book-service-button"
                    >
                      Book Now
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="service-loading">Loading services...</div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredServices.length === 0 && (
            <div className="empty-services">
              <div>🔍</div>
              <h3>No services found</h3>
              <p>Try searching for another service or category.</p>
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setCategory("All");
                }}
              >
                View All Services
              </button>
              <br />
              <Link to="/">
                <button>Back to Home</button>
              </Link>
            </div>
          )}
        </div>
        <Link to="/">
                <button>Back to Home</button>
              </Link>
      </section>
     

      {/* CTA */}
      <section className="service-cta">
        <div className="service-container">
          <div>
            <span>NEED HELP?</span>
            <h2>Can't find the service you need?</h2>
            <p>
              Contact our support team and we'll help you find the right
              professional.
            </p>
          </div>

          <button>Contact Support →</button>
        </div>
      </section>
    </div>
  );
};
