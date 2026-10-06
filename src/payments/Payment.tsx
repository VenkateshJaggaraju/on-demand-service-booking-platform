import React, { useState } from "react";
import axios from "axios";
import "./Payment.css";

interface PaymentProps {
  bookingId: number;
  amount: number;
  serviceName: string;
}

export const Payment: React.FC<PaymentProps> = ({
  bookingId,
  amount,
  serviceName,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login before making payment.");
        return;
      }

      /*
       * Call your Spring Boot backend.
       *
       * The backend should:
       * 1. Validate the booking
       * 2. Validate the amount
       * 3. Create a Stripe Checkout Session
       * 4. Return the Stripe checkout URL
       */

      const response = await axios.post(
        "/customer/payments/create-checkout-session",
        {
          bookingId: bookingId,
          amount: amount,
          serviceName: serviceName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const checkoutUrl = response.data.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      // Redirect customer to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Payment error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            "Invalid payment request."
        );
      } else if (err.response?.status === 409) {
        setError(
          err.response?.data?.message ||
            "Payment cannot be processed for this booking."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to start payment. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <div className="payment-icon">
            💳
          </div>

          <h2 className="payment-title">
            Complete Payment
          </h2>

          <p className="payment-subtitle">
            Secure payment powered by Stripe
          </p>
        </div>

        <div className="payment-details">
          <div className="payment-row">
            <span className="payment-label">
              Service
            </span>

            <span className="payment-value">
              {serviceName}
            </span>
          </div>

          <div className="payment-row">
            <span className="payment-label">
              Booking ID
            </span>

            <span className="payment-value">
              #{bookingId}
            </span>
          </div>

          <div className="payment-divider"></div>

          <div className="payment-total">
            <span>Total Amount</span>

            <span>
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}

        <button
          type="button"
          className="payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="payment-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              Pay ₹{amount.toLocaleString("en-IN")}
            </>
          )}
        </button>

        <div className="payment-security">
          <span>🔒</span>
          <span>
            Your payment is securely processed by Stripe.
          </span>
        </div>
      </div>
    </div>
  );
};
