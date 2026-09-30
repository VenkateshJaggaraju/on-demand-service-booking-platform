import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import "./ServiceProviderStats.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:1086";

type TabKey = "services" | "customers" | "bookings";

// Must match the BookingStatus enum on the backend exactly.
const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;
type BookingStatus = (typeof STATUSES)[number];

const REASON_MIN = 5;
const REASON_MAX = 255;

// Blue bubbles 1-10 and green bubbles 11-20; in each colour, 5 flow forward
// and 5 flow in reverse (positions and speeds are set in the CSS via nth-child).
const BLUE_BUBBLES = 10;
const GREEN_BUBBLES = 10;

interface ServiceRow {
  id: number;
  name: string;
  description: string;
  actualPrice: number | null;
  displayPrice: string | null;
  icon: string | null;
  category: string | null;
  bookingCount: number;
}

interface CustomerRow {
  id: number;
  username: string;
  profile: string | null;
  mobileNumber: number;
  email: string;
  role: string;
}

interface BookingRow {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  serviceId: string; // String in BookingResponseDTO
  serviceName: string;
  servicePrice: number | null;
  bookingDate: string | null;
  bookingTime: string | null;
  address: string | null;
  totalAmount: number | null;
  reason: string | null;
  status: BookingStatus | null;
}

type TabData = {
  services: ServiceRow[];
  customers: CustomerRow[];
  bookings: BookingRow[];
};

const TABS: { key: TabKey; label: string; path: string }[] = [
  { key: "services", label: "Services", path: "/service-provider/all-services" },
  { key: "customers", label: "Customers", path: "/customer/all" },
  { key: "bookings", label: "Bookings", path: "/service-provider/all-bookings" },
];

const rupees = (n: number | null | undefined) =>
  n == null ? "—" : `₹${n.toLocaleString("en-IN")}`;

const statusLabel = (s: string) => s.replace("_", " ");

// Change the key if you store your JWT under a different name.
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const describeError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    if (!err.response) return "Unable to connect to the server on localhost:1086.";
    if (err.response.status === 401 || err.response.status === 403)
      return "Access denied. Log in with an account that can do this.";
    if (err.response.status === 400) return "The server rejected these details. Check them and try again.";
    if (err.response.status === 404) return "This booking no longer exists. Refresh the list.";
    return `Request failed (${err.response.status}). Try again.`;
  }
  return "Something went wrong. Try again.";
};

// A reason must be real text: 5 to 255 characters and contain actual words.
const validateReason = (raw: string) => {
  const reason = raw.trim();
  if (!reason) return "Enter a reason.";
  if (reason.length < REASON_MIN) return `Use at least ${REASON_MIN} characters.`;
  if (reason.length > REASON_MAX) return `Keep it under ${REASON_MAX} characters.`;
  if (!/\p{L}{2,}/u.test(reason)) return "Write the reason in words.";
  return "";
};

function Empty({ label }: { label: string }) {
  return <p className="stats-empty">No {label} yet.</p>;
}

function WaterBubbles() {
  return (
    <div className="stats-bubbles" aria-hidden="true">
      {Array.from({ length: BLUE_BUBBLES }, (_, i) => (
        <span key={`blue-${i}`} className="stats-bubble" />
      ))}
      {Array.from({ length: GREEN_BUBBLES }, (_, i) => (
        <span key={`green-${i}`} className="stats-bubble stats-bubble--green" />
      ))}
    </div>
  );
}

