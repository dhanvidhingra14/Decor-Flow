import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    // =========================================
    // LOAD CUSTOMERS
    // =========================================

    const loadCustomers = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/customers`
            );

            const data = await response.json();

            console.log("Customers:", data);

            if (Array.isArray(data)) {
                setCustomers(data);
            } else {
                setCustomers([]);
            }

        } catch (error) {
            console.error(
                "Customer loading error:",
                error
            );

            setCustomers([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            phone: "",
            address: ""
        });
    };

    // =========================================
    // ADD CUSTOMER BUTTON
    // =========================================

    const handleShowAddForm = () => {
        setEditingCustomer(null);
        resetForm();

        setShowAddForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================================
    // INPUT CHANGE
    // =========================================

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

    // =========================================
    // ADD CUSTOMER
    // =========================================

    const handleAdd = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/customers`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(form)
                }
            );

            const data =
                await response.json();

            console.log(
                "Add customer response:",
                data
            );

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to add customer"
                );

                return;
            }

            alert(
                "Customer added successfully!"
            );

            setShowAddForm(false);

            resetForm();

            loadCustomers();

        } catch (error) {
            console.error(
                "Customer add error:",
                error
            );

            alert(
                "Server error while adding customer"
            );
        }
    };

    // =========================================
    // EDIT CUSTOMER
    // =========================================

    const handleEdit = (customer) => {
        setShowAddForm(false);

        setEditingCustomer(customer);

        setForm({
            name:
                customer.name ||
                "",

            email:
                customer.email ||
                "",

            phone:
                customer.phone ||
                "",

            address:
                customer.address ||
                ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================================
    // UPDATE CUSTOMER
    // =========================================

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!editingCustomer) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/customers/${editingCustomer._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(form)
                }
            );

            const data =
                await response.json();

            console.log(
                "Update response:",
                data
            );

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to update customer"
                );

                return;
            }

            alert(
                "Customer updated successfully!"
            );

            setEditingCustomer(null);

            resetForm();

            loadCustomers();

        } catch (error) {
            console.error(
                "Customer update error:",
                error
            );

            alert(
                "Server error while updating customer"
            );
        }
    };

    // =========================================
    // DELETE CUSTOMER
    // =========================================

    const handleDelete = async (customerId) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this customer?"
            );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/customers/${customerId}`,
                {
                    method: "DELETE"
                }
            );

            const data =
                await response.json();

            console.log(
                "Delete response:",
                data
            );

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to delete customer"
                );

                return;
            }

            alert(
                "Customer deleted successfully!"
            );

            loadCustomers();

        } catch (error) {
            console.error(
                "Customer delete error:",
                error
            );

            alert(
                "Server error while deleting customer"
            );
        }
    };

    // =========================================
    // CANCEL FORM
    // =========================================

    const handleCancel = () => {
        setEditingCustomer(null);
        setShowAddForm(false);
        resetForm();
    };

    // =========================================
    // UI
    // =========================================

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "30px auto",
                padding: "25px"
            }}
        >

            {/* =================================
                PAGE HEADER
            ================================= */}

            <h1>
                Customers
            </h1>

            <p
                style={{
                    fontSize: "18px",
                    color: "#6b5b7b"
                }}
            >
                Manage your DecorFlow customers.
            </p>


            {/* =================================
                ADD CUSTOMER BUTTON
            ================================= */}

            {!showAddForm &&
                !editingCustomer && (

                    <button
                        type="button"
                        onClick={
                            handleShowAddForm
                        }
                        style={{
                            marginTop: "20px",
                            marginBottom: "30px",
                            padding:
                                "14px 24px",
                            borderRadius:
                                "12px",
                            fontSize:
                                "16px",
                            fontWeight:
                                "700",
                            cursor:
                                "pointer",
                            color:
                                "#ffffff",
                            background:
                                "linear-gradient(135deg, #7c3aed, #ec4899)",
                            border:
                                "none",
                            boxShadow:
                                "0 8px 20px rgba(124, 58, 237, 0.25)"
                        }}
                    >
                        + Add Customer
                    </button>

                )}


            {/* =================================
                ADD CUSTOMER FORM
            ================================= */}

            {showAddForm && (

                <div
                    style={{
                        background:
                            "#ffffff",
                        border:
                            "1px solid #e3d9ef",
                        borderRadius:
                            "18px",
                        padding:
                            "25px",
                        marginBottom:
                            "30px",
                        boxShadow:
                            "0 10px 30px rgba(70, 40, 100, 0.10)"
                    }}
                >

                    <h2>
                        Add Customer
                    </h2>

                    <form
                        onSubmit={handleAdd}
                    >

                        {/* NAME */}

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter customer name"
                            required
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "18px"
                            }}
                        />


                        {/* EMAIL */}

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter email address"
                            required
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "18px"
                            }}
                        />


                        {/* PHONE */}

                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter phone number"
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "18px"
                            }}
                        />


                        {/* ADDRESS */}

                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={
                                form.address
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter customer address"
                            rows="3"
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "20px"
                            }}
                        />


                        {/* SAVE */}

                        <button
                            type="submit"
                            style={{
                                marginRight:
                                    "10px"
                            }}
                        >
                            Save Customer
                        </button>


                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                        >
                            Cancel
                        </button>

                    </form>

                </div>

            )}


            {/* =================================
                EDIT CUSTOMER FORM
            ================================= */}

            {editingCustomer && (

                <div
                    style={{
                        background:
                            "#ffffff",
                        border:
                            "1px solid #e3d9ef",
                        borderRadius:
                            "18px",
                        padding:
                            "25px",
                        marginBottom:
                            "30px",
                        boxShadow:
                            "0 10px 30px rgba(70, 40, 100, 0.10)"
                    }}
                >

                    <h2>
                        Edit Customer
                    </h2>

                    <form
                        onSubmit={
                            handleUpdate
                        }
                    >

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                form.name
                            }
                            onChange={
                                handleChange
                            }
                            required
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "18px"
                            }}
                        />


                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                form.email
                            }
                            onChange={
                                handleChange
                            }
                            required
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "18px"
                            }}
                        />


                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={
                                form.phone
                            }
                            onChange={
                                handleChange
                            }
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "18px"
                            }}
                        />


                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={
                                form.address
                            }
                            onChange={
                                handleChange
                            }
                            rows="3"
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "20px"
                            }}
                        />


                        <button
                            type="submit"
                            style={{
                                marginRight:
                                    "10px"
                            }}
                        >
                            Update Customer
                        </button>


                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                        >
                            Cancel
                        </button>

                    </form>

                </div>

            )}


            {/* =================================
                REGISTERED CUSTOMERS
            ================================= */}

            <h2>
                Registered Customers
            </h2>


            {loading ? (

                <p>
                    Loading customers...
                </p>

            ) : customers.length === 0 ? (

                <div
                    style={{
                        background:
                            "#ffffff",
                        border:
                            "1px solid #e3d9ef",
                        borderRadius:
                            "18px",
                        padding:
                            "30px",
                        textAlign:
                            "center"
                    }}
                >

                    <h3>
                        No customers registered yet
                    </h3>

                    <p>
                        Click
                        {" "}
                        <strong>
                            + Add Customer
                        </strong>
                        {" "}
                        to register your first customer.
                    </p>

                </div>

            ) : (

                <div>

                    {customers.map(
                        (customer) => (

                            <div
                                key={
                                    customer._id
                                }
                                style={{
                                    background:
                                        "#ffffff",
                                    border:
                                        "1px solid #e3d9ef",
                                    borderRadius:
                                        "18px",
                                    padding:
                                        "25px",
                                    marginBottom:
                                        "18px",
                                    boxShadow:
                                        "0 8px 25px rgba(70, 40, 100, 0.08)"
                                }}
                            >

                                <h3>
                                    {
                                        customer.name
                                    }
                                </h3>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {
                                        customer.email ||
                                        "N/A"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Phone:
                                    </strong>{" "}
                                    {
                                        customer.phone ||
                                        "N/A"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Address:
                                    </strong>{" "}
                                    {
                                        customer.address ||
                                        "N/A"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Customer ID:
                                    </strong>{" "}
                                    {
                                        customer._id
                                    }
                                </p>


                                {/* EDIT */}

                                <button
                                    onClick={() =>
                                        handleEdit(
                                            customer
                                        )
                                    }
                                    style={{
                                        marginRight:
                                            "10px"
                                    }}
                                >
                                    Edit
                                </button>


                                {/* DELETE */}

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            customer._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default CustomersPage;