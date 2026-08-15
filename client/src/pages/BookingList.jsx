import { useEffect, useState } from "react";

function BookingList({ refresh }) {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingBooking, setEditingBooking] =
        useState(null);


    // =====================================
    // LOAD BOOKINGS
    // =====================================

    const loadBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/bookings"
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load bookings"
                );
            }

            if (!Array.isArray(data)) {

                throw new Error(
                    "Invalid booking data"
                );
            }

            setBookings(data);

        } catch (error) {

            console.error(
                "Booking loading error:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadBookings();

    }, [refresh]);


    // =====================================
    // START EDIT
    // =====================================

    const startEdit = (booking) => {

        setEditingBooking({

            ...booking,

            customer:
                booking.customer?._id ||
                booking.customer ||
                "",

            packageName:
                booking.packageName || "",

            eventType:
                booking.eventType || "",

            eventDate:
                booking.eventDate
                    ? String(
                        booking.eventDate
                    ).substring(0, 10)
                    : "",

            venue:
                booking.venue || "",

            budget:
                booking.budget || 0,

            paidAmount:
                booking.paidAmount || 0,

            status:
                booking.status ||
                "Pending",

            notes:
                booking.notes || ""

        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =====================================
    // EDIT INPUT
    // =====================================

    const handleEditChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setEditingBooking(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // =====================================
    // SAVE EDIT
    // =====================================

    const handleUpdate = async (event) => {

        event.preventDefault();

        if (!editingBooking) {
            return;
        }

        const total =
            Number(
                editingBooking.budget || 0
            );

        const advance =
            Number(
                editingBooking.paidAmount || 0
            );


        if (total < 0) {

            alert(
                "Total amount cannot be negative."
            );

            return;
        }


        if (advance < 0) {

            alert(
                "Advance amount cannot be negative."
            );

            return;
        }


        if (advance > total) {

            alert(
                "Advance amount cannot be greater than total amount."
            );

            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/bookings/${editingBooking._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customer:
                            editingBooking.customer,

                        packageName:
                            editingBooking.packageName,

                        eventType:
                            editingBooking.eventType,

                        eventDate:
                            editingBooking.eventDate,

                        venue:
                            editingBooking.venue,

                        budget:
                            total,

                        paidAmount:
                            advance,

                        status:
                            editingBooking.status,

                        notes:
                            editingBooking.notes

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to update booking"
                );

                return;
            }


            alert(
                "Booking updated successfully!"
            );


            setEditingBooking(null);

            loadBookings();


        } catch (error) {

            console.error(
                "Booking update error:",
                error
            );

            alert(
                "Server error while updating booking."
            );
        }
    };


    // =====================================
    // DELETE
    // =====================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this booking?"
            );

        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/bookings/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to delete booking"
                );

                return;
            }


            alert(
                "Booking deleted successfully!"
            );


            loadBookings();


        } catch (error) {

            console.error(
                "Delete booking error:",
                error
            );

            alert(
                "Server error while deleting booking."
            );
        }
    };


    // =====================================
    // CANCEL EDIT
    // =====================================

    const cancelEdit = () => {

        setEditingBooking(null);

    };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (
            <div
                style={{
                    padding: "30px"
                }}
            >

                <h2>
                    Booking Details
                </h2>

                <p>
                    Loading bookings...
                </p>

            </div>
        );
    }


    // =====================================
    // ERROR
    // =====================================

    if (error) {

        return (
            <div
                style={{
                    padding: "30px"
                }}
            >

                <h2>
                    Booking Details
                </h2>

                <p
                    style={{
                        color: "red",
                        fontWeight: "bold"
                    }}
                >
                    Error: {error}
                </p>


                <button
                    onClick={loadBookings}
                >
                    Retry
                </button>

            </div>
        );
    }


    // =====================================
    // EDIT FORM
    // =====================================

    return (

        <div
            style={{
                marginTop: "30px"
            }}
        >

            <h2>
                Booking Details
            </h2>


            {editingBooking && (

                <div
                    style={{
                        background: "#fff",
                        border: "2px solid #8b5cf6",
                        borderRadius: "16px",
                        padding: "25px",
                        marginBottom: "30px",
                        boxShadow:
                            "0 8px 25px rgba(0,0,0,0.08)"
                    }}
                >

                    <h2>
                        Edit Booking
                    </h2>


                    <form
                        onSubmit={handleUpdate}
                    >

                        {/* CUSTOMER */}

                        <label>
                            Customer
                        </label>

                        <input
                            type="text"
                            value={
                                editingBooking.customer?.name ||
                                "Customer"
                            }
                            readOnly
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "18px",
                                boxSizing:
                                    "border-box",
                                background:
                                    "#f3f4f6",
                                border:
                                    "1px solid #ddd",
                                borderRadius: "8px"
                            }}
                        />


                        {/* PACKAGE */}

                        <label>
                            Package
                        </label>

                        <input
                            type="text"
                            name="packageName"
                            value={
                                editingBooking.packageName
                            }
                            onChange={
                                handleEditChange
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "18px",
                                boxSizing:
                                    "border-box",
                                borderRadius: "8px",
                                border:
                                    "1px solid #ccc"
                            }}
                        />


                        {/* EVENT TYPE */}

                        <label>
                            Event Type
                        </label>

                        <select
                            name="eventType"
                            value={
                                editingBooking.eventType
                            }
                            onChange={
                                handleEditChange
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "18px",
                                borderRadius: "8px"
                            }}
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

                            <option value="Anniversary">
                                Anniversary
                            </option>

                            <option value="Corporate">
                                Corporate
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>


                        {/* DATE */}

                        <label>
                            Event Date
                        </label>

                        <input
                            type="date"
                            name="eventDate"
                            value={
                                editingBooking.eventDate
                            }
                            onChange={
                                handleEditChange
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "18px",
                                boxSizing:
                                    "border-box",
                                borderRadius: "8px"
                            }}
                        />


                        {/* VENUE */}

                        <label>
                            Venue
                        </label>

                        <input
                            type="text"
                            name="venue"
                            value={
                                editingBooking.venue
                            }
                            onChange={
                                handleEditChange
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "18px",
                                boxSizing:
                                    "border-box",
                                borderRadius: "8px"
                            }}
                        />


                        {/* TOTAL */}

                        <label>
                            Total Amount
                        </label>

                        <input
                            type="number"
                            name="budget"
                            min="0"
                            value={
                                editingBooking.budget
                            }
                            onChange={
                                handleEditChange
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "18px",
                                boxSizing:
                                    "border-box",
                                borderRadius: "8px"
                            }}
                        />


                        {/* ADVANCE */}

                        <label>
                            Advance Paid
                        </label>

                        <input
                            type="number"
                            name="paidAmount"
                            min="0"
                            value={
                                editingBooking.paidAmount
                            }
                            onChange={
                                handleEditChange
                            }
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "18px",
                                boxSizing:
                                    "border-box",
                                borderRadius: "8px"
                            }}
                        />


                        {/* BALANCE */}

                        <div
                            style={{
                                background:
                                    "#f3f4f6",
                                padding: "15px",
                                borderRadius: "10px",
                                marginBottom: "18px"
                            }}
                        >

                            <strong>
                                Balance:
                            </strong>{" "}

                            ₹
                            {Math.max(
                                Number(
                                    editingBooking.budget ||
                                    0
                                ) -
                                Number(
                                    editingBooking.paidAmount ||
                                    0
                                ),
                                0
                            ).toLocaleString("en-IN")}

                        </div>


                        {/* PAYMENT STATUS */}

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >

                            <strong>
                                Payment Status:
                            </strong>{" "}

                            {Number(
                                editingBooking.paidAmount ||
                                0
                            ) <= 0
                                ? "Unpaid"
                                : Number(
                                    editingBooking.paidAmount ||
                                    0
                                ) >= Number(
                                    editingBooking.budget ||
                                    0
                                )
                                    ? "Paid"
                                    : "Partially Paid"
                            }

                        </div>


                        {/* BOOKING STATUS */}

                        <label>
                            Booking Status
                        </label>

                        <select
                            name="status"
                            value={
                                editingBooking.status
                            }
                            onChange={
                                handleEditChange
                            }
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "18px",
                                borderRadius: "8px"
                            }}
                        >

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Confirmed">
                                Confirmed
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>

                        </select>


                        {/* NOTES */}

                        <label>
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            value={
                                editingBooking.notes
                            }
                            onChange={
                                handleEditChange
                            }
                            rows="4"
                            style={{
                                width: "100%",
                                padding: "11px",
                                marginTop: "6px",
                                marginBottom: "20px",
                                boxSizing:
                                    "border-box",
                                borderRadius: "8px"
                            }}
                        />


                        <button
                            type="submit"
                            style={{
                                padding:
                                    "11px 22px",
                                marginRight:
                                    "10px",
                                cursor:
                                    "pointer"
                            }}
                        >
                            Save Changes
                        </button>


                        <button
                            type="button"
                            onClick={cancelEdit}
                            style={{
                                padding:
                                    "11px 22px",
                                cursor:
                                    "pointer"
                            }}
                        >
                            Cancel
                        </button>

                    </form>

                </div>

            )}


            {/* =====================================
                BOOKING LIST
            ===================================== */}

            {bookings.length === 0 ? (

                <p>
                    No bookings found.
                </p>

            ) : (

                bookings.map((booking) => {

                    const total =
                        Number(
                            booking.budget || 0
                        );

                    const paid =
                        Number(
                            booking.paidAmount || 0
                        );

                    const balance =
                        Math.max(
                            total - paid,
                            0
                        );


                    return (

                        <div
                            key={booking._id}
                            style={{
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "14px",
                                padding:
                                    "20px",
                                marginBottom:
                                    "20px",
                                background:
                                    "#fff"
                            }}
                        >

                            <h3>
                                {
                                    booking.customer?.name ||
                                    booking.customerName ||
                                    "Customer"
                                }
                            </h3>


                            <p>
                                <strong>
                                    Package:
                                </strong>{" "}
                                {
                                    booking.packageName ||
                                    "N/A"
                                }
                            </p>


                            <p>
                                <strong>
                                    Event:
                                </strong>{" "}
                                {
                                    booking.eventType ||
                                    "N/A"
                                }
                            </p>


                            <p>
                                <strong>
                                    Date:
                                </strong>{" "}
                                {
                                    booking.eventDate
                                        ? String(
                                            booking.eventDate
                                        ).substring(
                                            0,
                                            10
                                        )
                                        : "N/A"
                                }
                            </p>


                            <p>
                                <strong>
                                    Venue:
                                </strong>{" "}
                                {
                                    booking.venue ||
                                    "N/A"
                                }
                            </p>


                            <p>
                                <strong>
                                    Total Amount:
                                </strong>{" "}
                                ₹
                                {total.toLocaleString(
                                    "en-IN"
                                )}
                            </p>


                            <p>
                                <strong>
                                    Advance Paid:
                                </strong>{" "}
                                ₹
                                {paid.toLocaleString(
                                    "en-IN"
                                )}
                            </p>


                            <p>
                                <strong>
                                    Balance:
                                </strong>{" "}
                                ₹
                                {balance.toLocaleString(
                                    "en-IN"
                                )}
                            </p>


                            <p>
                                <strong>
                                    Payment Status:
                                </strong>{" "}

                                {
                                    booking.paymentStatus ||
                                    (
                                        paid <= 0
                                            ? "Unpaid"
                                            : paid >= total
                                                ? "Paid"
                                                : "Partially Paid"
                                    )
                                }

                            </p>


                            <p>
                                <strong>
                                    Booking Status:
                                </strong>{" "}

                                {
                                    booking.status ||
                                    "Pending"
                                }

                            </p>


                            {booking.notes && (

                                <p>
                                    <strong>
                                        Notes:
                                    </strong>{" "}
                                    {booking.notes}
                                </p>

                            )}


                            {/* BUTTONS */}

                            <div
                                style={{
                                    marginTop:
                                        "20px"
                                }}
                            >

                                <button
                                    onClick={() =>
                                        startEdit(
                                            booking
                                        )
                                    }
                                    style={{
                                        padding:
                                            "10px 18px",
                                        marginRight:
                                            "10px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Edit Booking
                                </button>


                                <button
                                    onClick={() =>
                                        handleDelete(
                                            booking._id
                                        )
                                    }
                                    style={{
                                        padding:
                                            "10px 18px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    );
                })
            )}

        </div>
    );
}

export default BookingList;