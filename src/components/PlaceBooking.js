// BookingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const BookingPage = () => {
  const { ClubReference, eventId, BookingReference } = useParams();
  // const [bookingReference, setBookingReference] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  // Assuming that the booking reference is received from the validation API
  // If not, you may need to fetch it or handle the logic accordingly
  useEffect(() => {
    // Retrieve voucher details from local storage
    const storedVoucherDetails = JSON.parse(localStorage.getItem('voucherDetails')) || [];
    setSelectedItems(storedVoucherDetails);

    // Retrieve total amount from local storage
    const totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;
    setTotalAmount(totalAmount);

    // Cleanup: Clear voucher details and total amount from local storage after retrieval
    // localStorage.removeItem('voucherDetails');
    // localStorage.removeItem('totalAmount');
  }, []);
  const handlePlaceBooking = async () => {
    try {
      setIsLoading(true);
// Retrieve additional details from localStorage
      const ClubReference = localStorage.getItem('ClubReference');
      const eventId = localStorage.getItem('EventId');
      const selectedItems = JSON.parse(localStorage.getItem('voucherDetails')) || [];
      // const BookingReference = localStorage.getItem('BookingReference');

      // Prepare the request payload for placing the booking
      const requestBody = {
        BookingReference: BookingReference,
        Status: 2, // Status 2 indicates a successful booking
        ClubReference: ClubReference,
        PublishedEventRef: eventId,
        VoucherDetails: selectedItems.map(item => ({
          VoucherName: item.itemName,
          Amount: item.amount,
          Quantity: item.quantity
        })),
        PromoRef: null
        // Add other details to the request body if needed
      };


      // Retrieve authToken from localStorage
      const authToken = localStorage.getItem('AuthToken');

      // Set up headers for the API request
      const headers = {
        Authorization: 'SEdRYnN6ZFFFRjpuc0oySXQ0NWt5',
        AppVersion: '1.0.0',
        'AuthToken': authToken,
        'Content-Type': 'application/json', // Add Content-Type header
      };

      // API endpoint for placing the booking
      const apiUrl = 'http://139.59.63.178:5454/api/customer/placebooking';

      // Make the API request
      const response = await axios.post(apiUrl, requestBody, { headers });

      // Assuming the API response contains relevant information
      console.log('Booking Response:', response.data.Details);

      // Show success toast message
      toast.success('Booking placed successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          // Navigate to EventList page after the success toast is closed
          navigate('/events');
        }
      });

      // Additional actions after successful booking (e.g., navigate to confirmation page)
      // navigate('/events');
    } catch (error) {
      // Handle errors during API call
      console.error('Error placing booking:', error);

      // Show error toast message
      toast.error('Error placing booking. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container mt-5">
        <h1 className="mb-4 font-weight-bold">Place Booking</h1>
        <div className="card">
          <div className="card-body">
          <h5 className="card-title">Selected Items</h5>
            <ul>
              {selectedItems.map((item, index) => (
                <li key={index}>
                  {item.itemName} - ₹ {item.amount.toFixed(2)} (Quantity: {item.quantity})
                </li>
              ))}
            </ul>
            <p className="mt-3">Total Amount: ₹ {totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <button
              className="btn btn-primary"
              onClick={handlePlaceBooking}
              disabled={isLoading}
            >
              {isLoading ? 'Placing Booking...' : 'Place Booking'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingPage;
