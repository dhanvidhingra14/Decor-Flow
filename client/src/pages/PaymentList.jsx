import { useEffect, useState } from "react";

function PaymentList({ refresh }) {

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editingPayment, setEditingPayment] = useState(null);


    // =========================================
    // LOAD PAYMENTS
    // =========================================

    const loadPayments = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/payments"
            );

            const data = await response.json();

            console.log(
                "Payments:",
                data
            );

            if (Array.isArray(data)) {

                setPayments(data);

            } else {

                setPayments([]);

            }

        } catch (error) {

            console.error(
                "Payment loading error:",
                error
            );

            setPayments([]);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

    loadPayments();

}, [refresh]);

    // =========================================
    // CUSTOMER NAME
    // =========================================

    const getCustomerName = (payment) => {

        if (
            payment.customer &&
            typeof payment.customer === "object"
        ) {

            return (
                payment.customer.name ||
                "Customer"
            );

        }

        if (payment.customerName) {

            return payment.customerName;

        }

        return "Customer";

    };


    // =========================================
    // BOOKING DETAILS
    // =========================================

    const getBooking = (payment) => {

        if (
            payment.booking &&
            typeof payment.booking === "object"
        ) {

            return payment.booking;

        }

        return null;

    };


        const printReceipt = (payment) => {
        const booking = getBooking(payment) || {};
        const escape = (value) => String(value || "—").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
        const receipt = window.open("", "_blank", "width=760,height=820");
        if (!receipt) return;
        receipt.document.write(`<!doctype html><html><head><title>DecorFlow Receipt</title><style>body{font-family:Arial,sans-serif;color:#292821;margin:42px;line-height:1.5}.top{display:flex;justify-content:space-between;border-bottom:1px solid #ddd;padding-bottom:20px}h1{margin:0;font-size:30px}h2{font-size:18px;margin-top:28px}.amount{font-size:30px;font-weight:700;margin:8px 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.item{background:#f8f8f5;padding:12px}.label{font-size:11px;color:#777;text-transform:uppercase;letter-spacing:.08em}@media print{body{margin:24px}}</style></head><body><div class="top"><div><h1>DecorFlow</h1><div>Payment receipt</div></div><div><div class="label">Receipt no.</div><strong>${escape(payment.transactionId || payment._id)}</strong></div></div><h2>Received from</h2><div class="grid"><div class="item"><div class="label">Customer</div><strong>${escape(getCustomerName(payment))}</strong></div><div class="item"><div class="label">Payment date</div><strong>${escape(new Date(payment.paymentDate || payment.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }))}</strong></div></div><h2>Payment details</h2><div class="amount">₹${Number(payment.amount || 0).toLocaleString("en-IN")}</div><div class="grid"><div class="item"><div class="label">Method</div><strong>${escape(payment.paymentMethod)}</strong></div><div class="item"><div class="label">Booking</div><strong>${escape(booking.eventType)} — ${escape(booking.venue)}</strong></div><div class="item"><div class="label">Package</div><strong>${escape(booking.packageName)}</strong></div><div class="item"><div class="label">Payment ID</div><strong>${escape(payment._id)}</strong></div></div>${payment.notes ? `<h2>Notes</h2><p>${escape(payment.notes)}</p>` : ""}<p style="margin-top:42px;color:#777">This is a computer-generated receipt from DecorFlow.</p><script>window.onload=()=>window.print()</script></body></html>`);
        receipt.document.close();
    };
