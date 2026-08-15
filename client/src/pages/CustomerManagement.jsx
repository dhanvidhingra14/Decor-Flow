import { useEffect, useState } from "react";
import API from "../api/api";

function CustomerManagement() {

    const [customers, setCustomers] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");

    // Load customers
    const loadCustomers = async () => {

        try {

            const response = await API.get("/customers");

            setCustomers(response.data);

        } catch (error) {

            console.error(
                "Error loading customers:",
                error
            );

        }

    };


    useEffect(() => {

        loadCustomers();

    }, []);


    // Handle input
    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    };


    // Add / Update customer
    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            if (editingId) {

                await API.put(
                    `/customers/${editingId}`,
                    formData
                );

                setMessage(
                    "Customer updated successfully!"
                );

            } else {

                await API.post(
                    "/customers",
                    formData
                );

                setMessage(
                    "Customer added successfully!"
                );

            }

            setFormData({
                name: "",
                phone: "",
                email: "",
                address: ""
            });

            setEditingId(null);

            loadCustomers();

        } catch (error) {

            console.error(
                "Customer save error:",
                error
            );

            setMessage(
                "Error saving customer."
            );

        }

    };


    // Edit customer
    const handleEdit = (customer) => {

        setEditingId(customer._id);

        setFormData({
            name: customer.name || "",
            phone: customer.phone || "",
            email: customer.email || "",
            address: customer.address || ""
        });

        setMessage("");

    };


    // Delete customer
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await API.delete(
                `/customers/${id}`
            );

            setMessage(
                "Customer deleted successfully!"
            );

            loadCustomers();

        } catch (error) {

            console.error(
                "Customer delete error:",
                error
            );

            setMessage(
                "Error deleting customer."
            );

        }

    };


    // Cancel editing
    const handleCancel = () => {

        setEditingId(null);

        setFormData({
            name: "",
            phone: "",
            email: "",
            address: ""
        });

        setMessage("");

    };


    return (

        <div
            style={{
                maxWidth: "900px",
                margin: "30px auto"
            }}
        >

            <h2>
                Customer Management
            </h2>


            {/* MESSAGE */}

            {message && (

                <p>
                    {message}
                </p>

            )}


            {/* CUSTOMER FORM */}

            <form
                onSubmit={handleSubmit}
                style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    marginBottom: "30px"
                }}
            >

                <h3>
                    {editingId
                        ? "Edit Customer"
                        : "Add Customer"
                    }
                </h3>


                {/* NAME */}

                <div style={{ marginBottom: "10px" }}>

                    <label>
                        Name
                    </label>

                    <br />

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter customer name"
                        required
                    />

                </div>


                {/* PHONE */}

                <div style={{ marginBottom: "10px" }}>

                    <label>
                        Phone
                    </label>

                    <br />

                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                    />

                </div>


                {/* EMAIL */}

                <div style={{ marginBottom: "10px" }}>

                    <label>
                        Email
                    </label>

                    <br />

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                    />

                </div>


                {/* ADDRESS */}

                <div style={{ marginBottom: "10px" }}>

                    <label>
                        Address
                    </label>

                    <br />

                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                    />

                </div>


                <button type="submit">

                    {editingId
                        ? "Update Customer"
                        : "Add Customer"
                    }

                </button>


                {editingId && (

                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            marginLeft: "10px"
                        }}
                    >
                        Cancel
                    </button>

                )}

            </form>


            {/* CUSTOMER LIST */}

            <h3>
                Customer List
            </h3>


            {customers.length === 0 ? (

                <p>
                    No customers found.
                </p>

            ) : (

                customers.map((customer) => (

                    <div
                        key={customer._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            marginBottom: "10px",
                            borderRadius: "5px"
                        }}
                    >

                        <h3>
                            {customer.name}
                        </h3>

                        <p>
                            Phone: {customer.phone}
                        </p>

                        <p>
                            Email: {customer.email || "N/A"}
                        </p>

                        <p>
                            Address: {customer.address || "N/A"}
                        </p>


                        <button
                            onClick={() =>
                                handleEdit(customer)
                            }
                        >
                            Edit
                        </button>


                        <button
                            onClick={() =>
                                handleDelete(customer._id)
                            }
                            style={{
                                marginLeft: "10px"
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

export default CustomerManagement;