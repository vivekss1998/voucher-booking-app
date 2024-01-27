// ValidationPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const ValidationPage = () => {
    const { ClubReference, eventId } = useParams();
    const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingReference, setBookingReference] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
  // Calculate total amount based on selected items
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
    setTotalAmount(total);
  }, [selectedItems]);

  const handleValidation = async () => {
    try {
      setIsLoading(true);

      // Prepare the request payload
      const requestBody = {
        ClubReference: ClubReference,
        PublishedEventRef: eventId,
        VoucherDetails: selectedItems.map(item => ({
          VoucherName: item.itemName,
          Amount: item.amount,
          Quantity: item.quantity
        })),
        PromoRef: null
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

      // API endpoint for validating event booking
      const apiUrl = 'http://139.59.63.178:5454/api/customer/validateeventbooking';

      // Make the API request
      const response = await axios.post(apiUrl, requestBody, { headers });

      if (response.data && response.data.BookingReference) {
        setBookingReference(response.data.BookingReference);

        // You can perform additional actions here on successful validation
        // For example, navigate to a confirmation page
        // navigate('/booking-confirmation');
      } else {
        // Handle the case where booking reference is not received
        console.error('Booking reference not found in the response.');
      }
    } catch (error) {
      // Handle errors during API call
      console.error('Error during validation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Retrieve voucher details from local storage
    const storedVoucherDetails = JSON.parse(localStorage.getItem('voucherDetails')) || [];
    console.log('Stored Voucher Details:', storedVoucherDetails);
  
    setSelectedItems(storedVoucherDetails);
  
    // Retrieve total amount from local storage
    const totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;
    setTotalAmount(totalAmount);
  }, []);
  
  

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4 font-weight-bold">Validation of Booking</h1>
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

        {/* Display Voucher Details */}
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Voucher Details</h5>
            {selectedItems.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-3">
                <span className="me-3">{item.itemName} - ₹ {item.amount.toFixed(2)}</span>
                <span className="me-2">Quantity: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <button
              className="btn btn-primary"
              onClick={handleValidation}
              disabled={isLoading}
            >
              {isLoading ? 'Validating...' : 'Validate Booking'}
            </button>
            {bookingReference && (
              <div className="mt-3">
                <strong>Booking Reference:</strong> {bookingReference}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ValidationPage;
