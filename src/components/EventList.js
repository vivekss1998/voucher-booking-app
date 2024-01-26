import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EventList = () => {
  const defaultDate = new Date('2021-12-31');
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [events, setEvents] = useState([]);

  const formatDateString = (date) => {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchEvents = async (date) => {
    try {
      const formattedDate = formatDateString(date);
      const authToken = localStorage.getItem('AuthToken'); // Retrieve AuthToken from localStorage

      const headers = {
        Authorization: 'SEdRYnN6ZFFFRjpuc0oySXQ0NWt5',
        AppVersion: '1.0.0',
        'AuthToken': authToken // Include the AuthToken from login
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

  const onDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="container">
      <h1 className="my-4">Event List</h1>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
      />
      <div className="row">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card">
                <img src={event.Thumbnail} className="card-img-top" alt={event.EventName} />
                <div className="card-body">
                  <h5 className="card-title">{event.EventName}</h5>
                  <p className="card-text">Club: {event.ClubName}</p>
                  <p className="card-text">Date: {event.Date}</p>
                  <p className="card-text">Timings: {event.Timings}</p>
                  <h6>Voucher Details:</h6>
                  {event.VoucherDetails.map((voucher, voucherIndex) => (
                    <div key={voucherIndex}>
                      <p>{voucher.Type}: {voucher.Amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No events found for this date.</p>
        )}
      </div>
    </div>
  );
};

export default EventList;
