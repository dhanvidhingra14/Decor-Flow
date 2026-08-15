import BookingForm from "./BookingForm";
import BookingList from "./BookingList";
import { useState } from "react";

function BookingsPage() {

    const [refresh, setRefresh] = useState(0);

    const handleBookingCreated = () => {

        setRefresh(
            previous => previous + 1
        );

    };

    return (

        <div>

            <h1>
                Bookings
            </h1>

            <p>
                Create and manage event bookings.
            </p>

            <BookingForm
                onBookingCreated={
                    handleBookingCreated
                }
            />

            <hr
                style={{
                    margin: "40px 0"
                }}
            />

            <BookingList
                refresh={refresh}
            />

        </div>

    );

}

export default BookingsPage;