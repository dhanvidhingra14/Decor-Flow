import { useEffect, useState } from "react";
const api = "http://localhost:5000/api";

export default function Dashboard({ refresh, onNavigate }) {
  const [data, setData] = useState({ customers: [], bookings: [], payments: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { setLoading(true); const [customers, bookings, payments] = await Promise.all([fetch(`${api}/customers`).then(r => r.json()), fetch(`${api}/bookings`).then(r => r.json()), fetch(`${api}/payments`).then(r => r.json())]); setData({ customers: Array.isArray(customers) ? customers : [], bookings: Array.isArray(bookings) ? bookings : [], payments: Array.isArray(payments) ? payments : [] }); } catch (error) { console.error("Dashboard load failed", error); } finally { setLoading(false); } })(); }, [refresh]);
  const pending = data.bookings.filter(b => (b.status || "Pending") === "Pending").length;
  const confirmed = data.bookings.filter(b => b.status === "Confirmed").length;
  const collected = data.payments.reduce((total, payment) => total + Number(payment.amount || 0), 0);
  const cards = [["Customers", data.customers.length, "Registered customers", "customers"], ["Bookings", data.bookings.length, "Create or manage bookings", "bookings"], ["Pending", pending, "Review pending bookings", "bookings"], ["Confirmed", confirmed, "View confirmed events", "bookings"], ["Payments", data.payments.length, "Register a payment", "payments"], ["Collected", `₹${collected.toLocaleString("en-IN")}`, "View payment records", "payments"]];
  return <section className="dashboard-page"><header className="dashboard-hero"><p className="eyebrow">DecorFlow administration</p><h1>Overview</h1><p>Choose a section to manage customers, bookings, and payments.</p></header><div className="stat-grid">{cards.map(([label, value, detail, page]) => <button className="stat-card" key={label} onClick={() => onNavigate?.(page)}><span>{label}</span><strong>{loading ? "—" : value}</strong><small>{detail} <b>→</b></small></button>)}</div><section className="dashboard-panel"><div><p className="eyebrow">Payment rule</p><h2>Bookings stay unpaid until a payment is registered.</h2><p>A booking amount is only a quote. Payments are added only from the Payments section after money is received.</p></div><button className="button" onClick={() => onNavigate?.("payments")}>Register payment</button></section></section>;
}
