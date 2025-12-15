import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";

import LandingPage from './pages/LandingPage.jsx';
import About from './pages/about/About.jsx';
import FashioEvents from './pages/fashionEvents/FashionEvents.jsx'
import Service from "./pages/services/Service.jsx";
import Pricing from "./components/Pricing.jsx"
import FashionDesigners from "./pages/fashionDesigners/FashionDesigners.jsx";
import PastEvents from "./pages/pastEvents/PastEvents.jsx";
import NewsRoom from "./pages/newsRoom/NewsRoom.jsx";

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
        <Route path="/fashion-designers" element={<FashionDesigners />} />
        <Route path="/past-events" element={<PastEvents />} />
        <Route path="/news-room" element={<NewsRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
