import { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import "./App.css";

import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/CustomersPage";
import PackageManagement from "./pages/PackageManagement";
import VenueManagement from "./pages/VenueManagement";
import BookingForm from "./pages/BookingForm";
import BookingList from "./pages/BookingList";
import PaymentForm from "./pages/PaymentForm";
import PaymentList from "./pages/PaymentList";

import Login from "./components/Login";
import ClientDashboard from "./pages/ClientDashboard";
import EmployeesPage from "./pages/EmployeesPage";


// =====================================================
// EXISTING DECORFLOW APPLICATION
// =====================================================

function DecorFlowApp() {

    const [page, setPage] =
        useState("dashboard");

    const [refresh, setRefresh] =
        useState(0);


    const navigate =
        useNavigate();


    const refreshData = () => {

        setRefresh(
            previous =>
                previous + 1
        );

    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    return (

        <div
            className="admin-shell"
            style={{
                minHeight: "100vh",
                padding: "30px",
                maxWidth: "1100px",
                margin: "auto",
                boxSizing: "border-box"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >

                <h1>
                    DecorFlow
                </h1>


                <button
                    onClick={logout}
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "7px",
                        background: "#dc2626",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>

            </div>


            {/* NAVIGATION */}

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "30px"
                }}
            >

                <button
                    onClick={() =>
                        setPage("dashboard")
                    }
                >
                    Dashboard
                </button>


                <button
                    onClick={() =>
                        setPage("customers")
                    }
                >
                    Customers
                </button>


                <button
                    onClick={() =>
                        setPage("packages")
                    }
                >
                    Packages
                </button>


                <button
                    onClick={() =>
                        setPage("venues")
                    }
                >
                    Venues
                </button>


                <button
                    onClick={() =>
                        setPage("bookings")
                    }
                >
                    Bookings
                </button>


                <button
                    onClick={() =>
                        setPage("payments")
                    }
                >
                    Payments
                </button>

            
                <button
                    onClick={() => setPage("employees")}
                >
                    Employees
                </button>
</div>


            {/* DASHBOARD */}

            {page === "dashboard" && (

                <Dashboard refresh={refresh} onNavigate={setPage} />

            )}


            {/* CUSTOMERS */}

            {page === "customers" && (

                <CustomersPage
                    onCustomerChanged={
                        refreshData
                    }
                />

            )}


            {/* PACKAGES */}

            {page === "packages" && (

                <PackageManagement
                    onPackageChanged={
                        refreshData
                    }
                />

            )}


            {/* VENUES */}

            {page === "venues" && (

                <VenueManagement
                    onVenueChanged={
                        refreshData
                    }
                />

            )}


            {/* BOOKINGS */}

            {page === "bookings" && (

                <div>

                    <BookingForm
                        onBookingCreated={
                            refreshData
                        }
                    />

                    <hr />

                    <BookingList
                        refresh={refresh}
                    />

                </div>

            )}


            {/* PAYMENTS */}

            {page === "employees" && <EmployeesPage />}

            {page === "payments" && (

                <div>

                    <PaymentForm
                        onPaymentCreated={
                            refreshData
                        }
                    />

                    <hr />

                    <PaymentList
                        refresh={refresh}
                    />

                </div>

            )}

        </div>

    );

}


// =====================================================
// APP
// =====================================================

function LoginRedirect() {
    const navigate = useNavigate();
    const handleLogin = (user) => {
        localStorage.setItem("token", localStorage.getItem("decorflow_token") || "");
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);
        navigate(user.role === "client" ? "/client" : "/app", { replace: true });
    };
    return <Login onLogin={handleLogin} />;
}
function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<LoginRedirect />}
                />


                {/* EXISTING APP */}

                <Route
                    path="/app"
                    element={
                        <DecorFlowApp />
                    }
                />
                <Route
                    path="/client"
                    element={<ClientDashboard />}
                />
                {/* HOME */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* UNKNOWN URL */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;





