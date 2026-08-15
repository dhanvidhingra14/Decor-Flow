import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  let user = {}; try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch { user = {}; }

  useEffect(() => { (async () => { try { const token = localStorage.getItem("token"); const response = await fetch("http://localhost:5000/api/bookings/mine", { headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); setBookings(response.ok && Array.isArray(data) ? data : []); } finally { setLoading(false); } })(); }, []);
  const logout = () => { ["token", "user", "role", "decorflow_token", "decorflow_user"].forEach((key) => localStorage.removeItem(key)); navigate("/login"); };

  return <main className="client-page"><header className="client-header"><div><p className="eyebrow">Client portal</p><h1>Hello, {user.name || "there"}.</h1><p>Everything you need for your planned event, in one place.</p></div><button className="button button-secondary" onClick={logout}>Log out</button></header><section className="client-bookings"><div className="section-heading"><div><p className="eyebrow">Your events</p><h2>My bookings</h2></div><span>{bookings.length} booking{bookings.length === 1 ? "" : "s"}</span></div>{loading ? <p>Loading bookings...</p> : bookings.length === 0 ? <p className="empty-state">No bookings have been created for your account yet.</p> : <div className="client-booking-list">{bookings.map((booking) => { const total = Number(booking.budget || 0); const paid = Number(booking.paidAmount || 0); const balance = Math.max(total - paid, 0); return <article className="client-booking-card" key={booking._id}><div className="booking-card-top"><div><h3>{booking.eventType}</h3><p>{new Date(booking.eventDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></div><span className="status-pill">{booking.status || "Pending"}</span></div><dl className="booking-details"><div><dt>Venue</dt><dd>{booking.venue}</dd></div><div><dt>Package</dt><dd>{booking.packageName}</dd></div>{booking.assignedEmployees?.length > 0 && <div><dt>Assigned team</dt><dd>{booking.assignedEmployees.map((employee) => employee.name).join(", ")}</dd></div>}<div><dt>Total amount</dt><dd>{money(total)}</dd></div><div><dt>Advance received</dt><dd>{money(paid)}</dd></div><div><dt>Balance due</dt><dd>{money(balance)}</dd></div><div><dt>Payment status</dt><dd>{booking.paymentStatus || "Unpaid"}</dd></div></dl>{booking.notes && <p className="booking-notes"><strong>Notes</strong>{booking.notes}</p>}</article>; })}</div>}</section></main>;
}

