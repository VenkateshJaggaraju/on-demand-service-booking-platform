import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./ServiceProviderStats.css";

const BASE_URL = "http://localhost:1086";

type TabKey = "services" | "customers" | "bookings";

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
  status: string | null;
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

// Change the key if you store your JWT under a different name.
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const describeError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    if (!err.response) return "Unable to connect to the server on localhost:1086.";
    if (err.response.status === 401 || err.response.status === 403)
      return "Access denied. Log in with an account that can view this data.";
    return `Request failed (${err.response.status}). Try again.`;
  }
  return "Something went wrong. Try again.";
};

function Empty({ label }: { label: string }) {
  return <p className="stats-empty">No {label} yet.</p>;
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
  if (["CONFIRMED", "ACCEPTED", "COMPLETED", "PAID"].includes(s)) return "stats-badge--good";
  if (["REJECTED", "CANCELLED", "FAILED"].includes(s)) return "stats-badge--bad";
  if (s) return "stats-badge--wait";
  return "stats-badge--none";
}

function BookingsTable({ rows }: { rows: BookingRow[] }) {
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
                {b.status ?? "Pending"}
              </span>
            </td>
            <td className="wide">{b.reason ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const ServiceProviderStats=()=> {
  const [tab, setTab] = useState<TabKey>("services");
  const [data, setData] = useState<Partial<TabData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const rows = data[tab];

  return (
    <div className="stats-page">
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
            {tab === "bookings" && <BookingsTable rows={data.bookings!} />}
          </div>
        )}
      </section>
    </div>
  );
}