function ServicesTable({ rows }: { rows: ServiceRow[] }) {
  if (!rows.length) return <Empty label="services" />;
  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Service</th>
          <th>Category</th>
          <th>Description</th>
          <th className="num">Listed price</th>
          <th className="num">Customer price</th>
          <th className="num">Bookings</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td className="strong">
              {s.icon && <span className="stats-icon">{s.icon}</span>}
              {s.name}
            </td>
            <td>{s.category ?? "—"}</td>
            <td className="wide">{s.description}</td>
            <td className="num">{rupees(s.actualPrice)}</td>
            <td className="num">{s.displayPrice ?? "—"}</td>
            <td className="num">{s.bookingCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CustomersTable({ rows }: { rows: CustomerRow[] }) {
  if (!rows.length) return <Empty label="customers" />;
  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td className="strong">
              <span className="stats-user">
                {c.profile ? (
                  <img className="stats-avatar" src={c.profile} alt="" />
                ) : (
                  <span className="stats-avatar stats-avatar--letter">
                    {c.username.charAt(0).toUpperCase()}
                  </span>
                )}
                {c.username}
              </span>
            </td>
            <td>{c.email}</td>
            <td>{c.mobileNumber}</td>
            <td>{c.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function statusClass(status: string | null) {
  const s = (status ?? "").toUpperCase();
  if (["CONFIRMED", "COMPLETED"].includes(s)) return "stats-badge--good";
  if (["REJECTED", "CANCELLED"].includes(s)) return "stats-badge--bad";
  if (s) return "stats-badge--wait";
  return "stats-badge--none";
}

interface BookingsTableProps {
  rows: BookingRow[];
  onEdit: (booking: BookingRow, status: BookingStatus) => void;
}

function BookingsTable({ rows, onEdit }: BookingsTableProps) {
  if (!rows.length) return <Empty label="bookings" />;
  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Service</th>
          <th>Date</th>
          <th>Time</th>
          <th>Address</th>
          <th className="num">Total</th>
          <th>Status</th>
          <th>Reason</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>
              <div className="strong">{b.customerName}</div>
              <div className="stats-sub">{b.customerEmail}</div>
              <div className="stats-sub">{b.customerMobile}</div>
            </td>
            <td>
              <div className="strong">{b.serviceName}</div>
              <div className="stats-sub">{rupees(b.servicePrice)}</div>
            </td>
            <td>{b.bookingDate ?? "—"}</td>
            <td>{b.bookingTime ?? "—"}</td>
            <td className="wide">{b.address ?? "—"}</td>
            <td className="num">{rupees(b.totalAmount)}</td>
            <td>
              <span className={`stats-badge ${statusClass(b.status)}`}>
                {b.status ? statusLabel(b.status) : "Pending"}
              </span>
            </td>
            <td className="wide">{b.reason ?? "—"}</td>
            <td>
              <div className="stats-actions">
                <button
                  type="button"
                  className="stats-action stats-action--confirm"
                  onClick={() => onEdit(b, "CONFIRMED")}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="stats-action stats-action--reject"
                  onClick={() => onEdit(b, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface UpdateDialogProps {
  booking: BookingRow;
  initialStatus: BookingStatus;
  onClose: () => void;
  onSaved: (updated: BookingRow) => void;
}

// PATCH /service-provider/booking/{id}/status?status=...&reason=...
function UpdateStatusDialog({ booking, initialStatus, onClose, onSaved }: UpdateDialogProps) {
  const [status, setStatus] = useState<BookingStatus>(initialStatus);
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const reasonError = validateReason(reason);
  const showError = touched && reasonError;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (reasonError) return;

    setSaving(true);
    setServerError("");
    try {
      const res = await axios.patch<BookingRow>(
        `${BASE_URL}/service-provider/booking/${booking.id}/status`,
        null,
        { params: { status, reason: reason.trim() }, headers: authHeaders() }
      );
      onSaved(res.data);
    } catch (err) {
      setServerError(describeError(err));
      setSaving(false);
    }
  };

  return (
    <div className="stats-overlay" onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <form
        className="stats-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-dialog-title"
        onSubmit={submit}
        noValidate
      >
        <h2 id="stats-dialog-title" className="stats-dialog-title">
          Update booking #{booking.id}
        </h2>
        <p className="stats-dialog-sub">
          {booking.serviceName} for {booking.customerName}
        </p>

        <label className="stats-field">
          <span className="stats-label">Status</span>
          <select
            className="stats-input"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>

        <label className="stats-field">
          <span className="stats-label">Reason</span>
          <textarea
            className={`stats-input stats-textarea ${showError ? "stats-input--invalid" : ""}`}
            rows={3}
            maxLength={REASON_MAX}
            value={reason}
            placeholder="Why is the status changing?"
            aria-invalid={!!showError}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            autoFocus
          />
          <span className="stats-field-foot">
            <span className={showError ? "stats-field-error" : ""}>{showError || " "}</span>
            <span>
              {reason.trim().length}/{REASON_MAX}
            </span>
          </span>
        </label>

        {serverError && (
          <p className="stats-dialog-error" role="alert">
            {serverError}
          </p>
        )}

        <div className="stats-dialog-actions">
          <button type="button" className="stats-btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="stats-btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export const ServiceProviderStats = () => {
  const [tab, setTab] = useState<TabKey>("services");
  const [data, setData] = useState<Partial<TabData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ booking: BookingRow; status: BookingStatus } | null>(
    null
  );

  const navigate = useNavigate();

  const load = useCallback(async (key: TabKey) => {
    const { path } = TABS.find((t) => t.key === key)!;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}${path}`, { headers: authHeaders() });
      setData((prev) => ({ ...prev, [key]: res.data }));
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a tab the first time it is opened; later visits reuse the result.
  useEffect(() => {
    if (data[tab] === undefined) load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, load]);

  const handleSaved = (updated: BookingRow) => {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings?.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)),
    }));
    setEditing(null);
  };

  const rows = data[tab];

  return (
    <div className="stats-page">
      <WaterBubbles />

      <header className="stats-header">
        <h1 className="stats-title">Platform overview</h1>
        <button
          type="button"
          className="stats-refresh"
          onClick={() => load(tab)}
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      <div className="stats-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`stats-tab ${tab === t.key ? "stats-tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {data[t.key] && <span className="stats-count">{data[t.key]!.length}</span>}
          </button>
        ))}
      </div>

      <section className="stats-panel" role="tabpanel">
        {error && (
          <div className="stats-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => load(tab)}>
              Try again
            </button>
          </div>
        )}

        {!error && rows === undefined && loading && (
          <p className="stats-empty">Loading {tab}…</p>
        )}

        {rows !== undefined && (
          <div className="stats-scroll">
            {tab === "services" && <ServicesTable rows={data.services!} />}
            {tab === "customers" && <CustomersTable rows={data.customers!} />}
            {tab === "bookings" && (
              <BookingsTable
                rows={data.bookings!}
                onEdit={(booking, status) => setEditing({ booking, status })}
              />
            )}
          </div>
        )}
      </section>

      {editing && (
        <UpdateStatusDialog
          booking={editing.booking}
          initialStatus={editing.status}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
      <button
        className="back-home-button"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
};