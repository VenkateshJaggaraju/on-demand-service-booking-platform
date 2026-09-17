
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Services.css";
import { Link } from "react-router";

interface Service {
  id: number;
  name: string;
  description: string;
  actualPrice: number;
  displayPrice: string;
  icon: string;
  category: string;
  bookingCount: number;
}

interface ServicePage {
  content: Service[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

const API_BASE_URL = "http://localhost:1086";

export const Services: React.FC = () => {

  // =========================================================
  // SEARCH
  // =========================================================

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // =========================================================
  // CATEGORY
  // =========================================================

  const [category, setCategory] = useState("All");

  // =========================================================
  // PRICE FILTER
  // =========================================================

  const [priceRange, setPriceRange] = useState("All");

  const priceRanges = [
    {
      label: "All Prices",
      value: "All",
    },
    {
      label: "₹200 – ₹500",
      value: "200-500",
    },
    {
      label: "₹500 – ₹1,000",
      value: "500-1000",
    },
    {
      label: "₹1,000 – ₹3,000",
      value: "1000-3000",
    },
    {
      label: "₹3,000+",
      value: "3000+",
    },
  ];

  // =========================================================
  // SERVICES
  // =========================================================

  const [services, setServices] = useState<Service[]>([]);

  // =========================================================
  // LOADING / ERROR
  // =========================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // PAGINATION
  // Frontend page is 1-indexed
  // Backend converts it to 0-indexed
  // =========================================================

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // =========================================================
  // DEBOUNCE SEARCH INPUT
  // =========================================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // =========================================================
  // RESET TO PAGE 1 WHEN SEARCH CHANGES
  // =========================================================

  useEffect(() => {
    setPage(1);
  }, [search]);

  // =========================================================
  // RESET TO PAGE 1 WHEN PRICE RANGE CHANGES
  // =========================================================

  useEffect(() => {
    setPage(1);
  }, [priceRange]);

  // =========================================================
  // GET PRICE PARAMETERS
  // =========================================================

  const getPriceParams = () => {
    switch (priceRange) {

      case "200-500":
        return {
          minPrice: 200,
          maxPrice: 500,
        };

      case "500-1000":
        return {
          minPrice: 500,
          maxPrice: 1000,
        };

      case "1000-3000":
        return {
          minPrice: 1000,
          maxPrice: 3000,
        };

      case "3000+":
        return {
          minPrice: 3000,
        };

      default:
        return {};
    }
  };

  // =========================================================
  // FETCH SERVICES
  // =========================================================

  useEffect(() => {

    const fetchServices = async () => {

      setLoading(true);
      setError(null);

      try {

        const priceParams = getPriceParams();

        const response = await axios.get<ServicePage>(
          `${API_BASE_URL}/service-provider/services`,
          {
            params: {
              page: page,
              name: search || undefined,
              ...priceParams,
            },
          }
        );

        setServices(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);

      } catch (err) {

        console.error("Failed to fetch services:", err);

        setError(
          "Could not load services. Please check the backend server."
        );

        setServices([]);
        setTotalPages(1);
        setTotalElements(0);

      } finally {

        setLoading(false);

      }

    };

    fetchServices();

  }, [page, search, priceRange]);

  // =========================================================
  // CATEGORY LIST
  //
  // Because pagination is server-side, these categories come
  // only from the currently loaded page.
  // =========================================================

  const categories = useMemo(() => {

    const uniqueCategories = Array.from(
      new Set(
        services
          .map((service) => service.category)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];

  }, [services]);

  // =========================================================
  // CATEGORY FILTER
  //
  // Search and price are handled by the backend.
  // Category is currently filtered on the loaded page.
  // =========================================================

  const filteredServices = useMemo(() => {

    if (category === "All") {
      return services;
    }

    return services.filter(
      (service) => service.category === category
    );

  }, [services, category]);

  // =========================================================
  // BOOK NOW
  // =========================================================

  const handleBookNow = (service: Service) => {

    console.log("Selected service:", service);

    // Later:
    // navigate(`/customer/book/${service.id}`);

  };

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleViewAll = () => {

    setSearchInput("");
    setSearch("");
    setCategory("All");
    setPriceRange("All");
    setPage(1);

  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="service-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="service-header">

        <div className="service-container">

          <div className="service-header-content">

            <span className="service-label">
              HOMESERVE SERVICES
            </span>

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
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES
      ====================================================== */}

      <section className="services-section">

        <div className="service-container">


          {/* =================================================
              CATEGORY FILTER
          ================================================== */}

          <div className="category-container">

            {categories.map((item) => (

              <button
                key={item}
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => {

                  setCategory(item);
                  setPage(1);

                }}
              >
                {item}
              </button>

            ))}

          </div>


          {/* =================================================
              PRICE FILTER
          ================================================== */}

          <div className="category-container">

            {priceRanges.map((item) => (

              <button
                key={item.value}
                className={
                  priceRange === item.value
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => {

                  setPriceRange(item.value);
                  setPage(1);

                }}
              >
                {item.label}
              </button>

            ))}

          </div>


          {/* =================================================
              RESULT HEADER
          ================================================== */}

          <div className="service-result">

            <div>

              <h2>
                {search
                  ? `Search results for "${search}"`
                  : "All Services"}
              </h2>

              <p>
                {totalElements} services available
              </p>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="service-error">
              {error}
            </div>

          )}


