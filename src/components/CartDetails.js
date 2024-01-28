import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './CartDetails.css';

const CartDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [voucherCounts, setVoucherCounts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const authToken = localStorage.getItem('AuthToken');
        const headers = {
          Authorization: 'SEdRYnN6ZFFFRjpuc0oySXQ0NWt5',
          AppVersion: '1.0.0',
          'AuthToken': authToken,
        };

        const response = await axios.get(`http://139.59.63.178:5454/api/customer/getpublishedeventdetails?publishedeventref=${eventId}`, { headers });
        setEventDetails(response.data.Details);

        // Fetch stored voucher counts from local storage
        const storedVoucherCounts = {};
        Object.keys(response.data.Details.VoucherDetails.Details).forEach((voucherType) => {
          const count = localStorage.getItem(`voucherCount_${voucherType}`);
          if (count !== null) {
            storedVoucherCounts[voucherType] = parseInt(count, 10);
          }
        });
        setVoucherCounts(storedVoucherCounts);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleVoucherChange = (voucherType, amount, increment) => {
    if (!eventDetails || !eventDetails.VoucherDetails || !eventDetails.VoucherDetails.Details) {
      return;
    }

    setVoucherCounts((prevCounts) => {
      const currentCount = prevCounts[voucherType] || 0;
      const newCount = increment ? currentCount + 1 : Math.max(currentCount - 1, 0);

      localStorage.setItem(`voucherCount_${voucherType}`, newCount);

      const storedVoucherDetails = JSON.parse(localStorage.getItem('voucherDetails')) || [];
      const existingVoucherIndex = storedVoucherDetails.findIndex((voucher) => voucher.type === voucherType);

      if (existingVoucherIndex !== -1) {
        storedVoucherDetails[existingVoucherIndex].quantity = newCount;
      } else {
        storedVoucherDetails.push({
          type: voucherType,
          itemName: eventDetails.VoucherDetails.Details.find((v) => v.Type === voucherType)?.Type,
          amount: parseFloat(amount),
          quantity: newCount,
        });
      }

      localStorage.setItem('voucherDetails', JSON.stringify(storedVoucherDetails));

      const totalAmount = storedVoucherDetails.reduce((total, voucher) => total + voucher.amount * voucher.quantity, 0);
      localStorage.setItem('totalAmount', totalAmount.toFixed(2));

      return { ...prevCounts, [voucherType]: newCount };
    });

    setTotalPrice((prevPrice) => {
      const currentCount = voucherCounts[voucherType] || 0;

      if (increment || currentCount > 0) {
        return prevPrice + (increment ? parseFloat(amount) : -parseFloat(amount));
      } else {
        return prevPrice;
      }
    });
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!eventDetails) {
    return <div>Event details not available.</div>;
  }

  const navigateToValidationPage = () => {
    navigate(`/validate-booking/${eventDetails.ClubDetails.ClubReference}/${eventId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Event Details</h5>
            <div className="mb-3">
              <strong>Club Name:</strong> {eventDetails.ClubDetails.Name}
              <p><strong>Address:</strong> {eventDetails.ClubDetails.Address}</p>
            </div>
            <div>
              <strong>Date:</strong> {eventDetails.EventDetails.Date}
              <p><strong>Description:</strong> {eventDetails.EventDetails.Description}</p>
              <p><strong>Cancellation Policy:</strong> {eventDetails.EventDetails.CancellationPolicy}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Vouchers Details</h5>
            {eventDetails.VoucherDetails?.Details?.map((voucher, index) => (
              <div key={index} className="d-flex align-items-center mb-3">
                <span className="me-3">{voucher.Type} - ₹ {voucher.Amount}</span>
                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleVoucherChange(voucher.Type, voucher.Amount, true)}>
                  <i className='fas fa-plus'></i>
                </button>
                <span className="me-2">{voucherCounts[voucher.Type] || 0}</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleVoucherChange(voucher.Type, voucher.Amount, false)}>
                  <i className='fas fa-minus'></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <strong>Total Price: ₹ {totalPrice.toFixed(2)}</strong>

        
          </div>
          <button
          className="btn btn-primary"
          onClick={navigateToValidationPage}
        >
          Proceed to Validation
        </button>
        </div>
        
      </div>
    </>
  );
};

export default CartDetails;