// =========================================
    // EDIT PAYMENT
    // =========================================

    const handleEditChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setEditingPayment(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

    };


    // =========================================
    // UPDATE PAYMENT
    // =========================================

    const handleUpdate = async (event) => {

        event.preventDefault();


        if (!editingPayment) {

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/payments/${editingPayment._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            amount:
                                Number(
                                    editingPayment.amount
                                ),

                            paymentMethod:
                                editingPayment.paymentMethod,

                            transactionId:
                                editingPayment.transactionId,

                            notes:
                                editingPayment.notes
                        })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to update payment"
                );

                return;

            }


            alert(
                "Payment updated successfully"
            );


            setEditingPayment(null);

            loadPayments();

        } catch (error) {

            console.error(
                "Update payment error:",
                error
            );

            alert(
                "Server error while updating payment"
            );

        }

    };


    // =========================================
    // DELETE PAYMENT
    // =========================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this payment?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/payments/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to delete payment"
                );

                return;

            }


            alert(
                "Payment deleted successfully"
            );


            loadPayments();

        } catch (error) {

            console.error(
                "Delete payment error:",
                error
            );

            alert(
                "Server error while deleting payment"
            );

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div
                style={{
                    marginTop: "30px"
                }}
            >

                <h2>
                    Payment Records
                </h2>

                <p>
                    Loading payments...
                </p>

            </div>

        );

    }


    return (

        <div
            style={{
                marginTop: "30px"
            }}
        >

            <h2>
                Payment Records
            </h2>


            {/* =================================
                EDIT FORM
            ================================= */}

            {editingPayment && (

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "20px",
                        marginBottom:
                            "25px",
                        borderRadius:
                            "10px"
                    }}
                >

                    <h3>
                        Edit Payment
                    </h3>


                    <form
                        onSubmit={
                            handleUpdate
                        }
                    >

                        {/* AMOUNT */}

                        <label>
                            Amount
                        </label>

                        <input
                            type="number"
                            name="amount"
                            value={
                                editingPayment.amount ||
                                ""
                            }
                            onChange={
                                handleEditChange
                            }
                            min="0"
                            style={{
                                width: "100%",
                                padding:
                                    "10px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "15px",
                                boxSizing:
                                    "border-box"
                            }}
                        />


                        {/* PAYMENT METHOD */}

                        <label>
                            Payment Method
                        </label>

                        <select
                            name="paymentMethod"
                            value={
                                editingPayment.paymentMethod ||
                                "UPI"
                            }
                            onChange={
                                handleEditChange
                            }
                            style={{
                                width: "100%",
                                padding:
                                    "10px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "15px"
                            }}
                        >

                            <option value="UPI">
                                UPI
                            </option>

                            <option value="Card">
                                Card
                            </option>

                            <option value="Cash">
                                Cash
                            </option>

                            <option value="Bank Transfer">
                                Bank Transfer
                            </option>

                        </select>


                        {/* TRANSACTION ID */}

                        <label>
                            Transaction ID
                        </label>

                        <input
                            type="text"
                            name="transactionId"
                            value={
                                editingPayment.transactionId ||
                                ""
                            }
                            onChange={
                                handleEditChange
                            }
                            style={{
                                width: "100%",
                                padding:
                                    "10px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "15px",
                                boxSizing:
                                    "border-box"
                            }}
                        />


                        {/* NOTES */}

                        <label>
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            value={
                                editingPayment.notes ||
                                ""
                            }
                            onChange={
                                handleEditChange
                            }
                            rows="4"
                            style={{
                                width: "100%",
                                padding:
                                    "10px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "15px",
                                boxSizing:
                                    "border-box"
                            }}
                        />


                        <button
                            type="submit"
                            style={{
                                padding:
                                    "10px 20px",
                                marginRight:
                                    "10px"
                            }}
                        >
                            Save Changes
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setEditingPayment(
                                    null
                                )
                            }
                            style={{
                                padding:
                                    "10px 20px"
                            }}
                        >
                            Cancel
                        </button>

                    </form>

                </div>

            )}


            {/* =================================
                NO PAYMENTS
            ================================= */}

            {payments.length === 0 && (

                <p>
                    No payments found.
                </p>

            )}


            {/* =================================
                PAYMENT RECORDS
            ================================= */}

            {payments.map(
                (payment) => {

                    const booking =
                        getBooking(
                            payment
                        );


                    return (

                        <div
                            key={
                                payment._id
                            }
                            style={{
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "10px",
                                padding:
                                    "20px",
                                marginBottom:
                                    "15px"
                            }}
                        >

                            {/* CUSTOMER */}

                            <h3>
                                {
                                    getCustomerName(
                                        payment
                                    )
                                }
                            </h3>


                            {/* BOOKING */}

                            <p>

                                <strong>
                                    Booking:
                                </strong>{" "}

                                {
                                    booking?.eventType ||
                                    "Booking"
                                }

                                {booking?.venue && (

                                    <>
                                        {" - "}
                                        {
                                            booking.venue
                                        }
                                    </>

                                )}

                            </p>


                            {/* PACKAGE */}

                            {booking?.packageName && (

                                <p>

                                    <strong>
                                        Package:
                                    </strong>{" "}

                                    {
                                        booking.packageName
                                    }

                                </p>

                            )}


                            {/* AMOUNT */}

                            <p>

                                <strong>
                                    Amount:
                                </strong>{" "}

                                ₹
                                {
                                    Number(
                                        payment.amount ||
                                        0
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                }

                            </p>


                            {/* PAYMENT METHOD */}

                            <p>

                                <strong>
                                    Payment Method:
                                </strong>{" "}

                                {
                                    payment.paymentMethod ||
                                    "N/A"
                                }

                            </p>


                            {/* TRANSACTION ID */}

                            <p>

                                <strong>
                                    Transaction ID:
                                </strong>{" "}

                                {
                                    payment.transactionId ||
                                    "Not provided"
                                }

                            </p>


                            {/* NOTES */}

                            {payment.notes && (

                                <p>

                                    <strong>
                                        Notes:
                                    </strong>{" "}

                                    {
                                        payment.notes
                                    }

                                </p>

                            )}
{/* PAYMENT DATE */}

<p>

    <strong>
        Payment Date:
    </strong>{" "}

    {
        payment.createdAt
            ? new Date(
                payment.createdAt
            ).toLocaleString("en-IN")
            : "N/A"
    }

</p>

                            {/* PAYMENT ID */}

                            <p>

                                <strong>
                                    Payment ID:
                                </strong>{" "}

                                {
                                    payment._id
                                }

                            </p>


                            {/* BUTTONS */}

                            <div
                                style={{
                                    marginTop:
                                        "15px"
                                }}
                            >

                                <button
                                    onClick={() =>
                                        setEditingPayment(
                                            {
                                                ...payment
                                            }
                                        )
                                    }
                                    style={{
                                        padding:
                                            "10px 18px",
                                        marginRight:
                                            "10px"
                                    }}
                                >
                                    Edit
                                </button>


                                                                <button
                                    onClick={() => printReceipt(payment)}
                                    style={{ padding: "10px 18px", marginRight: "10px" }}
                                >
                                    Receipt
                                </button>
<button
                                    onClick={() =>
                                        handleDelete(
                                            payment._id
                                        )
                                    }
                                    style={{
                                        padding:
                                            "10px 18px"
                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    );

                }
            )}

        </div>

    );

}

export default PaymentList;
