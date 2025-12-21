import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Applications from './pages/applications/Applications';
import Buyers from './pages/applications/Buyers';
import Designers from './pages/applications/Designers';
import Sponsors from './pages/applications/Sponsors';
import Services from './pages/applications/Services';
import LandingVideos from './pages/LandingVideos';
import ServiceTypeManagement from './pages/ServiceTypeManagement';
import ServiceHeroManager from './pages/ServiceHeroManager';
import NewsManager from './pages/news/NewsManager';
import Events from './pages/events/Events';
import AddEvent from './pages/events/AddEvent';
import EditEvent from './pages/events/EditEvent';
import EventPreview from './pages/events/EventPreview';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />

            <Route path="applications" element={<Applications />} />
            <Route path="applications/buyers" element={<Buyers />} />
            <Route path="applications/designers" element={<Designers />} />
            <Route path="applications/sponsors" element={<Sponsors />} />
            <Route path="applications/services" element={<Services />} />

            <Route path="landing-videos" element={<LandingVideos />} />
            <Route path="service-types" element={<ServiceTypeManagement />} />
            <Route path="service-hero" element={<ServiceHeroManager />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="events" element={<Events />} />
            <Route path="events/add" element={<AddEvent />} />
            <Route path="events/edit/:id" element={<EditEvent />} />
          </Route>

          <Route path="/events/preview/:id" element={
            <ProtectedRoute>
              <EventPreview />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
