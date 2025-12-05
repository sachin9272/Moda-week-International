import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './HomePage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import About from './pages/about/About.jsx';
import FashioEvents from './pages/fashionEvents/FashionEvents.jsx'
import Service from "./pages/services/Service.jsx";
import Pricing from "./components/Pricing.jsx"
function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing/>}/>
        {/* Add more pages */}
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<FashioEvents />} />
        <Route path="/service" element={<Service />} />
      </Routes>
    </Router>
  );
}

export default App;