          {/* =================================================
              SERVICE CARDS
          ================================================== */}

          {!loading && filteredServices.length > 0 && (

            <div className="service-grid">

              {filteredServices.map((service) => (

                <div
                  className="service-card"
                  key={service.id}
                >

                  {/* CARD TOP */}

                  <div className="service-card-top">

                    <div className="service-icon">
                      {service.icon}
                    </div>

                    <span className="service-category">
                      {service.category}
                    </span>

                  </div>


                  {/* SERVICE NAME */}

                  <h3>
                    {service.name}
                  </h3>


                  {/* DESCRIPTION */}

                  <p>
                    {service.description}
                  </p>


                  {/* CARD BOTTOM */}

                  <div className="service-card-bottom">

                    <div>

                      <small>
                        Starting from
                      </small>

                      <strong>
                        {service.displayPrice}
                      </strong>

                    </div>


                    <button
                      onClick={() =>
                        handleBookNow(service)
                      }
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


          {/* =================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="service-loading">
              Loading services...
            </div>

          )}


          {/* =================================================
              PAGINATION
          ================================================== */}

          {!loading && totalPages > 1 && (

            <div
              className="service-pagination"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >

              {/* PREVIOUS */}

              <button
                onClick={() =>
                  setPage((p) => Math.max(p - 1, 1))
                }
                disabled={page === 1}
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  border: "1px solid #f9a8d4",
                  background: "#fff",
                  color:
                    page === 1
                      ? "#f9a8d4"
                      : "#db2777",
                  fontWeight: 600,
                  cursor:
                    page === 1
                      ? "not-allowed"
                      : "pointer",
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                ← Prev
              </button>


              {/* PAGE NUMBERS */}

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((pageNumber) => (

                <button
                  key={pageNumber}
                  onClick={() =>
                    setPage(pageNumber)
                  }
                  style={{
                    minWidth: "36px",
                    height: "36px",
                    borderRadius: "9999px",
                    border: "1px solid #f9a8d4",
                    background:
                      pageNumber === page
                        ? "#ec4899"
                        : "#fff",
                    color:
                      pageNumber === page
                        ? "#fff"
                        : "#db2777",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {pageNumber}
                </button>

              ))}


              {/* NEXT */}

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={page === totalPages}
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  border: "1px solid #f9a8d4",
                  background: "#fff",
                  color:
                    page === totalPages
                      ? "#f9a8d4"
                      : "#db2777",
                  fontWeight: 600,
                  cursor:
                    page === totalPages
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    page === totalPages ? 0.5 : 1,
                }}
              >
                Next →
              </button>

            </div>

          )}


          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {!loading &&
            filteredServices.length === 0 && (

              <div className="empty-services">

                <div>🔍</div>

                <h3>
                  No services found
                </h3>

                <p>
                  Try searching for another service
                  or category.
                </p>


                <button
                  onClick={handleViewAll}
                >
                  View All Services
                </button>

                <br />

                <Link to="/">
                  <button>
                    Back to Home
                  </button>
                </Link>

              </div>

            )}

        </div>


        {/* =====================================================
            BACK TO HOME
        ====================================================== */}

        <Link to="/">
          <button>
            Back to Home
          </button>
        </Link>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="service-cta">

        <div className="service-container">

          <div>

            <span>
              NEED HELP?
            </span>

            <h2>
              Can't find the service you need?
            </h2>

            <p>
              Contact our support team and we'll help
              you find the right professional.
            </p>

          </div>


          <button>
            Contact Support →
          </button>

        </div>

      </section>

    </div>
  );
};
