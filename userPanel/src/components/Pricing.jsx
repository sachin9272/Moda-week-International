import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

// Pricing Card Component with API Integration
const PricingCard = ({ plan, onGetStarted, isPopular }) => {
  const cardClasses = isPopular
    ? "shadow-2xl relative"
    : "shadow-lg";

  const buttonClasses = isPopular
    ? "grad-bg hover:bg-amber-800 text-white"
    : "bg-black hover:bg-gray-800 text-white";

  return (
    <div
      className={`bg-gray-50 ${cardClasses} rounded-2xl p-8 transition-transform hover:scale-105 duration-300 h-[500px]`}
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
      <div className="mb-1">
        <h3 className="font-bold text-black mb-2 uppercase tracking-wide">
          {plan.name}
        </h3>
        <p className="text-gray-600 text-sm h-10">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-4">
        <span className="text-[#101010]">
          ${plan.price.toLocaleString()}
        </span>
      </div>

      {/* Features */}
      <div className="space-y-3.5 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <span className="text-black">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onGetStarted(plan)}
        className={`${buttonClasses} w-full py-1.5 rounded-lg font-semibold transition-colors duration-200`}
      >
        Get Started
      </button>
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
              name: "Basic Listing",
              description: "Essential event listing for visibility",
              price: 150,
              isPopular: false,
              features: [
                "Event date placement",
                "Basic event details",
                "Inclusion in global directory",
                "Standard search visibility",
              ],
            },
            {
              id: "premium",
              name: "Premium Highlight",
              description: "Featured listing with enhanced promotion",
              price: 300,
              isPopular: true,
              features: [
                "Everything in Basic Listing",
                "Featured positioning",
                "Photo galleries",
                "Direct booking/RSVP links",
                "Enhanced visibility",
                "Press release inclusion",
              ],
            },
            {
              id: "annual",
              name: "Annual Partnership",
              description: "Full year calendar access and benefits",
              price: 1500,
              isPopular: false,
              features: [
                "Everything in Premium Highlight",
                "12 months of placement",
                "Priority featured positioning",
                "Multiple event listings",
                "Promotional banners",
                "Quarterly spotlight features",
                "Dedicated partnership support",
              ],
            },
          ],
        });
      }, 800);
    });
  };

  // Handle plan selection and send to API
  const handleGetStarted = async (plan) => {
    try {
      console.log("Selected plan:", plan);

      // Replace with your actual API endpoint
      // const response = await fetch('https://your-api.com/api/checkout', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     planId: plan.id,
      //     planName: plan.name,
      //     price: plan.price
      //   })
      // });

      // const data = await response.json();
      // window.location.href = data.checkoutUrl;

      // Mock action for demo
      alert(
        `Selected: ${plan.name} - $${plan.price}\n\nReplace this with actual checkout API call`
      );
    } catch (err) {
      console.error("Error processing checkout:", err);
      alert("An error occurred. Please try again.");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 to-stone-100 flex items-center justify-center">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchPricingPlans}
            className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800"
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
            PRICING
          </h1>

          <div className="w-38 h-px grad-bg mx-auto mb-6 mt-4"></div>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Choose the perfect plan to showcase your fashion event to a global
            audience
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onGetStarted={handleGetStarted}
              isPopular={plan.isPopular}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;
