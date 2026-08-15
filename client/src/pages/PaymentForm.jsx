import { useEffect, useState } from "react";
import API from "../api/api";

function PaymentForm({ onPaymentCreated }) {

    const [bookings, setBookings] = useState([]);

    const [formData, setFormData] = useState({
        booking: "",
        amount: "",
        paymentMethod: "Cash",
        notes: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ==========================================
    // LOAD BOOKINGS
    // ==========================================

    const loadBookings = async () => {

        try {

            const response =
                await API.get("/bookings");

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data.bookings || [];

            setBookings(data);

        } catch (error) {

            console.error(
                "Failed to load bookings:",
                error
            );

            setMessage(
                "Failed to load bookings."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadBookings();

    }, []);


    // ==========================================
    // SELECT BOOKING
    // ==========================================

    const handleBookingChange = (event) => {

        const bookingId =
            event.target.value;

        const selectedBooking =
            bookings.find(
                (booking) =>
                    String(booking._id) ===
                    String(bookingId)
            );

        if (!selectedBooking) {

            setFormData({
                booking: "",
                amount: "",
                paymentMethod: "Cash",
                notes: ""
            });

            return;
        }

        const total =
            Number(selectedBooking.budget || 0);

        const paid =
            Number(selectedBooking.paidAmount || 0);

        const balance =
            Math.max(total - paid, 0);

        setFormData((previous) => ({
            ...previous,
            booking: bookingId,
            amount: balance
        }));

    };


    // ==========================================
    // INPUT CHANGE
    // ==========================================

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


    // ==========================================
    // SUBMIT PAYMENT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");

        if (!formData.booking) {

            setMessage(
                "Please select a booking."
            );

            return;
        }

        if (
            formData.amount === "" ||
            Number(formData.amount) <= 0
        ) {

            setMessage(
                "Please enter a valid payment amount."
            );

            return;
        }

        const selectedBooking =
            bookings.find(
                (booking) =>
                    String(booking._id) ===
                    String(formData.booking)
            );

        if (!selectedBooking) {

            setMessage(
                "Booking not found."
            );

            return;
        }

        const total =
            Number(selectedBooking.budget || 0);

        const alreadyPaid =
            Number(selectedBooking.paidAmount || 0);

        const paymentAmount =
            Number(formData.amount);

        const balance =
            total - alreadyPaid;

        if (paymentAmount > balance) {

            setMessage(
                `Payment cannot be more than the remaining balance of ₹${balance.toLocaleString("en-IN")}.`
            );

            return;
        }

        try {

            setSaving(true);

            // ==================================
            // GENERATE TRANSACTION ID
            // ==================================

            const transactionId =
                "TXN-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase();

            // ==================================
            // DETERMINE PAYMENT STATUS
            // ==================================

            const newPaidAmount =
                alreadyPaid + paymentAmount;

            const paymentStatus =
                newPaidAmount >= total
                    ? "Paid"
                    : "Pending";

            // ==================================
            // CREATE PAYMENT
            // ==================================

            const paymentData = {

                booking:
                    selectedBooking._id,

                customer:
                    selectedBooking.customer?._id ||
                    selectedBooking.customer,

                amount:
                    paymentAmount,

                paymentMethod:
                    formData.paymentMethod,

                paymentStatus:
                    "Paid",

                transactionId:
                    transactionId,

                notes:
                    formData.notes

            };

            console.log(
                "PAYMENT DATA:",
                paymentData
            );

            const response =
                await API.post(
                    "/payments",
                    paymentData
                );

            console.log(
                "PAYMENT CREATED:",
                response.data
            );

            setMessage(
                `Payment recorded successfully! Transaction ID: ${transactionId}`
            );

            // ==================================
            // RESET
            // ==================================

            setFormData({
                booking: "",
                amount: "",
                paymentMethod: "Cash",
                notes: ""
            });

            await loadBookings();

            if (onPaymentCreated) {
                onPaymentCreated();
            }

        } catch (error) {

            console.error(
                "Payment error:",
                error.response?.data ||
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to record payment."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div>
                <h2>Register Payment</h2>
                <p>
                    Loading bookings...
                </p>
            </div>
        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div
            style={{
                maxWidth: "700px",
                margin: "30px auto"
            }}
        >

            <h2>
                Register Payment
            </h2>


            {message && (

                <div
                    style={{
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        background:
                            message.includes(
                                "successfully"
                            )
                                ? "#d4edda"
                                : "#f8d7da",
                        color:
                            message.includes(
                                "successfully"
                            )
                                ? "#155724"
                                : "#721c24"
                    }}
                >
                    {message}
                </div>

            )}


            <form
                onSubmit={handleSubmit}
                style={{
                    border:
                        "1px solid #ddd",
                    padding: "25px",
                    borderRadius: "12px"
                }}
            >

                {/* BOOKING */}

                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >

                    <label>
                        <strong>
                            Booking
                        </strong>
                    </label>

                    <select
                        value={
                            formData.booking
                        }
                        onChange={
                            handleBookingChange
                        }
                        required
                        style={{
                            display:
                                "block",
                            width: "100%",
                            padding: "10px",
                            marginTop: "6px"
                        }}
                    >

                        <option value="">
                            Select Booking
                        </option>

                        {bookings.map(
                            (booking) => {

                                const total =
                                    Number(
                                        booking.budget ||
                                        0
                                    );

                                const paid =
                                    Number(
                                        booking.paidAmount ||
                                        0
                                    );

                                const balance =
                                    Math.max(
                                        total -
                                        paid,
                                        0
                                    );

                                if (
                                    balance <= 0
                                ) {
                                    return null;
                                }

                                return (

                                    <option
                                        key={
                                            booking._id
                                        }
                                        value={
                                            booking._id
                                        }
                                    >

                                        {booking.eventType}
                                        {" - "}
                                        {booking.venue}
                                        {" - Balance ₹"}
                                        {balance.toLocaleString(
                                            "en-IN"
                                        )}

                                    </option>

                                );

                            }
                        )}

                    </select>

                </div>


                {/* AMOUNT */}

                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >

                    <label>
                        <strong>
                            Payment Amount
                        </strong>
                    </label>

                    <input
                        type="number"
                        name="amount"
                        value={
                            formData.amount
                        }
                        onChange={
                            handleChange
                        }
                        min="1"
                        step="1"
                        required
                        style={{
                            display:
                                "block",
                            width: "100%",
                            padding: "10px",
                            marginTop: "6px",
                            boxSizing:
                                "border-box"
                        }}
                    />

                </div>


                {/* PAYMENT METHOD */}

                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >

                    <label>
                        <strong>
                            Payment Method
                        </strong>
                    </label>

                    <select
                        name="paymentMethod"
                        value={
                            formData.paymentMethod
                        }
                        onChange={
                            handleChange
                        }
                        style={{
                            display:
                                "block",
                            width: "100%",
                            padding: "10px",
                            marginTop: "6px"
                        }}
                    >

                        <option value="Cash">
                            Cash
                        </option>

                        <option value="UPI">
                            UPI
                        </option>

                        <option value="Card">
                            Card
                        </option>

                        <option value="Bank Transfer">
                            Bank Transfer
                        </option>

                    </select>

                </div>


                {/* NOTES */}

                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >

                    <label>
                        <strong>
                            Notes
                        </strong>
                    </label>

                    <textarea
                        name="notes"
                        value={
                            formData.notes
                        }
                        onChange={
                            handleChange
                        }
                        rows="4"
                        placeholder="Payment notes"
                        style={{
                            display:
                                "block",
                            width: "100%",
                            padding: "10px",
                            marginTop: "6px",
                            boxSizing:
                                "border-box"
                        }}
                    />

                </div>


                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding:
                            "12px 25px",
                        border: "none",
                        borderRadius:
                            "8px",
                        cursor:
                            saving
                                ? "not-allowed"
                                : "pointer",
                        fontWeight:
                            "bold"
                    }}
                >

                    {saving
                        ? "Recording..."
                        : "Register Payment"
                    }

                </button>

            </form>

        </div>

    );

}

export default PaymentForm;

