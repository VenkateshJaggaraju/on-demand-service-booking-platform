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

const API_BASE_URL = "";

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
  // CART
  // =========================================================

  const [cart, setCart] = useState<Service[]>([]);

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
  // CHECK IF SERVICE IS IN CART
  // =========================================================

  const isInCart = (serviceId: number) => {

    return cart.some(
      (service) => service.id === serviceId
    );

  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const getCustomerId = (): number => {
    const stored = localStorage.getItem("customerId");
    return stored ? Number(stored) : 1;
  };

  const handleAddToCart = async (service: Service) => {

    if (isInCart(service.id)) {
      return;
    }

    setCart((previousCart) => [...previousCart, service]); // optimistic update

    try {

      await axios.post(`${API_BASE_URL}/customer/cart`, {
        customerId: getCustomerId(),
        serviceId: service.id,
      });

    } catch (err) {

      console.error("Failed to add to cart:", err);
      // roll back on failure
      setCart((previousCart) => previousCart.filter((s) => s.id !== service.id));

    }

  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await axios.get<{ cartItemId: number; service: Service }[]>(
          `${API_BASE_URL}/customer/cart`,
          { params: { customerId: getCustomerId() } }
        );

        if (Array.isArray(res.data)) {
          setCart(res.data.map((item) => item.service));
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };

    loadCart();
  }, []);

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
              CART SUMMARY
          ================================================== */}

          <div className="cart-summary">

            <span className="cart-icon">
              🛒
            </span>

            <span>
              {cart.length} service
              {cart.length !== 1 ? "s" : ""} in cart
            </span>

            {cart.length > 0 && (
              <Link to="/cart">
                <button
                  className="view-cart-button"
                  onClick={() =>
                    console.log("Cart:", cart)
                  }
                >
                  View Cart →
                </button>
              </Link>
            )}

          </div>


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

          <div className="category-container price-filter">

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

                    <div className="service-price-container">

                      <small>
                        Starting from
                      </small>

                      <div className="service-price">

                        <strong className="actual-price">
                          ₹{service.actualPrice + 300}
                        </strong>

                        <span className="display-price">
                          <del>
                            {service.displayPrice}
                          </del>
                        </span>

                      </div>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="service-card-actions">

                      {/* ADD TO CART */}

                      <button
                        onClick={() =>
                          handleAddToCart(service)
                        }
                        className={
                          isInCart(service.id)
                            ? "add-cart-button added"
                            : "add-cart-button"
                        }
                        disabled={isInCart(service.id)}
                      >

                        {isInCart(service.id)
                          ? "✓ Added"
                          : "🛒 Add to Cart"}

                      </button>


                      {/* BOOK NOW */}

                      <Link to="/payment" state={{ service }}>
                        <button
                          onClick={() =>
                            handleBookNow(service)
                          }
                          className="book-service-button"
                        >
                          Book Now
                          <span>→</span>
                        </button>
                      </Link>
                    </div>

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

            <div className="service-pagination">

              {/* PREVIOUS */}

              <button
                onClick={() =>
                  setPage((p) => Math.max(p - 1, 1))
                }
                disabled={page === 1}
                className="pagination-button"
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
                  className={
                    pageNumber === page
                      ? "pagination-number active"
                      : "pagination-number"
                  }
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
                className="pagination-button"
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

        <div className="back-home-container">

          <Link to="/">
            <button className="back-home-button">
              Back to Home
            </button>
          </Link>

        </div>

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