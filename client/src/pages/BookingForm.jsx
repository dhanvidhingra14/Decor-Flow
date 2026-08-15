 import { useEffect, useState } from "react";
import API from "../api/api";

function BookingForm({ onBookingCreated }) {

    // ==========================================
    // DATA
    // ==========================================

    const [customers, setCustomers] = useState([]);
    const [packages, setPackages] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");


    // ==========================================
    // FORM DATA
    // ==========================================

    const [formData, setFormData] = useState({

        customer: "",

        eventType: "",

        eventDate: "",

        // VENUE
        venueType: "Registered",

        venue: "",

        venueAddress: "",

        venueContact: "",

        // PACKAGE
        packageId: "",

        packageName: "",

        // MONEY
        budget: "",

        paidAmount: "",

        // STATUS
        status: "Pending",

        assignedEmployees: [],

        notes: ""

    });


    // ==========================================
    // LOAD CUSTOMERS + PACKAGES
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                const [
                    customerResponse,
                    packageResponse
                ] = await Promise.all([

                    API.get("/customers"),

                    API.get("/packages")

                ]);


                console.log(
                    "CUSTOMERS:",
                    customerResponse.data
                );

                console.log(
                    "PACKAGES:",
                    packageResponse.data
                );


                // -------------------------------
                // CUSTOMERS
                // -------------------------------

                const customerData =
                    Array.isArray(
                        customerResponse.data
                    )
                        ? customerResponse.data
                        : customerResponse.data.customers || [];


                setCustomers(customerData);


                // -------------------------------
                // PACKAGES
                // -------------------------------

                const packageData =
                    Array.isArray(
                        packageResponse.data
                    )
                        ? packageResponse.data
                        : packageResponse.data.packages || [];


                setPackages(packageData);


            }
            catch (error) {

                console.error(
                    "Error loading customers/packages:",
                    error
                );


                setMessage(
                    "Unable to load customers or packages."
                );

            }
            finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


        useEffect(() => {
        API.get("/employees")
            .then((response) => setEmployees(Array.isArray(response.data) ? response.data : []))
            .catch(() => setEmployees([]));
    }, []);
// ==========================================
    // COMMON INPUT CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]: value})
        );

    };


        const handleEmployeeChange = (event) => {
        const assignedEmployees = Array.from(event.target.selectedOptions, (option) => option.value);
        setFormData((previous) => ({ ...previous, assignedEmployees }));
    };
