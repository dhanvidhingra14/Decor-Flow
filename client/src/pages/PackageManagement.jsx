import { useEffect, useState } from "react";
import API from "../api/api";

function PackageManagement() {

    const [packages, setPackages] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        includes: "",
        duration: "",
        guests: "",
        status: "Active"
    });

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");


    // =====================================
    // LOAD PACKAGES
    // =====================================

    const loadPackages = async () => {

        try {

            const response =
                await API.get("/packages");

            setPackages(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load packages:",
                error
            );

            setMessage(
                "Failed to load packages."
            );

        }

    };


    useEffect(() => {

        loadPackages();

    }, []);


    // =====================================
    // INPUT CHANGE
    // =====================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // =====================================
    // ADD / UPDATE
    // =====================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");


        if (!formData.name.trim()) {

            setMessage(
                "Please enter package name."
            );

            return;

        }


        if (!formData.category) {

            setMessage(
                "Please select event type."
            );

            return;

        }


        if (
            formData.price === "" ||
            Number(formData.price) <= 0
        ) {

            setMessage(
                "Please enter a valid package price."
            );

            return;

        }


        try {

            const packageData = {

                name:
                    formData.name.trim(),

                category:
                    formData.category,

                price:
                    Number(formData.price),

                description:
                    formData.description.trim(),

                includes:
                    formData.includes.trim(),

                duration:
                    formData.duration,

                guests:
                    Number(formData.guests || 0),

                status:
                    formData.status

            };


            console.log(
                "PACKAGE DATA:",
                packageData
            );


            if (editingId) {

                await API.put(
                    `/packages/${editingId}`,
                    packageData
                );

                setMessage(
                    "Package updated successfully!"
                );

            } else {

                await API.post(
                    "/packages",
                    packageData
                );

                setMessage(
                    "Package added successfully!"
                );

            }


            resetForm();

            loadPackages();

        } catch (error) {

            console.error(
                "Save package error:",
                error.response?.data ||
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to save package."
            );

        }

    };


    // =====================================
    // RESET FORM
    // =====================================

    const resetForm = () => {

        setEditingId(null);

        setFormData({

            name: "",

            category: "",

            price: "",

            description: "",

            includes: "",

            duration: "",

            guests: "",

            status: "Active"

        });

    };


    // =====================================
    // EDIT
    // =====================================

    const handleEdit = (pkg) => {

        setEditingId(pkg._id);

        setFormData({

            name:
                pkg.name || "",

            category:
                pkg.category || "",

            price:
                pkg.price ?? "",

            description:
                pkg.description || "",

            includes:
                pkg.includes || "",

            duration:
                pkg.duration || "",

            guests:
                pkg.guests ?? "",

            status:
                pkg.status || "Active"

        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =====================================
    // DELETE
    // =====================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this package?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await API.delete(
                `/packages/${id}`
            );

            setMessage(
                "Package deleted successfully!"
            );

            loadPackages();

        } catch (error) {

            console.error(
                "Delete package error:",
                error
            );

            setMessage(
                "Failed to delete package."
            );

        }

    };


    // =====================================
    // INPUT STYLE
    // =====================================

    const inputStyle = {

        display: "block",

        width: "100%",

        padding: "12px",

        marginTop: "6px",

        marginBottom: "18px",

        boxSizing: "border-box",

        border:
            "1px solid #cbd5e1",

        borderRadius: "8px",

        fontSize: "15px",

        color: "#1f2937",

        backgroundColor: "#ffffff"

    };


    const labelStyle = {

        display: "block",

        fontWeight: "600",

        color: "#1f2937",

        marginBottom: "4px"

    };


    // =====================================
    // UI
    // =====================================

    return (

        <div
            style={{
                maxWidth: "1000px",
                margin: "30px auto",
                padding: "20px",
                color: "#1f2937"
            }}
        >

            {/* =================================
                TITLE
            ================================= */}

            <h1
                style={{
                    color: "#172554",
                    marginBottom: "5px"
                }}
            >
                Package Management
            </h1>

            <p
                style={{
                    color: "#64748b",
                    marginBottom: "25px"
                }}
            >
                Create and manage your event decoration
                packages.
            </p>


            {/* =================================
                MESSAGE
            ================================= */}

            {message && (

                <div
                    style={{
                        padding: "12px 15px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        backgroundColor:
                            message.includes(
                                "successfully"
                            )
                                ? "#dcfce7"
                                : "#fee2e2",
                        color:
                            message.includes(
                                "successfully"
                            )
                                ? "#166534"
                                : "#991b1b",
                        fontWeight: "600"
                    }}
                >
                    {message}
                </div>

            )}


            {/* =================================
                ADD PACKAGE FORM
            ================================= */}

            <div
                style={{
                    background:
                        "#ffffff",

                    border:
                        "1px solid #e2e8f0",

                    borderRadius:
                        "16px",

                    padding:
                        "25px",

                    boxShadow:
                        "0 8px 25px rgba(0,0,0,0.08)",

                    marginBottom:
                        "35px"
                }}
            >

                <h2
                    style={{
                        color: "#7c3aed",
                        marginTop: 0
                    }}
                >
                    {editingId
                        ? "Edit Package"
                        : "Add Package"
                    }
                </h2>


                {/* PACKAGE NAME */}

                <label style={labelStyle}>
                    Package Name
                </label>

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Royal Wedding Package"
                    required
                    style={inputStyle}
                />


                {/* EVENT TYPE */}

                <label style={labelStyle}>
                    Event Type
                </label>

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >

                    <option value="">
                        Select Event Type
                    </option>

                    <option value="Wedding">
                        Wedding
                    </option>

                    <option value="Birthday">
                        Birthday
                    </option>

                    <option value="Engagement">
                        Engagement
                    </option>

                    <option value="Reception">
                        Reception
                    </option>

                    <option value="Corporate">
                        Corporate
                    </option>

                    <option value="Baby Shower">
                        Baby Shower
                    </option>

                    <option value="Anniversary">
                        Anniversary
                    </option>

                    <option value="Other">
                        Other
                    </option>

                </select>


                {/* PRICE */}

                <label style={labelStyle}>
                    Package Price
                </label>

                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Example: 150000"
                    min="0"
                    step="1"
                    required
                    style={inputStyle}
                />

                <small
                    style={{
                        display: "block",
                        marginTop: "-10px",
                        marginBottom: "18px",
                        color: "#64748b"
                    }}
                >
                    Enter the exact package price.
                    Example: ₹50,000 or ₹1,50,000.
                </small>


                {/* DESCRIPTION */}

                <label style={labelStyle}>
                    Description
                </label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this package is suitable for..."
                    rows="4"
                    style={{
                        ...inputStyle,
                        resize: "vertical"
                    }}
                />


                {/* WHAT'S INCLUDED */}

                <label style={labelStyle}>
                    What's Included
                </label>

                <textarea
                    name="includes"
                    value={formData.includes}
                    onChange={handleChange}
                    placeholder="Example: Stage, flowers, entrance, lighting, tables and backdrop"
                    rows="4"
                    style={{
                        ...inputStyle,
                        resize: "vertical"
                    }}
                />

                <small
                    style={{
                        display: "block",
                        marginTop: "-10px",
                        marginBottom: "18px",
                        color: "#64748b"
                    }}
                >
                    Separate items using commas.
                </small>


                {/* DURATION */}

                <label style={labelStyle}>
                    Package Duration
                </label>

                <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Example: 8 hours"
                    style={inputStyle}
                />


                {/* GUESTS */}

                <label style={labelStyle}>
                    Number of Guests
                </label>

                <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="Example: 500"
                    min="0"
                    style={inputStyle}
                />


                {/* STATUS */}

                <label style={labelStyle}>
                    Status
                </label>

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={inputStyle}
                >

                    <option value="Active">
                        Active
                    </option>

                    <option value="Inactive">
                        Inactive
                    </option>

                </select>


                {/* BUTTONS */}

                <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                        padding:
                            "12px 24px",

                        border:
                            "none",

                        borderRadius:
                            "8px",

                        background:
                            "#7c3aed",

                        color:
                            "#ffffff",

                        fontWeight:
                            "bold",

                        fontSize:
                            "15px",

                        cursor:
                            "pointer",

                        marginRight:
                            "10px"
                    }}
                >
                    {editingId
                        ? "Update Package"
                        : "Add Package"
                    }
                </button>


                {editingId && (

                    <button
                        type="button"
                        onClick={resetForm}
                        style={{
                            padding:
                                "12px 24px",

                            border:
                                "1px solid #94a3b8",

                            borderRadius:
                                "8px",

                            background:
                                "#ffffff",

                            color:
                                "#334155",

                            fontWeight:
                                "bold",

                            cursor:
                                "pointer"
                        }}
                    >
                        Cancel
                    </button>

                )}

            </div>


            {/* =================================
                REGISTERED PACKAGES
            ================================= */}

            <h2
                style={{
                    color: "#172554",
                    marginBottom: "20px"
                }}
            >
                Registered Packages
            </h2>


            {packages.length === 0 ? (

                <div
                    style={{
                        padding: "25px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        border:
                            "1px solid #e2e8f0",
                        color: "#475569"
                    }}
                >
                    No packages registered yet.
                </div>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px"
                    }}
                >

                    {packages.map((pkg) => (

                        <div
                            key={pkg._id}
                            style={{
                                background:
                                    "#ffffff",

                                border:
                                    "1px solid #e2e8f0",

                                borderRadius:
                                    "14px",

                                padding:
                                    "20px",

                                boxShadow:
                                    "0 6px 18px rgba(0,0,0,0.07)"
                            }}
                        >

                            <h3
                                style={{
                                    color:
                                        "#7c3aed",

                                    marginTop:
                                        0,

                                    marginBottom:
                                        "8px"
                                }}
                            >
                                {pkg.name}
                            </h3>


                            <div
                                style={{
                                    display:
                                        "inline-block",

                                    padding:
                                        "5px 10px",

                                    borderRadius:
                                        "20px",

                                    background:
                                        pkg.status ===
                                        "Inactive"
                                            ? "#fee2e2"
                                            : "#dcfce7",

                                    color:
                                        pkg.status ===
                                        "Inactive"
                                            ? "#991b1b"
                                            : "#166534",

                                    fontSize:
                                        "12px",

                                    fontWeight:
                                        "bold",

                                    marginBottom:
                                        "12px"
                                }}
                            >
                                {pkg.status || "Active"}
                            </div>


                            <p
                                style={{
                                    color:
                                        "#475569"
                                }}
                            >
                                <strong>
                                    Event Type:
                                </strong>{" "}
                                {pkg.category ||
                                    "N/A"}
                            </p>


                            <p
                                style={{
                                    fontSize:
                                        "22px",

                                    fontWeight:
                                        "bold",

                                    color:
                                        "#059669"
                                }}
                            >
                                ₹
                                {Number(
                                    pkg.price || 0
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </p>


                            {pkg.description && (

                                <p
                                    style={{
                                        color:
                                            "#475569"
                                    }}
                                >
                                    <strong>
                                        Description:
                                    </strong>{" "}
                                    {pkg.description}
                                </p>

                            )}


                            {pkg.includes && (

                                <p
                                    style={{
                                        color:
                                            "#475569"
                                    }}
                                >
                                    <strong>
                                        Includes:
                                    </strong>{" "}
                                    {pkg.includes}
                                </p>

                            )}


                            {pkg.duration && (

                                <p
                                    style={{
                                        color:
                                            "#475569"
                                    }}
                                >
                                    <strong>
                                        Duration:
                                    </strong>{" "}
                                    {pkg.duration}
                                </p>

                            )}


                            {pkg.guests > 0 && (

                                <p
                                    style={{
                                        color:
                                            "#475569"
                                    }}
                                >
                                    <strong>
                                        Guests:
                                    </strong>{" "}
                                    {pkg.guests}
                                </p>

                            )}


                            {/* BUTTONS */}

                            <div
                                style={{
                                    marginTop:
                                        "18px"
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleEdit(
                                            pkg
                                        )
                                    }
                                    style={{
                                        padding:
                                            "9px 18px",

                                        border:
                                            "none",

                                        borderRadius:
                                            "7px",

                                        background:
                                            "#2563eb",

                                        color:
                                            "#ffffff",

                                        fontWeight:
                                            "bold",

                                        cursor:
                                            "pointer",

                                        marginRight:
                                            "10px"
                                    }}
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            pkg._id
                                        )
                                    }
                                    style={{
                                        padding:
                                            "9px 18px",

                                        border:
                                            "none",

                                        borderRadius:
                                            "7px",

                                        background:
                                            "#dc2626",

                                        color:
                                            "#ffffff",

                                        fontWeight:
                                            "bold",

                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default PackageManagement;