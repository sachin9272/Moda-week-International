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
import ServicesManager from './pages/ServicesManager';
import LegalPagesManager from './pages/LegalPagesManager';
import NewsManager from './pages/news/NewsManager';
import AddNews from './pages/news/AddNews';
import EditNews from './pages/news/EditNews';
import PartnerManager from './pages/PartnerManager';
import PhilanthropyManager from './pages/PhilanthropyManager';
import EventsList from './pages/events/EventsList';
import EventDashboard from './pages/events/EventDashboard';
import AddEvent from './pages/events/AddEvent';
import EditEvent from './pages/events/EditEvent';
import AddUpcomingEvent from './pages/events/AddUpcomingEvent';
import EditUpcomingEvent from './pages/events/EditUpcomingEvent';
import EventAnalyticsDashboard from './pages/events/EventAnalyticsDashboard';
import EventTransactions from './pages/events/EventTransactions';
import UpcomingEventsList from './pages/events/UpcomingEventsList';
import EventPreview from './pages/events/EventPreview';
import NewsPreview from './pages/news/NewsPreview';
import FashionDesigners from './pages/FashionDesigners';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 999999,
        }}
      />
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
            <Route path="service-content" element={<ServicesManager />} />
            <Route path="legal-pages" element={<LegalPagesManager />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="news/add" element={<AddNews />} />
            <Route path="news/edit/:id" element={<EditNews />} />
            <Route path="partners" element={<PartnerManager />} />
            <Route path="philanthropy" element={<PhilanthropyManager />} />
            <Route path="events" element={<EventDashboard />} />
            <Route path="events/upcoming" element={<UpcomingEventsList />} />
            <Route path="events/upcoming/dashboard/:id" element={<EventAnalyticsDashboard />} />
            <Route path="events/upcoming/transactions/:id" element={<EventTransactions />} />
            <Route path="events/upcoming/add" element={<AddUpcomingEvent />} />
            <Route path="events/upcoming/edit/:id" element={<EditUpcomingEvent />} />
            <Route path="events/past" element={<EventsList type="past" />} />

            <Route path="events/add" element={<AddEvent />} />
            <Route path="events/edit/:id" element={<EditEvent />} />
            <Route path="fashion-designers" element={<FashionDesigners />} />
          </Route>

          <Route path="/events/preview/:id" element={
            <ProtectedRoute>
              <EventPreview />
            </ProtectedRoute>
          } />
          <Route path="/news/preview/:id" element={
            <ProtectedRoute>
              <NewsPreview />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