// ==========================================
    // PACKAGE CHANGE
    // ==========================================

    const handlePackageChange = (event) => {

        const packageId =
            event.target.value;


        const selectedPackage =
            packages.find(
                (pkg) =>
                    String(pkg._id) ===
                    String(packageId)
            );


        if (selectedPackage) {

            const packagePrice =
                Number(
                    selectedPackage.price || 0
                );


            setFormData(
                (previous) => ({

                    ...previous,

                    packageId:
                        packageId,

                    packageName:
                        selectedPackage.name ||
                        selectedPackage.packageName ||
                        "",

                    // AUTOMATIC PACKAGE PRICE
                    budget:
                        packagePrice

                })
            );

        }
        else {

            setFormData(
                (previous) => ({

                    ...previous,

                    packageId: "",

                    packageName: "",

                    budget: ""

                })
            );

        }

    };


    // ==========================================
    // VENUE TYPE CHANGE
    // ==========================================

    const handleVenueTypeChange = (event) => {

        const venueType =
            event.target.value;


        setFormData(
            (previous) => ({

                ...previous,

                venueType:

                    venueType,

                venue: "",

                venueAddress: "",

                venueContact: ""

            })
        );

    };


    // ==========================================
    // CALCULATE BALANCE
    // ==========================================

    const totalAmount =
        Number(
            formData.budget || 0
        );


    const advanceAmount = 0;


    const balanceAmount =
        Math.max(
            totalAmount - advanceAmount,
            0
        );


    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    const paymentStatus = "Unpaid";


    // ==========================================
    // SUBMIT BOOKING
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");


        // ======================================
        // VALIDATION
        // ======================================

        if (!formData.customer) {

            setMessage(
                "Please select a customer."
            );

            return;

        }


        if (!formData.eventType) {

            setMessage(
                "Please select an event type."
            );

            return;

        }


        if (!formData.eventDate) {

            setMessage(
                "Please select an event date."
            );

            return;

        }


        if (!formData.venue) {

            setMessage(
                "Please select or enter a venue."
            );

            return;

        }


        if (!formData.packageId) {

            setMessage(
                "Please select a package."
            );

            return;

        }


        if (
            totalAmount <= 0
        ) {

            setMessage(
                "Package amount must be greater than zero."
            );

            return;

        }


        if (
            advanceAmount < 0
        ) {

            setMessage(
                "Advance amount cannot be negative."
            );

            return;

        }


        if (
            advanceAmount > totalAmount
        ) {

            setMessage(
                "Advance amount cannot be greater than the total amount."
            );

            return;

        }


        try {

            // ==================================
            // BOOKING DATA
            // ==================================

            const bookingData = {

                customer:
                    formData.customer,

                eventType:
                    formData.eventType,

                eventDate:
                    formData.eventDate,

                // VENUE
                venueType:
                    formData.venueType,

                venue:
                    formData.venue,

                venueAddress:
                    formData.venueAddress,

                venueContact:
                    formData.venueContact,

                // PACKAGE
                packageName:
                    formData.packageName,

                assignedEmployees:
                    formData.assignedEmployees,

                // MONEY
                budget:
                    totalAmount,

                paidAmount:
                    advanceAmount,

                paymentStatus:
                    paymentStatus,

                // STATUS
                status:
                    formData.status,

                notes:
                    formData.notes

            };


            console.log(
                "================================"
            );

            console.log(
                "BOOKING DATA:",
                bookingData
            );

            console.log(
                "TOTAL:",
                totalAmount
            );

            console.log(
                "ADVANCE:",
                advanceAmount
            );

            console.log(
                "BALANCE:",
                balanceAmount
            );

            console.log(
                "PAYMENT STATUS:",
                paymentStatus
            );

            console.log(
                "================================"
            );


            // ==================================
            // CREATE BOOKING
            // ==================================

            const response =
                await API.post(
                    "/bookings",
                    bookingData
                );


            console.log(
                "BOOKING CREATED:",
                response.data
            );


            // ==================================
            // SUCCESS
            // ==================================

            setMessage(
                "Booking created successfully!"
            );


            // ==================================
            // RESET FORM
            // ==================================

            setFormData({

                customer: "",

                eventType: "",

                eventDate: "",

                venueType: "Registered",

                venue: "",

                venueAddress: "",

                venueContact: "",

                packageId: "",

                packageName: "",

                budget: "",

                paidAmount: "",

                status: "Pending",

                assignedEmployees: [],

        notes: ""

            });


            // ==================================
            // REFRESH
            // ==================================

            if (onBookingCreated) {

                onBookingCreated();

            }


        }
        catch (error) {

            console.error(
                "Booking error:",
                error.response?.data ||
                error
            );


            setMessage(

                error.response?.data?.message ||

                "Failed to create booking."

            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div
                style={{
                    maxWidth: "700px",
                    margin: "30px auto",
                    padding: "20px"
                }}
            >

                <p>
                    Loading customers and packages...
                </p>

            </div>

        );

    }


    // ==========================================
    // STYLES
    // ==========================================

    const inputStyle = {

        width: "100%",

        padding: "12px",

        marginTop: "6px",

        boxSizing: "border-box",

        border:
            "1px solid #ccc",

        borderRadius: "7px",

        fontSize: "15px"

    };


    const sectionStyle = {

        marginBottom: "18px"

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div
            style={{
                maxWidth: "700px",
                margin: "30px auto",
                padding: "25px",
                border:
                    "1px solid #ddd",
                borderRadius: "12px",
                background: "#ffffff",
                boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)"
            }}
        >

            <h2
                style={{
                    marginBottom: "5px"
                }}
            >
                Create Booking
            </h2>


            <p
                style={{
                    color: "#666",
                    marginTop: "5px",
                    marginBottom: "25px"
                }}
            >
                Create a new event booking
            </p>


            {/* =================================
                MESSAGE
            ================================= */}

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
                                : "#721c24",

                        fontWeight: "600"

                    }}
                >

                    {message}

                </div>

            )}


            <form
                onSubmit={handleSubmit}
            >


                {/* =================================
                    CUSTOMER
                ================================= */}

                <div
                    style={sectionStyle}
                >

                    <label>
                        <strong>
                            Customer
                        </strong>
                    </label>

                    <select
                        name="customer"
                        value={
                            formData.customer
                        }
                        onChange={
                            handleChange
                        }
                        required
                        style={inputStyle}
                    >

                        <option value="">
                            Select Customer
                        </option>


                        {customers.map(
                            (customer) => (

                                <option
                                    key={
                                        customer._id
                                    }
                                    value={
                                        customer._id
                                    }
                                >

                                    {
                                        customer.name ||
                                        customer.fullName ||
                                        customer.customerName ||
                                        "Customer"
                                    }

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =================================
                    EVENT TYPE
                ================================= */}

                <div
                    style={sectionStyle}
                >

                    <label>
                        <strong>
                            Event Type
                        </strong>
                    </label>

                    <select
                        name="eventType"
                        value={
                            formData.eventType
                        }
                        onChange={
                            handleChange
                        }
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

                        <option value="Corporate">
                            Corporate
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

                        <option value="Baby Shower">
                            Baby Shower
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                </div>


                {/* =================================
                    EVENT DATE
                ================================= */}

                <div
                    style={sectionStyle}
                >

                    <label>
                        <strong>
                            Event Date
                        </strong>
                    </label>

                    <input
                        type="date"
                        name="eventDate"
                        value={
                            formData.eventDate
                        }
                        onChange={
                            handleChange
                        }
                        required
                        style={inputStyle}
                    />

                </div>


                {/* =================================
                    VENUE TYPE
                ================================= */}

                <div
                    style={sectionStyle}
                >

                    <label>
                        <strong>
                            Venue Type
                        </strong>
                    </label>

                    <select
                        value={
                            formData.venueType
                        }
                        onChange={
                            handleVenueTypeChange
                        }
                        style={inputStyle}
                    >

                        <option value="Registered">
                            Registered Venue
                        </option>

                        <option value="Customer">
                            Customer's Own Venue
                        </option>

                    </select>

                </div>


                {/* =================================
                    REGISTERED VENUE
                ================================= */}

                {formData.venueType ===
                    "Registered" && (

                    <div
                        style={sectionStyle}
                    >

                        <label>
                            <strong>
                                Registered Venue
                            </strong>
                        </label>

                        <select
                            name="venue"
                            value={
                                formData.venue
                            }
                            onChange={
                                handleChange
                            }
                            required
                            style={inputStyle}
                        >

                            <option value="">
                                Select Registered Venue
                            </option>

                            <option value="The Heritage">
                                The Heritage
                            </option>

                            <option value="Sandoz">
                                Sandoz
                            </option>

                            <option value="The Grand Palace">
                                The Grand Palace
                            </option>

                            <option value="The Leela Ambience">
                                The Leela Ambience
                            </option>

                            <option value="ITC Grand Bharat">
                                ITC Grand Bharat
                            </option>

                            <option value="Taj City Centre">
                                Taj City Centre
                            </option>

                            <option value="Hyatt Regency Gurgaon">
                                Hyatt Regency Gurgaon
                            </option>

                            <option value="Radisson Blu Gurgaon">
                                Radisson Blu Gurgaon
                            </option>

                            <option value="The Westin Gurgaon">
                                The Westin Gurgaon
                            </option>

                            <option value="Crowne Plaza Gurgaon">
                                Crowne Plaza Gurgaon
                            </option>

                            <option value="The Umrao">
                                The Umrao
                            </option>

                            <option value="Vivanta New Delhi">
                                Vivanta New Delhi
                            </option>

                            <option value="Taj Palace New Delhi">
                                Taj Palace New Delhi
                            </option>

                            <option value="The Ashok">
                                The Ashok
                            </option>

                            <option value="Pullman New Delhi">
                                Pullman New Delhi
                            </option>

                        </select>

                    </div>

                )}


                {/* =================================
                    CUSTOMER VENUE
                ================================= */}

                {formData.venueType ===
                    "Customer" && (

                    <>

                        <div
                            style={sectionStyle}
                        >

                            <label>
                                <strong>
                                    Venue Name
                                </strong>
                            </label>

                            <input
                                type="text"
                                name="venue"
                                value={
                                    formData.venue
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter customer's venue"
                                required
                                style={inputStyle}
                            />

                        </div>


                        <div
                            style={sectionStyle}
                        >

                            <label>
                                <strong>
                                    Venue Address
                                </strong>
                            </label>

                            <textarea
                                name="venueAddress"
                                value={
                                    formData.venueAddress
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter venue address"
                                rows="3"
                                style={{
                                    ...inputStyle,
                                    resize:
                                        "vertical"
                                }}
                            />

                        </div>


                        <div
                            style={sectionStyle}
                        >

                            <label>
                                <strong>
                                    Venue Contact
                                </strong>
                            </label>

                            <input
                                type="text"
                                name="venueContact"
                                value={
                                    formData.venueContact
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter venue contact number"
                                style={inputStyle}
                            />

                        </div>

                    </>

                )}


                {/* =================================
                    PACKAGE
                ================================= */}

                <div
                    style={sectionStyle}
                >

                    <label>
                        <strong>
                            Package
                        </strong>
                    </label>

                    <select
                        name="packageId"
                        value={
                            formData.packageId
                        }
                        onChange={
                            handlePackageChange
                        }
                        required
                        style={inputStyle}
                    >

                        <option value="">
                            Select Package
                        </option>


                        {packages.map(
                            (pkg) => (

                                <option
                                    key={
                                        pkg._id
                                    }
                                    value={
                                        pkg._id
                                    }
                                >

                                    {
                                        pkg.name ||
                                        pkg.packageName ||
                                        "Package"
                                    }

                                    {" - ₹"}

                                    {Number(
                                        pkg.price || 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =================================
                    TOTAL AMOUNT
                ================================= */}

                <div
                    style={{
                        marginBottom: "18px",
                        padding: "15px",
                        background: "#f1f8ff",
                        borderRadius: "8px",
                        border:
                            "1px solid #cfe2ff"
                    }}
                >

                    <label>
                        <strong>
                            Total Amount
                        </strong>
                    </label>

                    <div
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginTop: "6px"
                        }}
                    >

                        ₹
                        {totalAmount.toLocaleString(
                            "en-IN"
                        )}

                    </div>

                    <small
                        style={{
                            color: "#666"
                        }}
                    >
                        Automatically taken from
                        selected package.
                    </small>

                </div>


                {/* =================================
                    ADVANCE
                ================================= */}

                <div
                    style={sectionStyle}
                >

                    <label>
                        <strong>
                            Advance payment (record separately)
                        </strong>
                    </label>

                    <input
                        type="number"
                        name="paidAmount"
                        value={
                            formData.paidAmount
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Payments are recorded separately" disabled
                        min="0"
                        max={totalAmount}
                        step="1"
                        style={inputStyle}
                    />

                </div>


                {/* =================================
                    BALANCE
                ================================= */}

                <div
                    style={{
                        marginBottom: "18px",
                        padding: "15px",
                        background:
                            balanceAmount === 0
                                ? "#d4edda"
                                : "#fff3cd",
                        borderRadius: "8px"
                    }}
                >

                    <div>
                        <strong>
                            Balance Amount
                        </strong>
                    </div>

                    <div
                        style={{
                            fontSize: "22px",
                            fontWeight: "bold",
                            marginTop: "5px"
                        }}
                    >

                        ₹
                        {balanceAmount.toLocaleString(
                            "en-IN"
                        )}

                    </div>

                    <div
                        style={{
                            marginTop: "5px",
                            fontWeight: "bold"
                        }}
                    >

                        Payment Status:{" "}

                        {paymentStatus}

                    </div>

                </div>


                {/* =================================
                    BOOKING STATUS
                ================================= */}

                <div
                    style={sectionStyle}
                >

                    <label>
                        <strong>
                            Booking Status
                        </strong>
                    </label>

                    <select
                        name="status"
                        value={
                            formData.status
                        }
                        onChange={
                            handleChange
                        }
                        style={inputStyle}
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

                </div>


                                <div style={sectionStyle}>
                    <label><strong>Assign employees</strong></label>
                    <select multiple value={formData.assignedEmployees} onChange={handleEmployeeChange} style={{ ...inputStyle, minHeight: "110px" }}>
                        {employees.length === 0 ? <option disabled>No employees available</option> : employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.name} — {employee.role}</option>)}
                    </select>
                    <small style={{ color: "#666" }}>Hold Ctrl (Windows) or Cmd (Mac) to choose more than one employee.</small>
                </div>
{/* =================================
                    NOTES
                ================================= */}

                <div
                    style={sectionStyle}
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
                        placeholder="Enter notes"
                        rows="4"
                        style={{
                            ...inputStyle,
                            resize:
                                "vertical"
                        }}
                    />

                </div>


                {/* =================================
                    SUMMARY
                ================================= */}

                <div
                    style={{
                        padding: "18px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        background: "#f8f9fa",
                        border:
                            "1px solid #ddd"
                    }}
                >

                    <h3
                        style={{
                            marginTop: 0
                        }}
                    >
                        Booking Summary
                    </h3>

                    <p>
                        <strong>
                            Total:
                        </strong>{" "}
                        ₹
                        {totalAmount.toLocaleString(
                            "en-IN"
                        )}
                    </p>

                    <p>
                        <strong>
                            Advance:
                        </strong>{" "}
                        ₹
                        {advanceAmount.toLocaleString(
                            "en-IN"
                        )}
                    </p>

                    <p>
                        <strong>
                            Balance:
                        </strong>{" "}
                        ₹
                        {balanceAmount.toLocaleString(
                            "en-IN"
                        )}
                    </p>

                    <p>
                        <strong>
                            Payment:
                        </strong>{" "}
                        {paymentStatus}
                    </p>

                </div>


                {/* =================================
                    SUBMIT
                ================================= */}

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "13px",
                        border: "none",
                        borderRadius: "8px",
                        background:
                            "#2563eb",
                        color: "#ffffff",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >

                    Create Booking

                </button>

            </form>

        </div>

    );

}

export default BookingForm;



