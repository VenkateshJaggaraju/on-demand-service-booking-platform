import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Cart.css";

interface ServiceResponseDTO {
  id: number;
  name: string;
  description: string;
  actualPrice: number;
  displayPrice: string;
  icon: string;
  category: string;
  bookingCount: number;
}

interface CartItem {
  cartItemId: number;
  service: ServiceResponseDTO;
}

const API_BASE_URL = "/customer";

// TODO: Replace with JWT-based authentication
const getCustomerId = (): number => {
  const stored = localStorage.getItem("customerId");
  return stored ? Number(stored) : 1;
};

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<CartItem[]>(
          `${API_BASE_URL}/cart`,
          {
            params: {
              customerId: getCustomerId(),
            },
          }
        );

        if (!Array.isArray(response.data)) {
          console.error("Unexpected cart response:", response.data);
          setError("Unexpected response from server.");
          return;
        }

        setCartItems(response.data);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setError("Could not load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.service.actualPrice + 300,
    0
  );

  const handleRemove = async (cartItemId: number) => {
    setRemovingId(cartItemId);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/cart/${cartItemId}`, {
        params: {
          customerId: getCustomerId(),
        },
      });

      setCartItems((previousCart) =>
        previousCart.filter((item) => item.cartItemId !== cartItemId)
      );
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Could not remove the item. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="service-page">
      <section className="services-section">
        <div className="service-container">

          {/* CART HEADER */}
          <div className="cart-header">
            <div>
              <span className="service-label">HOMESERVE SERVICES</span>

              <h1 className="cart-title">Your Cart</h1>

              <p className="cart-subtitle">
                {cartItems.length} service
                {cartItems.length !== 1 ? "s" : ""} in cart
              </p>
            </div>

            {cartItems.length > 0 && (
              <div className="cart-total-header">
                <small>Total</small>
                <strong>₹{total}</strong>
              </div>
            )}
          </div>

          {/* ERROR */}
          {error && <div className="service-error">{error}</div>}

          {/* LOADING */}
          {loading && <div className="service-loading">Loading cart...</div>}

          {/* CART ITEMS */}
          {!loading && cartItems.length > 0 && (
            <div className="service-grid">
              {cartItems.map((item) => (
                <div className="service-card" key={item.cartItemId}>

                  <div className="service-card-top">
                    <div className="service-icon">{item.service.icon}</div>
                    <span className="service-category">
                      {item.service.category}
                    </span>
                  </div>

                  <h3>{item.service.name}</h3>

                  <p>{item.service.description}</p>

                  <div className="service-card-bottom">
                    <div className="service-price-container">
                      <small>Starting from</small>

                      <div className="service-price">
                        <strong className="actual-price">
                          ₹{item.service.actualPrice + 300}
                        </strong>

                        <span className="display-price">
                          <del>{item.service.displayPrice}</del>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="cart-remove-button"
                    onClick={() => handleRemove(item.cartItemId)}
                    disabled={removingId === item.cartItemId}
                  >
                    {removingId === item.cartItemId ? "Removing..." : "Remove"}
                  </button>

                </div>
              ))}
            </div>
          )}

          {/* EMPTY CART */}
          {!loading && !error && cartItems.length === 0 && (
            <div className="empty-services">
              <div>🛒</div>

              <h3>Your cart is empty</h3>

              <p>Add a service to see it here.</p>

              <Link to="/services">
                <button>Browse Services</button>
              </Link>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="cart-actions">
            {cartItems.length > 0 && (
                <Link to="/booking">
                <button className="book-services-button">
                    Book These Services
                </button>
                </Link>
            )}
            <Link to="/services">
              <button className="cart-view-services-button">
                View All Services
              </button>
            </Link>

            <Link to="/">
              <button className="back-home-button">Back to Home</button>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};