import { useState } from "react";

function MainLayout({ children }) {

    const [activeSection, setActiveSection] =
        useState("dashboard");

    return (
        <div
            style={{
                minHeight: "100vh",
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "30px",
                boxSizing: "border-box"
            }}
        >

            <header
                style={{
                    textAlign: "center",
                    marginBottom: "25px"
                }}
            >

                <h1
                    style={{
                        fontSize: "48px",
                        margin: "10px 0"
                    }}
                >
                    DecorFlow
                </h1>

                <p
                    style={{
                        fontSize: "18px",
                        color: "#666"
                    }}
                >
                    Event Decoration Management System
                </p>

            </header>


            <nav
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "35px"
                }}
            >

                <button
                    onClick={() =>
                        setActiveSection("dashboard")
                    }
                >
                    Dashboard
                </button>

                <button
                    onClick={() =>
                        setActiveSection("customers")
                    }
                >
                    Customers
                </button>

                <button
                    onClick={() =>
                        setActiveSection("packages")
                    }
                >
                    Packages
                </button>

                <button
                    onClick={() =>
                        setActiveSection("bookings")
                    }
                >
                    Bookings
                </button>

                <button
                    onClick={() =>
                        setActiveSection("payments")
                    }
                >
                    Payments
                </button>

            </nav>


            <main>
                {children[activeSection]}
            </main>

        </div>
    );
}

export default MainLayout;