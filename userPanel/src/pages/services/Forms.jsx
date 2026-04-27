import React, { useState, useEffect } from "react";
import { ShoppingBag, Palette, Award, HandHeart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { baseURL } from "../../config/api";

const ApplicationForm = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "service";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["buyer", "designer", "sponsor", "service"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [formData, setFormData] = useState({
    // Shared
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",

    // Service
    requestParticipation: "", // Changed to string for single selection

    // Sponsor
    companyName: "",
    contactName: "",
    industry: "",
    sponsorshipInterests: [],

    // Sponsor Additional
    jobTitle: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    fax: "",
    sponsorshipRegions: [],

    // Designer
    brandName: "",
    designerName: "",
    designCategory: "", // Default empty to force selection
    yearsOfExperience: "",
    website: "",
    portfolioLink: "",
    brandDescription: "",

    // Designer Common
    socialMediaLink: "",

    // Designer Student
    studentTeacher: "",
    schoolAddress: "",

    // Designer Interests
    collectionTypes: [],
    marketingInterest: [],
    showcaseLocation: [],

    // Buyer
    businessType: "",
    productInterests: "",

    // Additional
    additionalInfo: "",

    // Press & Media Accreditation
    currentEvent: "",
    date: "",
    signature: "",
    mediaReleaseNames: [],
    mediaName: "",

    // Volunteer & Internship
    educationMajor: "",
    volunteeringInterests: []
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
      buyer: `${baseURL}/api/forms/buyer`,
      designer: `${baseURL}/api/forms/designer`,
      sponsor: `${baseURL}/api/forms/sponsor`,
      service: `${baseURL}/api/forms/service`,
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
          requestParticipation: "",

          // Sponsor
          companyName: "",
          contactName: "",
          industry: "",
          sponsorshipInterests: [],

          // Sponsor Additional
          jobTitle: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          fax: "",
          sponsorshipRegions: [],

          // Designer
          brandName: "",
          designerName: "",
          designCategory: "",
          yearsOfExperience: "",
          website: "",
          portfolioLink: "",
          brandDescription: "",

          // Designer Common
          socialMediaLink: "",

          // Designer Student
          studentTeacher: "",
          schoolAddress: "",

          // Designer Interests
          collectionTypes: [],
          marketingInterest: [],
          showcaseLocation: [],

          // Buyer
          businessType: "",
          productInterests: "",

          // Additional
          additionalInfo: "",

          // Press & Media Accreditation
          currentEvent: "",
          date: "",
          signature: "",
          mediaReleaseNames: [],
          mediaName: "",

          // Volunteer & Internship
          educationMajor: "",
          volunteeringInterests: []
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

  const renderRadioGroup = (label, name, options) => (
    <div className="md:col-span-2 mt-4">
      <label className="block text-sm font-medium text-gray-900 mb-4">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={formData[name] === opt}
              onChange={handleInputChange}
              className="w-4 h-4 text-black border-gray-300 focus:ring-black"
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
    "Top Models & Casting Opportunities",
    "Volunteer & Internship Programs",
    "Logo Animation"
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
            {/* Application Type Selection */}
            {!formData.designCategory ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, designCategory: "StudentDesigner" }))}
                  className="flex flex-col items-center justify-center p-8 bg-[#F3F3F5] hover:bg-black hover:text-[#EFA137] rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#EFA137] group"
                >
                  <Award className="w-12 h-12 mb-4 text-gray-400 group-hover:text-[#EFA137] transition-colors" />
                  <h3 className="text-xl font-bold">Student Design</h3>
                  <p className="text-sm mt-2 text-center opacity-80">For current students seeking internship and showcase opportunities.</p>
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, designCategory: "NewDesigner" }))}
                  className="flex flex-col items-center justify-center p-8 bg-[#F3F3F5] hover:bg-black hover:text-[#EFA137] rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#EFA137] group"
                >
                  <Palette className="w-12 h-12 mb-4 text-gray-400 group-hover:text-[#EFA137] transition-colors" />
                  <h3 className="text-xl font-bold">New Designer</h3>
                  <p className="text-sm mt-2 text-center opacity-80">For emerging designers launching their brand.</p>
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, designCategory: "EstablishedDesigner" }))}
                  className="flex flex-col items-center justify-center p-8 bg-[#F3F3F5] hover:bg-black hover:text-[#EFA137] rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#EFA137] group"
                >
                  <ShoppingBag className="w-12 h-12 mb-4 text-gray-400 group-hover:text-[#EFA137] transition-colors" />
                  <h3 className="text-xl font-bold">Fashion Designer</h3>
                  <p className="text-sm mt-2 text-center opacity-80">For established professionals seeking broader promotion.</p>
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Selected Application Type</p>
                    <h3 className="text-xl font-bold">
                      {formData.designCategory === "StudentDesigner" && "Student Design Application"}
                      {formData.designCategory === "NewDesigner" && "New Designer Application"}
                      {formData.designCategory === "EstablishedDesigner" && "Fashion Designer Application"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, designCategory: "" }))}
                    className="text-sm text-red-500 hover:text-red-700 underline"
                  >
                    Change Type
                  </button>
                </div>

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {renderInput("Full Name", "designerName", "Full Name")}
                  {renderInput("Mobile Number", "phoneNumber", "+1 (555) 000-0000", "tel")}
                  {renderInput("Address", "address", "Address", "text", false)}
                  {renderInput("City", "city", "City", "text", false)}
                  {renderInput("State/Province", "state", "State", "text", false)}
                  {renderInput("Zip/Postal Code", "zipCode", "Zip Code", "text", false)}
                  {renderInput("Country", "country", "Country")}
                  {renderInput("Fax", "fax", "Fax", "tel", false)}
                  {renderInput("Email", "email", "email@brand.com", "email")}
                  {renderInput("Website / Social Media", "socialMediaLink", "Link", "url", false)}
                </div>



                {/* Conditional Fields */}
                {formData.designCategory === "StudentDesigner" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fadeIn">
                    {renderInput("Student Teacher", "studentTeacher", "Student Teacher Name", "text", false)}
                    {renderInput("School/College/University Address", "schoolAddress", "Address", "text", false)}
                  </div>
                )}

                {(formData.designCategory === "NewDesigner" || formData.designCategory === "EstablishedDesigner") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fadeIn">
                    {renderInput("Job Title", "jobTitle", "Job Title", "text", false)}
                    {renderInput("Company", "brandName", "Company Name", "text", false)}
                  </div>
                )}





                {/* Website Instruction */}
                {(formData.designCategory === "StudentDesigner" || formData.designCategory === "NewDesigner" || formData.designCategory === "EstablishedDesigner") && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    <p><strong>Note:</strong> If you do not have a website, please email us pictures of your designs. We Need to see your work before sending your participation form contract.</p>
                  </div>
                )}

                {/* Bottom Section */}
                <div className="space-y-6">
                  {renderCheckboxGroup("Type (Check all that Apply)", "collectionTypes", [
                    "Men's Fashion Collection.",
                    "Woman's Fashion Collection.",
                    "Accessories.",
                    formData.designCategory === "StudentDesigner" ? "Internship." : null,
                    formData.designCategory === "StudentDesigner" ? "Branding Creations: (Business Card Design, Logo, Wordmark Design, Poster/Flyer) *Any other design service to be quoted separately." : null,
                    formData.designCategory === "NewDesigner" ? "Marketing and Promotion: (Card Design, Logo, Wordmark Design, Poster/Flyer,Clothes Tags, Give Ways Design, Website) *Any other design service to be quoted separately." : null,
                    formData.designCategory === "EstablishedDesigner" ? "Corporate Marketing and Promotion: Project, Budgeting and Designs. *Any other design service to be quoted separately." : null
                  ].filter(Boolean))}

                  {renderCheckboxGroup(
                    formData.designCategory === "StudentDesigner"
                      ? "I'm Interested in showing my Design Collection at:"
                      : "I'm Interested in showing my Design Collection at:",
                    "showcaseLocation",
                    ["SOUTH AMERICA", "UNITED STATES"]
                  )}
                </div>

                <div className="md:col-span-2 mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Brand Description / Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="brandDescription"
                    value={formData.brandDescription}
                    onChange={handleInputChange}
                    placeholder="Tell us about your brand..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Hidden as per new requirements
                {(formData.designCategory !== "StudentDesigner") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {renderInput("Portfolio Link", "portfolioLink", "https://portfolio.com", "url", false)}
                    {renderSelect("Years of Experience", "yearsOfExperience", [
                      { value: "0-2", label: "0-2 Years" },
                      { value: "3-5", label: "3-5 Years" },
                      { value: "5-10", label: "5-10 Years" },
                      { value: "10+", label: "10+ Years" },
                    ])}
                  </div>
                )}
                */}
              </div>
            )}
          </>
        );

      case "sponsor":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Company Name", "companyName", "Your Company")}
              {renderInput("Contact Name", "contactName", "Full Name")}

              {/* New Fields */}
              {renderInput("Job Title", "jobTitle", "Job Title", "text", false)}
              {renderInput("Address", "address", "Street Address", "text", false)}
              {renderInput("City", "city", "City", "text", false)}
              {renderInput("State/Province", "state", "State", "text", false)}
              {renderInput("Zip/Postal Code", "zipCode", "Zip Code", "text", false)}
              {renderInput("Fax", "fax", "Fax Number", "tel", false)}
              {renderInput("Website Address", "website", "https://yourwebsite.com", "url", false)}

              {renderInput("Email", "email", "email@company.com", "email")}
              {renderInput("Phone Number", "phoneNumber", "+1 (555) 000-0000", "tel")}
              {renderInput("Country", "country", "Country")}
              {renderInput("Industry", "industry", "e.g., Technology, Beauty, Automotive")}
            </div>

            {renderCheckboxGroup("I'm interested sponsor my company corporation in:", "sponsorshipRegions", [
              "Sponsorship information in UNITED STATES OF AMERICA",
              // "Sponsorship information in EUROPE",
              // "Sponsorship information in CANADA",
              "Sponsorship information in SOUTH AMERICA"
            ])}

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
            {renderRadioGroup("Request Participation", "requestParticipation", participationOptions)}

            {formData.requestParticipation === "Press & Media Accreditation" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Press & Media Accreditation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Company Name", "companyName", "Company Name", "text", false)}
                  {renderInput("Address", "address", "Address", "text", false)}
                  {renderInput("City", "city", "City", "text", false)}
                  {renderInput("State/Province", "state", "State/Province", "text", false)}
                  {renderInput("Zip/Postal Code", "zipCode", "Zip/Postal Code", "text", false)}
                  {renderInput("Fax", "fax", "Fax Number", "tel", false)}
                  {renderInput("Website", "website", "https://example.com", "url", false)}
                  {renderInput("Current Event", "currentEvent", "Current Event", "text", false)}
                  {renderInput("Title", "jobTitle", "Title", "text", false)}
                  {renderInput("Date", "date", "Select Date", "date", false)}
                  {renderInput("Signature", "signature", "Digital Signature", "text", false)}
                  {renderInput("Name Of Media", "mediaName", "Name Of Media", "text", false)}
                </div>

                {renderCheckboxGroup("List the names where the pictures will be released by your company", "mediaReleaseNames", [
                  "Magazine/Newspapers",
                  "TV",
                  "Public Broadcasting",
                  "Social Medias (must have 100k+ followers)",
                  "Global Networking",
                  "Website/Blog"
                ])}
              </div>
            )}

            {formData.requestParticipation === "Volunteer & Internship Programs" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Volunteer & Internship Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Education Major", "educationMajor", "Education Major", "text", false)}
                  {renderInput("School/College/University Address", "schoolAddress", "Address", "text", false)}
                  {renderInput("City", "city", "City", "text", false)}
                  {renderInput("State/Province", "state", "State/Province", "text", false)}
                  {renderInput("Zip/Postal Code", "zipCode", "Zip/Postal Code", "text", false)}
                  {renderInput("Country", "country", "Country", "text", false)}
                  {renderInput("Mobile Number", "phoneNumber", "Mobile Number", "tel", false)}
                  {renderInput("E-mail", "email", "Email", "email", false)}
                  {renderInput("Signature", "signature", "Signature", "text", false)}
                  {renderInput("Today Date", "date", "Today Date", "date", false)}
                </div>

                {renderCheckboxGroup("I'm Interested in volunteering at:", "volunteeringInterests", [
                  "UNITED STATES OF AMERICA",
                  "EUROPE",
                  "CANADA",
                  "SOUTH AMERICA",
                  "ASIA",
                  "AUSTRALIA",
                  "AFRICA"
                ])}
              </div>
            )}

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
            {activeTab === "designer" && formData.designCategory === "StudentDesigner"
              ? "STUDENT DESIGN APPLICATION"
              : activeTab === "designer" && formData.designCategory === "NewDesigner"
                ? "NEW DESIGNER APPLICATION"
                : activeTab === "designer" && formData.designCategory === "EstablishedDesigner"
                  ? "FASHION DESIGNER APPLICATION"
                  : tabs.find((t) => t.id === activeTab)?.label.toUpperCase()}
          </h2>
          <p className="text-gray-600 mb-8">
            {activeTab === "designer" && formData.designCategory === "StudentDesigner"
              ? "Empowering unique and excellent opportunity, learning by doing, real experience with the industry professional. Student fashion designers wishing to participate in our fashion events must complete the form, pay the amount of $10.00 USD fee and submit this pre-qualification form. Upon approval, you will receive a student designs application."
              : activeTab === "designer" && formData.designCategory === "NewDesigner"
                ? "New Designer fashion designs wishing to participate in our fashion show events must complete submit this form, you will receive a designer’s application, updated show schedules and event avenue contract."
                : activeTab === "designer" && formData.designCategory === "EstablishedDesigner"
                  ? "Each fashion designer participants in our Moda Week International fashion show events must complete submit this form, you will receive a designer’s application, updated show schedules and event avenue contract."
                  : descriptions[activeTab]}
          </p>

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
