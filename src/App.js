// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import EventList from './components/EventList';
import CartDetails from './components/CartDetails';
import ValidationPage from './components/ValidationPage';
import PlaceBooking from './components/PlaceBooking';
import BookingHistory from './components/BookingHistory';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
       <Route path="/events" element={<EventList />} />
       <Route path="/event-details/:eventId" element={<CartDetails />} />
        <Route path="/validate-booking" element={<ValidationPage />} />
        <Route path="/place-booking" element={<PlaceBooking />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/logout" element={<Logout />} />
        {/* Add a default route if needed, e.g., a Home or Landing Page */}
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
