import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FreepikImage from '../images/Version control-cuate.png';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [Phone, setPhone] = useState('8695888234');
  const [loading, setLoading] = useState(false); // New state for loading
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginApi = async (Phone) => {
    const API_URL = 'http://139.59.63.178:5454/api/customer/iscustomerpresent';
    const headers = {
      Authorization: 'SEdRYnN6ZFFFRjpuc0oySXQ0NWt5',
      AppVersion: '1.0.0',
      'Content-Type': 'application/json'
    };
    const data = { Phone: Phone };

    try {
      const response = await axios.post(API_URL, data, { headers });
      if (response.data.Details && response.data.Details.AuthToken) {
        const { CustomerRef, VerificationStatus, AuthToken } = response.data.Details;

        // Assuming you have a way to get the correct phone number from the server
        const correctPhoneNumber = "8695888234"; // Replace with the actual correct phone number logic

        if (Phone === correctPhoneNumber) {
          localStorage.setItem('CustomerRef', CustomerRef);
          localStorage.setItem('VerificationStatus', VerificationStatus.toString());
          localStorage.setItem('AuthToken', AuthToken);

          // Display success message using react-toastify with small size
          toast.success('Login successful!', {
            position: 'top-right',
            style: { fontSize: 'small' },
            autoClose: 3000, // Close after 3 seconds
            onClose: () => {
              // Navigate to EventList page after the success toast is closed
              navigate('/events', { replace: true });
            }
          });
        } else {
          // Handle incorrect phone number
          setError('Incorrect phone number. Please try again.');

          // Display error message using react-toastify with small size
          toast.error('Incorrect phone number. Please try again.', { position: 'top-right' });
        }
      } else {
        // Handle missing details in response
        setError('Login failed. Please try again.');

        // Display error message using react-toastify with small size
        toast.error('Login failed. Please try again.', { position: 'top-right' });
      }
    } catch (error) {
      setError('Login failed. Please try again.');

      // Display error message using react-toastify with small size
      toast.error('An error occurred. Please try again later.', { position: 'top-right' });

      console.error('Error in login API:', error.response || error);
    }
  };


const handleLogin = async () => {
    try {
      setLoading(true); // Set loading state to true when login is initiated
      await loginApi(Phone);
    } catch (error) {
      console.error('Error in handleLogin:', error);
    } finally {
      setLoading(false); // Set loading state to false when login is completed (success or failure)
    }
  };

  const handlePhoneNumberChange = (e) => {
    const inputPhoneNumber = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (inputPhoneNumber.length <= 10) {
      setPhone(inputPhoneNumber);
      setError(''); // Reset the error when the input is valid
    } else {
      setError('Phone number must not exceed 10 digits.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="row no-gutters">
          <div className="login-card__image-section col-md-6">
            <img src={FreepikImage} alt="Freepik Image" className="login-card__image" />
          </div>
          <div className="login-card__form-section col-md-6">
            <div className="form-content">
              <h5 className="card-title text-center mb-4">Login</h5>
              <input
                type="text"
                className="form-control mb-2"
                value={Phone}
                onChange={handlePhoneNumberChange}
                onKeyDown={handleKeyDown} // Add the onKeyDown handler here
                placeholder="Enter Phone Number"
              />
              <button
                className={`btn btn-primary w-100 ${loading ? 'disabled' : ''}`}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                <>
                <span className="ms-2">Logging in </span>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>                  
                </>
              ) : (
                'Login'
              )}
              </button>
              {error && <p className="text-danger text-center mt-2">{error}</p>}
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
