import React, { useState } from "react";
import { ShoppingBag, Palette, Award, HandHeart } from "lucide-react";
import toast from "react-hot-toast";

const ApplicationForm = () => {
  const [activeTab, setActiveTab] = useState("service");
  const [formData, setFormData] = useState({
    // Shared
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",

    // Service
    requestParticipation: [],

    // Sponsor
    companyName: "",
    contactName: "",
    industry: "",
    sponsorshipInterests: [],

    // Designer
    brandName: "",
    designerName: "",
    designCategory: "",
    yearsOfExperience: "",
    website: "",
    portfolioLink: "",
    brandDescription: "",

    // Buyer
    businessType: "",
    productInterests: "",

    // Additional
    additionalInfo: "",
  });

  const tabs = [
    { id: "buyer", label: "Buyer Application", icon: ShoppingBag },
    { id: "designer", label: "Designer Application", icon: Palette },
    { id: "sponsor", label: "Sponsor Application", icon: Award },
    { id: "service", label: "Our Services", icon: HandHeart },
  ];

  const descriptions = {
    service: "Let us know how we can help you. We offer a range of professional services for the fashion industry.",
    sponsor: "Partner with the global fashion community. Gain visibility and connect your brand with international fashion events and designers.",
    designer: "Showcase your collections on a global stage. Connect with buyers, media, and fashion professionals worldwide.",
    buyer: "Connect with emerging and established designers from around the world. Access exclusive collections and fashion events.",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentList = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentList, value] };
      } else {
        return { ...prev, [field]: currentList.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = async () => {
    // Define different API endpoints for each tab
    const apiEndpoints = {
      buyer: "http://localhost:5000/api/forms/buyer",
      designer: "http://localhost:5000/api/forms/designer",
      sponsor: "http://localhost:5000/api/forms/sponsor",
      service: "http://localhost:5000/api/forms/service",
    };

    console.log("Submitting Form Data:", formData);

    try {
      const response = await fetch(apiEndpoints[activeTab], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${activeTab.toUpperCase()} application submitted successfully!`);
        // Reset form data logic if needed, but keeping it simple for now or resetting all
        setFormData({
          // Shared
          fullName: "",
          email: "",
          phoneNumber: "",
          country: "",

          // Service
          requestParticipation: [],

          // Sponsor
          companyName: "",
          contactName: "",
          industry: "",
          sponsorshipInterests: [],

          // Designer
          brandName: "",
          designerName: "",
          designCategory: "",
          yearsOfExperience: "",
          website: "",
          portfolioLink: "",
          brandDescription: "",

          // Buyer
          businessType: "",
          productInterests: "",

          // Additional
          additionalInfo: "",
        });
      } else {
        toast.error(data.message || "Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const renderInput = (label, name, placeholder, type = "text", required = true) => (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-4 py-1.5 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderSelect = (label, name, options, required = true) => (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
      >
        <option value="">{`Select ${label.toLowerCase()}`}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderCheckboxGroup = (label, name, options) => (
    <div className="md:col-span-2 mt-4">
      <label className="block text-sm font-medium text-gray-900 mb-4">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              value={opt}
              checked={formData[name]?.includes(opt)}
              onChange={(e) => handleCheckboxChange(e, name)}
              className="w-4 h-4 rounded bg-gray-500 border-gray-300 text-black focus:ring-black"
            />
            <span className="text-black font-semibold text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const participationOptions = [
    "Booth / Table Exhibition Spaces",
    "Consulting Services",
    "Digital Marketing & Media Promotion",
    "Fashion Show Production",
    "Membership Programs",
    "Press & Media Accreditation",
    "Performances & Live Entertainment",
    "Press & Media Accreditation",
    "Top Models & Casting Opportunities",
    "Volunteer & Internship Programs"
  ];

  const sponsorshipOptions = [
    "Airlines & Transportation Sponsors",
    "Automotive Sponsors",
    "Banking & Fintech Sponsors",
    "Beauty & Cosmetics Sponsors",
    "Beverage & Spirits Sponsors",
    "Fashion & Luxury Sponsors",
    "Food & Gourmet Sponsors",
    "Jewelry & Accessories Sponsors",
    "Hospitality & Travel Sponsors",
    "Technology & Media Sponsors",
  ];

  const countries = [
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "IN", label: "India" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "IT", label: "Italy" },
    { value: "JP", label: "Japan" },
    { value: "CN", label: "China" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {

      case "buyer":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Company Name", "companyName", "Your Company")}
              {renderInput("Contact Name", "contactName", "Full Name")}
              {renderInput("Email", "email", "email@company.com", "email")}
              {renderInput("Phone Number", "phoneNumber", "+1 (555) 000-0000", "tel")}
              {renderInput("Country", "country", "Country")}
              {renderSelect("Business Type", "businessType", [
                { value: "retail", label: "Retail" },
                { value: "wholesale", label: "Wholesale" },
                { value: "online", label: "Online Store" },
                { value: "boutique", label: "Boutique" },
                { value: "department", label: "Department Store" },
                { value: "other", label: "Other" },
              ])}
            </div>

            <div className="mt-6 md:col-span-2">
              {renderInput("Product Interests", "productInterests", "e.g., Women's wear, Menswear, Accessories, etc.", "text")}
            </div>

            <div className="mt-6 md:col-span-2">
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
          </>
        );

      case "designer":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Brand Name", "brandName", "Your Brand")}
              {renderInput("Designer Name", "designerName", "Full Name")}
              {renderInput("Email", "email", "email@brand.com", "email")}
              {renderInput("Phone Number", "phoneNumber", "+1 (555) 000-0000", "tel")}
              {renderInput("Country", "country", "Country")}
              {renderSelect("Design Category", "designCategory", [
                { value: "StudentDesigner", label: "Student Designer" },
                { value: "NewDesigner", label: "New Designer" },
                { value: "EstablishedDesigner", label: "Established Designer" },
              ])}
            </div>
            <div className="mt-6 mb-6">
              {renderSelect("Years of Experience", "yearsOfExperience", [
                { value: "0-2", label: "0-2 Years" },
                { value: "3-5", label: "3-5 Years" },
                { value: "5-10", label: "5-10 Years" },
                { value: "10+", label: "10+ Years" },
              ])}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {renderInput("Website", "website", "https://yourbrand.com", "url", false)}
              {renderInput("Portfolio Link", "portfolioLink", "https://portfolio.com", "url", false)}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Brand Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="brandDescription"
                value={formData.brandDescription}
                onChange={handleInputChange}
                placeholder="Tell us about your brand, design philosophy, and what makes your work unique..."
                rows="2"
                className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </>
        );

      case "sponsor":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Company Name", "companyName", "Your Company")}
              {renderInput("Contact Name", "contactName", "Full Name")}
              {renderInput("Email", "email", "email@company.com", "email")}
              {renderInput("Phone Number", "phoneNumber", "+1 (555) 000-0000", "tel")}
              {renderInput("Country", "country", "Country")}
              {renderInput("Industry", "industry", "e.g., Technology, Beauty, Automotive")}
            </div>
            {renderCheckboxGroup("Sponsorship Interests", "sponsorshipInterests", sponsorshipOptions)}
            <div className="mt-6 md:col-span-2">
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
          </>
        );

      case "service":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Full Name", "fullName", "Your Company", "text")}
              {renderInput("Phone Number", "phoneNumber", "+1 (555) 000-0000", "tel")}
              {renderInput("Email", "email", "email@company.com", "email")}
              {renderInput("Country", "country", "Country")}
            </div>
            {renderCheckboxGroup("Request Participation", "requestParticipation", participationOptions)}

            <div className="mt-6 md:col-span-2">
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
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div
          className="mb-8 bg-[#ECECF0] rounded-3xl 
            grid grid-cols-2 gap-2  
            md:grid-cols-4 md:gap-2 md:h-12 items-center p-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-3xl font-medium text-sm transition-all cursor-pointer h-full
          ${activeTab === tab.id
                    ? "bg-black text-[#EFA137] shadow-md"
                    : "text-gray-700 hover:bg-white/50"
                  }`}
              >
                <Icon className="w-4 h-4 hidden sm:block" />
                <span className="truncate">{tab.label}</span>
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
            {renderTabContent()}

            {/* Submit Button */}
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-2 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors uppercase tracking-wider"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
