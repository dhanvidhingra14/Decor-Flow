import { useEffect, useState } from "react";
import API from "../api/api";

function VenueManagement({ onVenueChanged }) {

    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingVenue, setEditingVenue] = useState(null);

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: ""
    });

    // ==========================================
    // LOAD VENUES
    // ==========================================

    const loadVenues = async () => {

        try {

            setLoading(true);

            const response =
                await API.get("/venues");

            setVenues(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Venue loading error:",
                error
            );

            setVenues([]);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadVenues();

    }, []);

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    // ==========================================
    // ADD / UPDATE VENUE
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!form.name.trim()) {

            alert("Please enter venue name.");

            return;

        }

        try {

            if (editingVenue) {

                const response =
                    await API.put(
                        `/venues/${editingVenue._id}`,
                        form
                    );

                if (!response.data) {

                    alert(
                        "Failed to update venue."
                    );

                    return;

                }

                alert(
                    "Venue updated successfully!"
                );

            } else {

                await API.post(
                    "/venues",
                    form
                );

                alert(
                    "Venue added successfully!"
                );

            }

            setForm({
                name: "",
                address: "",
                phone: ""
            });

            setEditingVenue(null);

            await loadVenues();

            if (onVenueChanged) {

                onVenueChanged();

            }

        } catch (error) {

            console.error(
                "Venue save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save venue."
            );

        }

    };

    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (venue) => {

        setEditingVenue(venue);

        setForm({
            name: venue.name || "",
            address: venue.address || "",
            phone: venue.phone || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this venue?"
            );

        if (!confirmed) {

            return;

        }

        try {

            await API.delete(
                `/venues/${id}`
            );

            alert(
                "Venue deleted successfully!"
            );

            await loadVenues();

            if (onVenueChanged) {

                onVenueChanged();

            }

        } catch (error) {

            console.error(
                "Venue delete error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete venue."
            );

        }

    };

    // ==========================================
    // CANCEL
    // ==========================================

    const handleCancel = () => {

        setEditingVenue(null);

        setForm({
            name: "",
            address: "",
            phone: ""
        });

    };

    // ==========================================
    // UI
    // ==========================================

    return (

        <div
            style={{
                maxWidth: "900px",
                margin: "30px auto",
                padding: "25px"
            }}
        >

            <h1>
                Venue Management
            </h1>

            <p>
                Add and manage registered event venues.
            </p>

            {/* =================================
                ADD / EDIT FORM
            ================================= */}

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "25px",
                    marginTop: "25px",
                    marginBottom: "35px"
                }}
            >

                <h2>
                    {editingVenue
                        ? "Edit Venue"
                        : "Add New Venue"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    {/* NAME */}

                    <label>
                        <strong>
                            Venue Name
                        </strong>
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Example: Grand Palace"
                        required
                        style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "6px",
                            marginBottom: "18px",
                            boxSizing: "border-box"
                        }}
                    />

                    {/* ADDRESS */}

                    <label>
                        <strong>
                            Address
                        </strong>
                    </label>

                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Enter venue address"
                        rows="3"
                        style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "6px",
                            marginBottom: "18px",
                            boxSizing: "border-box"
                        }}
                    />

                    {/* PHONE */}

                    <label>
                        <strong>
                            Phone
                        </strong>
                    </label>

                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Venue contact number"
                        style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "6px",
                            marginBottom: "20px",
                            boxSizing: "border-box"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            padding: "11px 20px",
                            marginRight: "10px",
                            cursor: "pointer"
                        }}
                    >
                        {editingVenue
                            ? "Update Venue"
                            : "Add Venue"}
                    </button>

                    {editingVenue && (

                        <button
                            type="button"
                            onClick={handleCancel}
                            style={{
                                padding: "11px 20px",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>

                    )}

                </form>

            </div>

            {/* =================================
                VENUE LIST
            ================================= */}

            <h2>
                Registered Venues
            </h2>

            {loading ? (

                <p>
                    Loading venues...
                </p>

            ) : venues.length === 0 ? (

                <p>
                    No venues registered yet.
                </p>

            ) : (

                venues.map((venue) => (

                    <div
                        key={venue._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "15px"
                        }}
                    >

                        <h3>
                            {venue.name}
                        </h3>

                        <p>
                            <strong>
                                Address:
                            </strong>{" "}
                            {venue.address || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Phone:
                            </strong>{" "}
                            {venue.phone || "N/A"}
                        </p>

                        <button
                            onClick={() =>
                                handleEdit(venue)
                            }
                            style={{
                                padding: "8px 15px",
                                marginRight: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Edit
                        </button>

                        <button
                            onClick={() =>
                                handleDelete(
                                    venue._id
                                )
                            }
                            style={{
                                padding: "8px 15px",
                                cursor: "pointer"
                            }}
                        >
                            Delete
                        </button>

                    </div>

                ))

            )}

        </div>

    );

}

export default VenueManagement;