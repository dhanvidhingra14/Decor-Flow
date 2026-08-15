import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const adminDemo = { email: "admin@decorflow.com", password: "admin123" };

function Login({ onLogin }) {
    const [role, setRole] = useState("admin");
    const [clientMode, setClientMode] = useState("login");
    const [admin, setAdmin] = useState(adminDemo);
    const [client, setClient] = useState({ name: "", phone: "", email: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const selectRole = (nextRole) => { setRole(nextRole); setError(""); };
    const updateClient = (event) => setClient((previous) => ({ ...previous, [event.target.name]: event.target.value }));

    const completeLogin = (data) => {
        if (!data.token || !data.user?.role) throw new Error("The server returned an incomplete login response.");
        localStorage.setItem("decorflow_token", data.token);
        localStorage.setItem("decorflow_user", JSON.stringify(data.user));
        onLogin?.(data.user);
    };

    const submitAdmin = async (event) => {
        event.preventDefault();
        setLoading(true); setError("");
        try {
            const response = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...admin, role: "admin" }) });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || "Unable to sign in.");
            completeLogin(data);
        } catch (requestError) { setError(requestError.message || "Unable to sign in."); }
        finally { setLoading(false); }
    };

    const submitClient = async (event) => {
        event.preventDefault();
        setLoading(true); setError("");
        try {
            const endpoint = clientMode === "register" ? "/api/auth/client/register" : "/api/auth/client/login";
            const body = clientMode === "register" ? client : { phone: client.phone };
            const response = await fetch(`${API_URL}${endpoint.replace(/^\/api/, "")}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || "Unable to continue.");
            completeLogin(data);
        } catch (requestError) { setError(requestError.message || "Unable to continue."); }
        finally { setLoading(false); }
    };

    return <main className="auth-shell"><section className="auth-card" aria-labelledby="login-title"><div className="brand-mark">DF</div><p className="eyebrow">DecorFlow</p><h1 id="login-title">Welcome back.</h1><p className="auth-intro">Plan, manage, and enjoy beautiful spaces with ease.</p><div className="role-switch" aria-label="Choose account type"><button className={role === "admin" ? "role-option active" : "role-option"} onClick={() => selectRole("admin")} type="button">Admin</button><button className={role === "client" ? "role-option active" : "role-option"} onClick={() => selectRole("client")} type="button">Client</button></div>{error && <p className="auth-error" role="alert">{error}</p>}{role === "admin" ? <form onSubmit={submitAdmin}><label htmlFor="email">Email address</label><input id="email" type="email" value={admin.email} onChange={(event) => setAdmin({ ...admin, email: event.target.value })} required /><label htmlFor="password">Password</label><input id="password" type="password" value={admin.password} onChange={(event) => setAdmin({ ...admin, password: event.target.value })} required /><button className="button submit-button" disabled={loading} type="submit">{loading ? "Signing in..." : "Sign in as Admin"}</button><p className="demo-note">Demo admin credentials are already filled in.</p></form> : <><div className="client-mode"><button className={clientMode === "login" ? "client-mode-option active" : "client-mode-option"} onClick={() => { setClientMode("login"); setError(""); }} type="button">Sign in</button><button className={clientMode === "register" ? "client-mode-option active" : "client-mode-option"} onClick={() => { setClientMode("register"); setError(""); }} type="button">Create account</button></div><form onSubmit={submitClient}>{clientMode === "register" && <><label htmlFor="name">Your name</label><input id="name" name="name" value={client.name} onChange={updateClient} placeholder="Enter your full name" required /><label htmlFor="client-email">Email address <span className="optional-label">Optional</span></label><input id="client-email" name="email" type="email" value={client.email} onChange={updateClient} placeholder="name@example.com" /></>}<label htmlFor="phone">Mobile number</label><input id="phone" name="phone" inputMode="numeric" value={client.phone} onChange={updateClient} placeholder="10-digit mobile number" pattern="[0-9]{10}" required /><button className="button submit-button" disabled={loading} type="submit">{loading ? "Please wait..." : clientMode === "register" ? "Create account" : "Sign in with mobile"}</button></form><p className="demo-note">{clientMode === "register" ? "Add your name and mobile number; email is optional." : "New to DecorFlow? Create an account first."}</p></>}</section></main>;
}

export default Login;

