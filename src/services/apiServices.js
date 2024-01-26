import axios from 'axios';

const BASE_URL = 'http://139.59.63.178:5454/api/customer/';

const getAuthHeaders = () => {
  const AuthToken = localStorage.getItem('AuthToken');
  return { Authorization: `Bearer ${AuthToken}` };
};

export const isCustomerPresent = async (Phone) => {
  try {
    const response = await axios.post(`${BASE_URL}iscustomerpresent`, { Phone });
    return response.data;
  } catch (error) {
    console.error('Error in isCustomerPresent:', error);
    throw error;
  }
};

export const getAllEvents = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}getallpublishedevents?Date=${date}`);
    return response.data;
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    throw error;
  }
};

export const getEventDetails = async (publishedEventRef) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get(`${BASE_URL}getpublishedeventdetails?publishedeventref=${publishedEventRef}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error in getEventDetails:', error);
    throw error;
  }
};

// ... Similar functions for validateEventBooking, placeBooking, voucherBookingList
