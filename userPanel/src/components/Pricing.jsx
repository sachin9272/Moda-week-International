import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

// Pricing Card Component with API Integration
// Pricing Card Component with API Integration
import { Link } from "react-router-dom";

const PricingCard = ({ plan, isPopular }) => {
  const cardClasses = isPopular
    ? "shadow-2xl relative scale-105"
    : "shadow-lg";

  const buttonClasses = isPopular
    ? "grad-bg hover:bg-amber-800 text-white"
    : "bg-black hover:bg-gray-800 text-white";

  return (
    <div
      className={`bg-gray-50 ${cardClasses} rounded-2xl p-8 transition-transform hover:scale-105 duration-300 h-full flex flex-col`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="grad-bg text-white px-6 py-1.5 rounded-full text-sm">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-4 text-center">
        <h3 className="font-bold text-black mb-2 uppercase tracking-wide text-2xl">
          {plan.name}
        </h3>
        <p className="text-gray-600 text-xs uppercase tracking-wide h-8">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6 text-center">
        <span className="text-[#101010] text-5xl font-bold">
          ${plan.price.toLocaleString()}
        </span>
      </div>

      <div className="w-full h-px bg-gray-200 mb-6"></div>

      {/* Features */}
      <div className="space-y-3.5 mb-8 grow">
        <p className="text-[#C7913E] text-sm font-bold mb-4">Includes:</p>
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#C7913E] shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700 text-left">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Link to="/service?tab=buyer" className="mt-auto">
        <button
          className={`${buttonClasses} w-full py-3 rounded-lg font-bold uppercase tracking-widest transition-colors duration-200`}
        >
          Join Now
        </button>
      </Link>
    </div>
  );
};

// Main Pricing Component with API Integration
const PricingComponent = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pricing plans from API
  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      const response = await mockApiCall();

      if (!response.ok) {
        throw new Error("Failed to fetch pricing plans");
      }

      const data = await response.json();
      setPlans(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching pricing plans:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API call - Replace this with your actual API call
  const mockApiCall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: async () => [
            {
              id: "basic",
              name: "BASIC",
              description: "Essential Visibility for Event Recognition",
              price: 150,
              isPopular: false,
              features: [
                "Event date placement on the MWINTL calendar",
                "Standard event listing and basic details",
                "Inclusion in the Global Fashion Events Directory",
                "Searchable visibility within our platform",
              ],
            },
            {
              id: "premium",
              name: "PREMIUM",
              description: "Elevated Exposure and Promotional Asset",
              price: 300,
              isPopular: true,
              features: [
                "Everything in Basic, plus:",
                "Featured positioning on the MWINTL events feed",
                "Visual photo gallery inclusion",
                "RSVP / booking links for attendees",
                "Enhanced search visibility",
                "Optional press release inclusion",
              ],
            },
            {
              id: "elite",
              name: "ELITE",
              description: "Strategic Year-Round Promotion & Recognition",
              price: 1500,
              isPopular: false,
              features: [
                "Everything in Premium, plus:",
                "12 months of platform visibility",
                "Priority featured placement",
                "Up to 5 event listings per year",
                "Rotating promotional banners",
                "Quarterly spotlight features",
                "Dedicated partnership support",
              ],
            },
          ],
        });
      }, 500);
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7913E] mb-4"></div>
          <p className="text-gray-500 text-sm">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchPricingPlans}
            className="text-[#C7913E] underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl !font-playfair bg-linear-to-b from-[#BC8739] to-[#563E1A] bg-clip-text text-transparent tracking-wide">
            EVENT MEMBERSHIP
          </h1>

          <div className="w-38 h-px grad-bg mx-auto mb-6 mt-4"></div>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Choose the perfect plan to showcase your fashion event to a global
            audience
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={plan.isPopular}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;
