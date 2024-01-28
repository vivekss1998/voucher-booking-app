import React from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem('AuthToken');

      if (authToken) {
        const apiUrl = 'http://139.59.63.178:5454/api/device/userlogout';
        const headers = {
          Authorization: 'SEdRYnN6ZFFFRjpuc0oySXQ0NWt5',
          AppVersion: '1.0.0',
          'AuthToken': authToken,
        };

        // Show sweetalert2 confirmation modal
        const result = await Swal.fire({
          title: 'Logout Confirmation',
          text: 'Are you sure you want to logout?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, logout !',
          cancelButtonText: 'Cancel',
        });

        // If the user clicks 'Yes, logout!', proceed with the logout
        if (result.isConfirmed) {
          await axios.post(apiUrl, {}, { headers });
          localStorage.removeItem('AuthToken');
          localStorage.removeItem('Authorization');
          localStorage.removeItem('voucherDetails');
          localStorage.removeItem('totalAmount');
          localStorage.removeItem('CustomerRef');
          localStorage.removeItem('voucherCount_Couple');
          
          
          navigate('/');
        }
      } else {
        console.error('AuthToken not found. Unable to logout.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle errors during API call or logout process
      // You may display an error message or take appropriate action
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/events">EventList</Link>
        <a className="navbar-brand" href="/validate-booking/:ClubReference/:eventId">ValidationPage</a>
        <Link className="navbar-brand" to="/booking/:ClubReference/:eventId/:BookingReference">PlaceBooking</Link>
        <Link className="navbar-brand" to="/booking-history">BookingHistory</Link>
        <div className="navbar-collapse justify-content-end">
          <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
