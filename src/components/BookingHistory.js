// BookingHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        // Retrieve authToken from localStorage
        const authToken = localStorage.getItem('AuthToken');

        // Set up headers for the API request
        const headers = {
          Authorization: 'SEdRYnN6ZFFFRjpuc0oySXQ0NWt5',
          AppVersion: '1.0.0',
          'AuthToken': `bd8382d5-3adf-11eb-9263-b62d5e046812`|| authToken,
        };

        // API endpoint for fetching voucher booking list
        const apiUrl = 'http://139.59.63.178:5454/api/customer/voucherbookinglist';

        // Make the API request
        const response = await axios.get(apiUrl, { headers });

        // Set the booking data in state
        setBookings(response.data.Details.VoucherBookingList || []);
      } catch (error) {
        console.error('Error fetching booking history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  return (
    <>
    <Navbar />
    <div className="container mt-5">
      <h1 className="mb-4 font-weight-bold">Booking History</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="row row-cols-1 g-4">
          {bookings.map((booking, index) => (
            <div key={index} className="col">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="icon-style fas fa-bookmark"></i> Booking Reference: {booking.BookingReference}
                  </h5>
                  <p className="card-text">
                    <i className="icon-style fas fa-user"></i> <strong>Customer Name:</strong> {booking.CustomerName}
                  </p>
                  <p className="card-text">
                    <i className="icon-style fas fa-money-bill-wave"></i> <strong>Amount:</strong> ₹{booking.Amount}
                  </p>
                  <p className="card-text">
                    <i className="icon-style far fa-calendar"></i> <strong>Date:</strong> {booking.Date || 'N/A'}
                  </p>
                  <p className="card-text">
                    <i className="icon-style far fa-clock"></i> <strong>Timings:</strong> {booking.Timings || 'N/A'}
                  </p>
                  <p className="card-text">
                    <i className={booking.Status === 2 ? "icon-style fas fa-check-circle text-success" : "icon-style fas fa-question-circle text-warning"}></i> <strong>Status:</strong> {booking.Status === 2 ? 'Completed' : 'Unknown'}
                  </p>
                  <p className="card-text">
                    <i className="icon-style fas fa-store-alt "></i> <strong>Restaurant Name:</strong> {booking.RestaurantName}
                  </p>
                  <div>
                    <strong>
                      <i className="icon-style fas fa-gift"></i> Voucher Details:-
                    </strong>
                    {booking.VoucherDetails.map((voucher, voucherIndex) => (
                      <div key={voucherIndex}>
                        <p>
                          <i className="icon-style fas fa-tag"></i> <strong>Voucher Name:</strong> {voucher.VoucherName}
                        </p>
                        <p>
                          <i className="icon-style fas fa-list-alt"></i> <strong>Category:</strong> {voucher.CategoryName}
                        </p>
                        <p>
                          <i className="icon-style fas fa-clipboard-list"></i> <strong>Quantity:</strong> {voucher.Quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);
};

export default BookingHistory;