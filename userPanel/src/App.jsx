import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";

import LandingPage from './pages/LandingPage.jsx';
import About from './pages/about/About.jsx';
import FashioEvents from './pages/fashionEvents/FashionEvents.jsx'
import Service from "./pages/services/Service.jsx";
import Pricing from "./components/Pricing.jsx"
import Participants from "./pages/participants/Participants.jsx";
import PastEvents from "./pages/pastEvents/PastEvents.jsx";
import NewsRoom from "./pages/newsRoom/NewsRoom.jsx";
import NewsDetail from "./pages/newsRoom/NewsDetail.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import MembershipProgram from "./pages/MembershipProgram.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Philanthropy from "./pages/philanthropy/Philanthropy.jsx";
import BuyTickets from "./pages/BuyTickets.jsx";
import EventTicketDetails from "./pages/EventTicketDetails.jsx";
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentCancel from './pages/payment/PaymentCancel';
import CodeOfConduct from "./pages/CodeOfConduct.jsx";
import DataProtection from "./pages/DataProtection.jsx";
import MediaReleasePolicy from "./pages/MediaReleasePolicy.jsx";

import { Toaster } from 'react-hot-toast';
import WhatsAppButton from "./components/WhatsAppButton.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <WhatsAppButton />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<LandingPage />} />
        {/* Add more pages */}
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<FashioEvents />} />
        <Route path="/service" element={<Service />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/past-events" element={<PastEvents />} />
        <Route path="/news-room" element={<NewsRoom />} />
        <Route path="/news-room/:id" element={<NewsDetail />} />
        <Route path="/event-details" element={<EventDetail />} />
        <Route path="/event-details/:slug" element={<EventDetail />} />
        <Route path="/membership-program" element={<MembershipProgram />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/code-of-conduct" element={<CodeOfConduct />} />
        <Route path="/data-protection" element={<DataProtection />} />
        <Route path="/media-release-policy" element={<MediaReleasePolicy />} />
        <Route path="/philanthropy" element={<Philanthropy />} />

        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* Ticket Routes */}
        <Route path="/buy-tickets" element={<BuyTickets />} />
        <Route path="/event-tickets/:id" element={<EventTicketDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
