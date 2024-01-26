import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventList.css';

const Events = () => {
  const [phone, setPhone] = useState('8695888234'); // Default phone number
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    // Automatically log in and fetch token
    loginAndFetchToken();
  }, []);

  useEffect(() => {
    // Fetch events whenever the selected date changes
    if (authToken) {
      fetchEvents();
    }
  }, [selectedDate, authToken]);

  const loginAndFetchToken = async () => {
    const API_URL = 'http://139.59.63.178:5454/api/customer/iscustomerpresent';
    const headers = {
      Authorization: 'SEdRYnN6ZFFFRjpuc0oySXQ0NWt5',
      AppVersion: '1.0.0',
      'Content-Type': 'application/json'
    };
    const data = { Phone: phone };

    try {
      const response = await axios.post(API_URL, data, { headers });
      const authToken = response.data.Details.AuthToken;
      setAuthToken(authToken);
    } catch (error) {
      console.error('Error in login API:', error.response || error);
    }
  };

  const fetchEvents = async () => {
    const formattedDate = formatDate(selectedDate);
    const headers = {
      Authorization: authToken,
      'Content-Type': 'application/json',
    };

    const API_URL = `http://139.59.63.178:5454/api/customer/getallpublishedevents?Date=${formattedDate}`;

    try {
      const response = await axios.get(API_URL, { headers });
      const eventData = response.data.Details || [];
      setEvents(eventData);
    } catch (error) {
      console.error('Error fetching events:', error.response || error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="events-container">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
      />
      <div className="events-list">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <img src={event.Thumbnail} alt={event.EventName} />
            <h3>{event.EventName}</h3>
            <p>{event.ClubName}</p>
            <p>Date: {event.Date}</p>
            <p>Timings: {event.Timings}</p>
            {/* Add more event details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
