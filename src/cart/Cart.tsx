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

const API_BASE_URL = "http://localhost:1086/customer";

// TODO: Replace with JWT-based authentication
const getCustomerId = (): number => {
  const stored = localStorage.getItem("customerId");
  return stored ? Number(stored) : 1;
};

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    (sum, item) => sum + item.service.actualPrice,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* Header */}
        <div className="cart-header">
          <div>
            <h2 className="cart-title">Your Cart</h2>

            <p className="cart-subtitle">
              {cartItems.length} service
              {cartItems.length !== 1 ? "s" : ""} in cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <div className="cart-total-header">
              <p className="cart-total-label">Total</p>

              <p className="cart-total-price">
                ₹{total}
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="cart-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="cart-loading">
            Loading cart...
          </div>
        )}

        {/* Cart Items */}
        {!loading && cartItems.length > 0 && (
          <div className="cart-grid">

            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="cart-card"
              >
                {/* Card Header */}
                <div className="cart-card-header">

                  <div className="cart-icon">
                    {item.service.icon}
                  </div>

                  <span className="cart-category">
                    {item.service.category}
                  </span>

                </div>

                {/* Service Information */}
                <h3 className="cart-service-name">
                  {item.service.name}
                </h3>

                <p className="cart-service-description">
                  {item.service.description}
                </p>

                {/* Price */}
                <div className="cart-price-section">

                        <strong className="actual-price">
                          ₹{item.service.actualPrice + 300}
                        </strong>

                        <span className="display-price">
                          <del>
                            {item.service.displayPrice}
                          </del>
                        </span>

                      </div>

              </div>
            ))}

          </div>
        )}

        {/* Empty Cart */}
        {!loading && !error && cartItems.length === 0 && (
          <div className="cart-empty">

            <div className="cart-empty-icon">
              🛒
            </div>

            <h3 className="cart-empty-title">
              Your cart is empty
            </h3>

            <p className="cart-empty-text">
              Add a service to see it here.
            </p>

          </div>
        )}

        {/* Footer Actions */}
        <div className="cart-actions">

          <Link to="/services">
            <button className="cart-button cart-button-primary">
              View All Services
            </button>
          </Link>

          <Link to="/">
            <button className="cart-button cart-button-secondary">
              Back to Home
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
};