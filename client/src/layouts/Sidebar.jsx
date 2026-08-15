import { NavLink } from "react-router-dom";

function Sidebar() {

    const menuItems = [
        {
            name: "Dashboard",
            path: "/"
        },
        {
            name: "Customers",
            path: "/customers"
        },
        {
            name: "Packages",
            path: "/packages"
        },
        {
            name: "Bookings",
            path: "/bookings"
        },
        {
            name: "Payments",
            path: "/payments"
        }
    ];

    return (

        <aside
            style={{
                width: "240px",
                minHeight: "100vh",
                borderRight: "1px solid #ddd",
                padding: "25px",
                boxSizing: "border-box"
            }}
        >

            <h2>
                DecorFlow
            </h2>

            <p>
                Event Management
            </p>

            {menuItems.map((item) => (

                <NavLink
                    key={item.path}
                    to={item.path}
                    style={({ isActive }) => ({
                        display: "block",
                        padding: "12px",
                        marginBottom: "8px",
                        textDecoration: "none",
                        borderRadius: "8px",
                        background:
                            isActive
                                ? "#eee"
                                : "transparent",
                        color: "#222"
                    })}
                >

                    {item.name}

                </NavLink>

            ))}

        </aside>

    );

}

export default Sidebar;