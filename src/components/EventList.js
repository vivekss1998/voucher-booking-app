import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventList.css'; // Assuming you have the necessary CSS styles
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const EventList = () => {
  const defaultDate = new Date('2021-12-31');
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const formatDateString = (date) => {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchEvents = async (date) => {
    try {
      const formattedDate = formatDateString(date);
      const authToken = localStorage.getItem('AuthToken');

      const headers = {
        Authorization: 'SEdRYnN6ZFFFRjpuc0oySXQ0NWt5',
        AppVersion: '1.0.0',
        'AuthToken': authToken
      };

      const response = await axios.get(`http://139.59.63.178:5454/api/customer/getallpublishedevents?Date=${formattedDate}`, { headers });
      setEvents(response.data.Details || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const authToken = localStorage.getItem('AuthToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  const onDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const navigateToCartDetails = (publishedEventRef) => {
    navigate(`/event-details/${publishedEventRef}`);
  };

  return (
  <><Navbar /><div className="container my-5">

      <h1 className="mb-4 font-weight-bold">Event List</h1>
      <div className="row">
        <h4 className='card'>Check dates from 31 december 2021 & 
          4,5,6 April 2022 for Events </h4>
        {/* Left column for Calendar */}
        <div className="col-md-6 mb-4">
          <Calendar
            onChange={onDateChange}
            value={selectedDate}
            className="mb-4 shadow p-3 bg-white rounded" />
        </div>

        {/* Right column for Event Details */}
        <div className="col-md-6">
          <div className="events">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div key={index} className="event mb-3 shadow p-3 bg-white rounded">
                  <div className="Event__card card">
                    {/* Event details here */}
                    <div className="card-body">
                      <h5 className="card-title font-weight-bold">
                        <i className="fas fa-calendar-alt mr-2 icon-style"></i>
                        {event.EventName}
                      </h5>
                      <p className="card-text">
                        <i className="fas fa-map-marker-alt mr-2 icon-style"></i>
                        Club: {event.ClubName}
                      </p>
                      <p className="card-text">
                        <i className="fas fa-clock mr-2 icon-style"></i>
                        Timings: {event.Timings}
                      </p>
                      <h6 className="font-weight-bold">
                        <i className="fas fa-ticket-alt mr-2 icon-style"></i>
                        Voucher Details:
                      </h6>
                      {event.VoucherDetails.map((voucher, voucherIndex) => (
                        <div key={voucherIndex}>
                          <i className="fas fa-tag mr-2 icon-style"></i>
                          <span>{voucher.Type}: ₹ {voucher.Amount}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => navigateToCartDetails(event.PublishedEventRef)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-12 text-center">No events found for this date.</p>
            )}
          </div>
        </div>
      </div>
    </div></>
  );
};

export default EventList;
