import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EventList from './components/EventList';
import CartDetails from './components/CartDetails';
import ValidationPage from './components/ValidationPage';
import PlaceBooking from './components/PlaceBooking';
import BookingHistory from './components/BookingHistory';
// import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/event-details/:eventId" element={<CartDetails />} />
        <Route path="/validate-booking/:ClubReference/:eventId" element={<ValidationPage />} />
        <Route path="/booking/:ClubReference/:eventId/:BookingReference" element={<PlaceBooking />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
        {/* Add a default route that navigates to the login page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
