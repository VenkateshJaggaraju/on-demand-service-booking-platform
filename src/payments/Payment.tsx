import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import "./Payment.css";

// ---------------------------------------------------------------
// Mirrors the backend DTOs
// ---------------------------------------------------------------

// Must match the Java PaymentMethod enum exactly: [CARD, NETBANK, CASH, UPI]
export type PaymentMethod = "CARD" | "NETBANK" | "CASH" | "UPI";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: "CARD", label: "Credit / Debit Card", icon: "💳" },
  { value: "UPI", label: "UPI", icon: "📱" },
  { value: "NETBANK", label: "Net Banking", icon: "🏦" },
  { value: "CASH", label: "Cash on Service", icon: "💵" },
];

// PaymentRequestDTO
interface PaymentRequestDTO {
  bookingId: number;
  method: PaymentMethod;
}

// PaymentResponseDTO
interface PaymentResponseDTO {
  id: string;
  bookingId: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: string; // PaymentStatus enum
  gatewayOrderId: string | null;
  failureReason: string | null;
  createdAt: string; // Instant -> ISO string
}

// ASSUMPTION: change this to your Spring Boot payment endpoint.
const PAYMENT_ENDPOINT = "/customer/payments";

// Optional props (kept so the component can still be embedded elsewhere).
interface PaymentProps {
  bookingId?: number;
  amount?: number;
  serviceName?: string;
}

// Shape of whatever the previous page passes via <Link state={...}> / navigate(..., { state })
interface PaymentLocationState {
  bookingId?: number;
  amount?: number;
  serviceName?: string;
  serviceId?: number;
  service?: { id: number; name: string; actualPrice: number };
}

export const Payment: React.FC<PaymentProps> = (props) => {
  const { bookingId: bookingIdParam } = useParams<{ bookingId?: string }>();
  const location = useLocation();
  const state = (location.state as PaymentLocationState | null) ?? null;

  // The booking ID is carried from the click (router state / URL / props) and is never shown in the UI.
  // TODO: once "Book Now" creates a real booking, pass its id as state.bookingId and remove the
  // serviceId fallbacks below (they only exist so the flow can be tested before that step exists).
  const bookingId: number | undefined =
    props.bookingId ??
    (bookingIdParam ? Number(bookingIdParam) : undefined) ??
    state?.bookingId ??
    state?.service?.id ??
    state?.serviceId;

  const serviceName = props.serviceName ?? state?.serviceName ?? state?.service?.name ?? "";
  const amount = props.amount ?? state?.amount ?? state?.service?.actualPrice;

  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setError("");

    if (!bookingId || Number.isNaN(bookingId)) {
      setError("No booking selected. Please go back and click Book Now again.");
      return;
    }
    if (!method) {
      setError("Please select a payment method.");
      return;
    }

    const request: PaymentRequestDTO = { bookingId, method };

    try {
      setLoading(true);

      // Token is attached automatically by the interceptor in AxiosSetup.tsx
      const response = await axios.post<PaymentResponseDTO>(PAYMENT_ENDPOINT, request);

      // Requirement: show PaymentResponseDTO in the console only
      console.log("PaymentResponseDTO:", response.data);

      // The backend can answer HTTP 200 with an error string instead of a PaymentResponseDTO.
      // Only show success when a real DTO came back.
      const dto = response.data;
      if (typeof dto !== "object" || dto === null || !dto.id) {
        setError(typeof dto === "string" ? dto : "Payment failed. Please try again.");
        return;
      }
      if (dto.status === "FAILED") {
        setError(dto.failureReason || "Payment failed. Please try again.");
        return;
      }

      console.table(dto);

      // Requirement: show success in the UI
      setSuccess(true);
    } catch (err: any) {
      console.error("Payment error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          err.response?.data?.failureReason ||
            err.response?.data?.message ||
            "Payment failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUCCESS VIEW ----------------
  if (success) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-header">
            <div className="payment-icon payment-icon-success">✅</div>
            <h2 className="payment-title">Payment Successful</h2>
            <p className="payment-subtitle">
              Thank you! Your payment has been received.
            </p>
          </div>

          <Link to="/services" className="payment-button payment-link-button">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // ---------------- PAYMENT FORM ----------------
  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <div className="payment-icon">💳</div>
          <h2 className="payment-title">Complete Payment</h2>
          <p className="payment-subtitle">Choose how you'd like to pay</p>
        </div>

        <div className="payment-details">
          {serviceName && (
            <div className="payment-row">
              <span className="payment-label">Service</span>
              <span className="payment-value">{serviceName}</span>
            </div>
          )}

          {amount !== undefined && (
            <>
              <div className="payment-divider"></div>
              <div className="payment-total">
                <span>Total Amount</span>
                <span>₹{amount.toLocaleString("en-IN")}</span>
              </div>
            </>
          )}
        </div>

        <div className="payment-methods">
          <p className="payment-label">Payment method</p>

          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.value}
              className={
                method === m.value
                  ? "payment-method payment-method-selected"
                  : "payment-method"
              }
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.value}
                checked={method === m.value}
                onChange={() => setMethod(m.value)}
              />
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </label>
          ))}
        </div>

        {error && <div className="payment-error">{error}</div>}

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
          ) : amount !== undefined ? (
            <>Pay ₹{amount.toLocaleString("en-IN")}</>
          ) : (
            <>Pay Now</>
          )}
        </button>

        <div className="payment-security">
          <span>🔒</span>
          <span>Your payment is processed securely.</span>
        </div>
      </div>
    </div>
  );
};