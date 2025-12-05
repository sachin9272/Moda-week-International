import React, { useState } from "react";
import { ShoppingBag, Palette, Award, HandHeart  } from "lucide-react";
const ApplicationForm = () => {
  const [activeTab, setActiveTab] = useState("buyer");
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phoneNumber: "",
    country: "",
    serviceType: "",
    additionalInfo: "",
  });

  const tabs = [
    { id: "buyer", label: "Become a Buyer", icon: ShoppingBag },
    { id: "designer", label: "Apply as Designer", icon: Palette },
    { id: "sponsor", label: "Apply as Sponsor", icon: Award },
    { id: "service", label:"Our Services", icon: HandHeart }
  ];

  const descriptions = {
    buyer:
      "Connect with emerging and established designers from around the world. Access exclusive collections and fashion events.",
    designer:
      "Showcase your designs to a global audience. Join our platform to reach buyers and fashion enthusiasts worldwide.",
    sponsor:
      "Partner with us to support emerging talent and gain visibility in the fashion industry.",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Define different API endpoints for each tab
    const apiEndpoints = {
      buyer: "/api/buyer-application",
      designer: "/api/designer-application",
      sponsor: "/api/sponsor-application",
      service: "/api/services"
    };

    try {
      const response = await fetch(apiEndpoints[activeTab], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        // Reset form
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phoneNumber: "",
          country: "",
          serviceType: "",
          additionalInfo: "",
        });
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 h-8 bg-[#ECECF0] rounded-3xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 rounded-3xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-black text-[#EFA137]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-2">
            {tabs.find((t) => t.id === activeTab)?.label.toUpperCase()}
          </h2>
          <p className="text-gray-600 mb-8">{descriptions[activeTab]}</p>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company"
                  className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@company.com"
                  className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                >
                  <option value="">Country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="IT">Italy</option>
                  <option value="JP">Japan</option>
                  <option value="CN">China</option>
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                >
                  <option value="">Select business type</option>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="online">Online Store</option>
                  <option value="boutique">Boutique</option>
                  <option value="department">Department Store</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Tell us more about your buying needs and interests..."
                rows="2"
                className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-1 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Submit {tabs.find((t) => t.id === activeTab)?.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
