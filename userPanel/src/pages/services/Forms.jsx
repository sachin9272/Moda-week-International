import React, { useState, useEffect } from "react";
import { ShoppingBag, Palette, Award, HandHeart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { baseURL } from "../../config/api";

const ApplicationForm = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "service";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    photo: null,

    // Volunteer & Internship
    educationMajor: "",
    volunteeringInterests: [],

    // Booth / Table Exhibition Spaces
    exhibitItems: "",
    preferredEventLocation: "",
    boothTablePreference: "",
    samplesDemonstrations: "",
    specialRequirements: "",
    brandLogo: null,

    // Consulting Services
    consultationTypes: [],
    projectDescription: "",
    assistanceNeeded: "",
    desiredStartDate: "",
    estimatedBudget: "",

    // Digital Marketing & Media Promotion
    promoteDescription: "",
    servicesInterested: [],
    targetAudience: "",
    targetMarket: "",
    campaignStartDate: "",
    campaignDuration: "",
    mediaKit: null,

    // Fashion Show Production
    collectionType: "",
    numberOfLooks: "",
    targetCategory: "",
    productionTypes: [],
    modelsRequired: "",
    hairMakeupRequired: "",
    photoVideoRequired: "",
    preferredCityCountry: "",
    preferredEventDate: "",
    lookbook: null,

    // Membership Programs
    membershipProgram: "",
    membershipType: "",
    membershipGoals: "",
    areasOfInterest: [],
    professionalBio: "",
    membershipLogo: null,

    // Performances & Live Entertainment
    performanceTypes: [],
    numberOfPerformers: "",
    performanceDuration: "",
    stageRequirements: "",
    eventInterestedIn: "",
    pressKit: null,
    performanceVideoLink: "",
    artistBio: "",

    // Top Models & Casting Opportunities
    age: "",
    gender: "",
    instagram: "",
    height: "",
    bustChest: "",
    waist: "",
    hips: "",
    dressSuitSize: "",
    shoeSize: "",
    eyeColor: "",
    hairColor: "",
    modelingExperience: "",
    agencyRepresented: "",
    runwayExperience: "",
    eventCastingInterest: "",
    compCard: null,
    digitals: null,
    runwayVideoLink: "",
    availability: "",
    parentGuardianContact: "",
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files && files[0] ? files[0] : null,
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
    if (isSubmitting) return;

    // Define different API endpoints for each tab
    const apiEndpoints = {
      buyer: `${baseURL}/api/forms/buyer`,
      designer: `${baseURL}/api/forms/designer`,
      sponsor: `${baseURL}/api/forms/sponsor`,
      service: `${baseURL}/api/forms/service`,
    };

    if (activeTab === "service" && formData.requestParticipation === "Press & Media Accreditation") {
      const requiredPressFields = [
        ["companyName", "Company Name"],
        ["address", "Address"],
        ["city", "City"],
        ["state", "State/Province"],
        ["zipCode", "Zip/Postal Code"],
        ["website", "Website"],
        ["currentEvent", "Current Event"],
        ["jobTitle", "Title"],
        ["date", "Date"],
        ["signature", "Signature"],
        ["mediaName", "Name Of Media"],
      ];
      const missingField = requiredPressFields.find(([field]) => !String(formData[field] || "").trim());
      if (missingField) {
        toast.error(`${missingField[1]} is required.`);
        return;
      }

      if (!formData.photo) {
        toast.error("Please upload a photo to appear on your Press Pass.");
        return;
      }
    }

    if (activeTab === "service" && formData.requestParticipation === "Booth / Table Exhibition Spaces") {
      const requiredBoothFields = [
        ["companyName", "Company / Brand Name"],
        ["businessType", "Type of Business / Product"],
        ["exhibitItems", "What would you like to exhibit?"],
        ["preferredEventLocation", "Preferred Event / Location"],
        ["boothTablePreference", "Booth or Table Preference"],
        ["samplesDemonstrations", "Will you offer samples or demonstrations?"],
      ];
      const missingBoothField = requiredBoothFields.find(([field]) => !String(formData[field] || "").trim());
      if (missingBoothField) {
        toast.error(`${missingBoothField[1]} is required.`);
        return;
      }
    }

    if (activeTab === "service" && formData.requestParticipation === "Consulting Services") {
      const requiredConsultingFields = [
        ["companyName", "Company / Organization"],
        ["city", "Country / City"],
        ["projectDescription", "Briefly describe your project or business"],
        ["assistanceNeeded", "What would you like our assistance with?"],
      ];
      const missingConsultingField = requiredConsultingFields.find(([field]) => !String(formData[field] || "").trim());
      if (missingConsultingField) {
        toast.error(`${missingConsultingField[1]} is required.`);
        return;
      }

      if (!formData.consultationTypes || formData.consultationTypes.length === 0) {
        toast.error("Please select at least one Type of Consultation Needed.");
        return;
      }
    }

    if (activeTab === "service" && formData.requestParticipation === "Digital Marketing & Media Promotion") {
      const requiredMarketingFields = [
        ["companyName", "Company / Brand"],
        ["industry", "Industry"],
        ["promoteDescription", "What would you like to promote?"],
        ["targetAudience", "Target Audience"],
        ["targetMarket", "Target Country / Market"],
      ];
      const missingMarketingField = requiredMarketingFields.find(([field]) => !String(formData[field] || "").trim());
      if (missingMarketingField) {
        toast.error(`${missingMarketingField[1]} is required.`);
        return;
      }

      if (!formData.servicesInterested || formData.servicesInterested.length === 0) {
        toast.error("Please select at least one Service Interested In.");
        return;
      }
    }

    if (activeTab === "service" && formData.requestParticipation === "Fashion Show Production") {
      const requiredFashionShowFields = [
        ["brandName", "Designer / Brand Name"],
        ["contactName", "Contact Person"],
        ["collectionType", "Type of Collection"],
        ["numberOfLooks", "Number of Looks"],
        ["targetCategory", "Women / Men / Unisex / Children"],
        ["modelsRequired", "Models Required?"],
        ["hairMakeupRequired", "Hair & Makeup Required?"],
        ["photoVideoRequired", "Photo / Video Required?"],
        ["preferredCityCountry", "Preferred City / Country"],
        ["preferredEventDate", "Preferred Event Date"],
      ];
      const missingFashionShowField = requiredFashionShowFields.find(([field]) => !String(formData[field] || "").trim());
      if (missingFashionShowField) {
        toast.error(`${missingFashionShowField[1]} is required.`);
        return;
      }

      if (!formData.productionTypes || formData.productionTypes.length === 0) {
        toast.error("Please select at least one Type of Production Needed.");
        return;
      }
    }

    if (activeTab === "service" && formData.requestParticipation === "Membership Programs") {
      const requiredMembershipFields = [
        ["companyName", "Company / Professional Name"],
        ["city", "Country / City"],
        ["industry", "Profession / Industry"],
        ["membershipProgram", "Membership Program Interested In"],
        ["membershipType", "Individual / Company"],
        ["membershipGoals", "What are you looking to gain from the network?"],
        ["professionalBio", "Short Professional Bio"],
      ];
      const missingMembershipField = requiredMembershipFields.find(([field]) => !String(formData[field] || "").trim());
      if (missingMembershipField) {
        toast.error(`${missingMembershipField[1]} is required.`);
        return;
      }

      if (!formData.areasOfInterest || formData.areasOfInterest.length === 0) {
        toast.error("Please select at least one Area of Interest.");
        return;
      }
    }

    if (activeTab === "service" && formData.requestParticipation === "Performances & Live Entertainment") {
      const requiredPerformanceFields = [
        ["brandName", "Artist / Group Name"],
        ["contactName", "Contact Person"],
        ["city", "Country / City"],
        ["numberOfPerformers", "Number of Performers"],
        ["performanceDuration", "Performance Duration"],
        ["eventInterestedIn", "Event Interested In"],
        ["artistBio", "Short Artist Biography"],
      ];
      const missingPerformanceField = requiredPerformanceFields.find(([field]) => !String(formData[field] || "").trim());
      if (missingPerformanceField) {
        toast.error(`${missingPerformanceField[1]} is required.`);
        return;
      }

      if (!formData.performanceTypes || formData.performanceTypes.length === 0) {
        toast.error("Please select at least one Type of Performance.");
        return;
      }
    }

    if (activeTab === "service" && formData.requestParticipation === "Top Models & Casting Opportunities") {
      const requiredModelFields = [
        ["age", "Age"],
        ["gender", "Gender"],
        ["city", "City / Country"],
        ["height", "Height"],
        ["bustChest", "Bust / Chest"],
        ["waist", "Waist"],
        ["hips", "Hips"],
        ["dressSuitSize", "Dress / Suit Size"],
        ["shoeSize", "Shoe Size"],
        ["eyeColor", "Eye Color"],
        ["hairColor", "Hair Color"],
        ["runwayExperience", "Runway Experience"],
        ["eventCastingInterest", "Event / Casting Interested In"],
        ["availability", "Availability"],
      ];
      const missingModelField = requiredModelFields.find(([field]) => !String(formData[field] || "").trim());
      if (missingModelField) {
        toast.error(`${missingModelField[1]} is required.`);
        return;
      }

      if (!formData.compCard) {
        toast.error("Please upload your Comp Card.");
        return;
      }

      if (Number(formData.age) < 18 && !String(formData.parentGuardianContact || "").trim()) {
        toast.error("Parent / Guardian Contact is required for applicants under 18.");
        return;
      }
    }

    console.log("Submitting Form Data:", formData);

    setIsSubmitting(true);
    try {
      let response;

      if (activeTab === "service") {
        // Sent as multipart/form-data so the optional photo upload can travel with the rest of the fields
        const fileFields = ["photo", "compCard", "digitals", "brandLogo", "mediaKit", "lookbook", "membershipLogo", "pressKit"];
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (fileFields.includes(key)) return;
          if (Array.isArray(value)) {
            payload.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            payload.append(key, value);
          }
        });
        fileFields.forEach((field) => {
          if (formData[field]) {
            payload.append(field, formData[field]);
          }
        });

        response = await fetch(apiEndpoints[activeTab], {
          method: "POST",
          body: payload,
        });
      } else {
        response = await fetch(apiEndpoints[activeTab], {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

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
          photo: null,

          // Volunteer & Internship
          educationMajor: "",
          volunteeringInterests: [],

          // Booth / Table Exhibition Spaces
          exhibitItems: "",
          preferredEventLocation: "",
          boothTablePreference: "",
          samplesDemonstrations: "",
          specialRequirements: "",
          brandLogo: null,

          // Consulting Services
          consultationTypes: [],
          projectDescription: "",
          assistanceNeeded: "",
          desiredStartDate: "",
          estimatedBudget: "",

          // Digital Marketing & Media Promotion
          promoteDescription: "",
          servicesInterested: [],
          targetAudience: "",
          targetMarket: "",
          campaignStartDate: "",
          campaignDuration: "",
          mediaKit: null,

          // Fashion Show Production
          collectionType: "",
          numberOfLooks: "",
          targetCategory: "",
          productionTypes: [],
          modelsRequired: "",
          hairMakeupRequired: "",
          photoVideoRequired: "",
          preferredCityCountry: "",
          preferredEventDate: "",
          lookbook: null,

          // Membership Programs
          membershipProgram: "",
          membershipType: "",
          membershipGoals: "",
          areasOfInterest: [],
          professionalBio: "",
          membershipLogo: null,

          // Performances & Live Entertainment
          performanceTypes: [],
          numberOfPerformers: "",
          performanceDuration: "",
          stageRequirements: "",
          eventInterestedIn: "",
          pressKit: null,
          performanceVideoLink: "",
          artistBio: "",

          // Top Models & Casting Opportunities
          age: "",
          gender: "",
          instagram: "",
          height: "",
          bustChest: "",
          waist: "",
          hips: "",
          dressSuitSize: "",
          shoeSize: "",
          eyeColor: "",
          hairColor: "",
          modelingExperience: "",
          agencyRepresented: "",
          runwayExperience: "",
          eventCastingInterest: "",
          compCard: null,
          digitals: null,
          runwayVideoLink: "",
          availability: "",
          parentGuardianContact: "",
        });
      } else {
        toast.error(data.message || "Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
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
        required={required}
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
              {renderInput("Full Name", "fullName", "Full Name", "text")}
              {renderInput("Phone Number", "phoneNumber", "+1 (555) 000-0000", "tel")}
              {renderInput("Email", "email", "email@company.com", "email")}
              {renderInput("Country", "country", "Country")}
            </div>
            {renderRadioGroup("Request Participation", "requestParticipation", participationOptions)}

            {formData.requestParticipation === "Performances & Live Entertainment" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Performances & Live Entertainment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Artist / Group Name", "brandName", "Artist / Group Name", "text")}
                  {renderInput("Contact Person", "contactName", "Contact Person", "text")}
                  {renderInput("Country / City", "city", "Country / City", "text")}
                  {renderInput("Website", "website", "https://example.com", "url", false)}
                  {renderInput("Instagram / YouTube / Spotify", "instagram", "Profile link or handle", "text", false)}
                  {renderInput("Number of Performers", "numberOfPerformers", "e.g., 3", "number")}
                  {renderInput("Performance Duration", "performanceDuration", "e.g., 20 minutes", "text")}
                  {renderInput("Event Interested In", "eventInterestedIn", "Event Interested In", "text")}
                  {renderInput("Performance Fee / Rate", "estimatedBudget", "e.g., $500 - $1,000", "text", false)}
                  {renderInput("Upload / Link Performance Video", "performanceVideoLink", "https://youtube.com/...", "url", false)}
                </div>

                {renderCheckboxGroup("Type of Performance", "performanceTypes", [
                  "Singer",
                  "Musician",
                  "Band",
                  "DJ",
                  "Dance",
                  "Cultural Performance",
                  "Live Art",
                  "Other",
                ])}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Technical / Stage Requirements
                  </label>
                  <textarea
                    name="stageRequirements"
                    value={formData.stageRequirements}
                    onChange={handleInputChange}
                    placeholder="Let us know about any technical or stage needs..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Short Artist Biography <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="artistBio"
                    value={formData.artistBio}
                    onChange={handleInputChange}
                    placeholder="Tell us about the artist / group..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Upload Press Kit
                  </label>
                  <input
                    type="file"
                    name="pressKit"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
                  />
                  {formData.pressKit && (
                    <p className="mt-2 text-xs text-gray-500">Selected: {formData.pressKit.name}</p>
                  )}
                </div>
              </div>
            )}

            {formData.requestParticipation === "Membership Programs" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Membership Program Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Company / Professional Name", "companyName", "Company / Professional Name", "text")}
                  {renderInput("Country / City", "city", "Country / City", "text")}
                  {renderInput("Profession / Industry", "industry", "e.g., Fashion Designer, Photographer", "text")}
                  {renderInput("Company Website", "website", "https://example.com", "url", false)}
                  {renderInput("Instagram / LinkedIn", "instagram", "Profile link or handle", "text", false)}
                  {renderInput("Membership Program Interested In", "membershipProgram", "e.g., Designer Membership, Media Membership", "text")}
                  {renderSelect("Individual / Company", "membershipType", [
                    { value: "Individual", label: "Individual" },
                    { value: "Company", label: "Company" },
                  ])}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    What are you looking to gain from the network? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="membershipGoals"
                    value={formData.membershipGoals}
                    onChange={handleInputChange}
                    placeholder="Tell us what you're hoping to gain..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {renderCheckboxGroup("Areas of Interest", "areasOfInterest", [
                  "Fashion",
                  "Business",
                  "Art",
                  "Tourism",
                  "Media",
                  "Education",
                  "International Networking",
                  "Events",
                ])}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Short Professional Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="professionalBio"
                    value={formData.professionalBio}
                    onChange={handleInputChange}
                    placeholder="A brief bio about your professional background..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Upload Photo / Company Logo
                  </label>
                  <input
                    type="file"
                    name="membershipLogo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
                  />
                  {formData.membershipLogo && (
                    <p className="mt-2 text-xs text-gray-500">Selected: {formData.membershipLogo.name}</p>
                  )}
                </div>
              </div>
            )}

            {formData.requestParticipation === "Fashion Show Production" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Fashion Show Production Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Designer / Brand Name", "brandName", "Designer / Brand Name", "text")}
                  {renderInput("Contact Person", "contactName", "Contact Person", "text")}
                  {renderInput("Website", "website", "https://example.com", "url", false)}
                  {renderInput("Instagram", "instagram", "@yourhandle", "text", false)}
                  {renderInput("Type of Collection", "collectionType", "e.g., Ready-to-wear, Couture, Streetwear", "text")}
                  {renderInput("Number of Looks", "numberOfLooks", "e.g., 12", "number")}
                  {renderSelect("Women / Men / Unisex / Children", "targetCategory", [
                    { value: "Women", label: "Women" },
                    { value: "Men", label: "Men" },
                    { value: "Unisex", label: "Unisex" },
                    { value: "Children", label: "Children" },
                  ])}
                  {renderInput("Preferred City / Country", "preferredCityCountry", "Preferred City / Country", "text")}
                  {renderInput("Preferred Event Date", "preferredEventDate", "Select Date", "date")}
                  {renderInput("Estimated Budget", "estimatedBudget", "e.g., $5,000 - $10,000", "text", false)}
                </div>

                {renderCheckboxGroup("Type of Production Needed", "productionTypes", [
                  "Full Fashion Show Production",
                  "Runway Presentation",
                  "Private Brand Show",
                  "Collection Showcase",
                  "International Event Participation",
                ])}

                {renderRadioGroup("Models Required?", "modelsRequired", ["Yes", "No"])}
                {renderRadioGroup("Hair & Makeup Required?", "hairMakeupRequired", ["Yes", "No"])}
                {renderRadioGroup("Photo / Video Required?", "photoVideoRequired", ["Yes", "No"])}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Upload Lookbook / Collection
                  </label>
                  <input
                    type="file"
                    name="lookbook"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
                  />
                  {formData.lookbook && (
                    <p className="mt-2 text-xs text-gray-500">Selected: {formData.lookbook.name}</p>
                  )}
                </div>
              </div>
            )}

            {formData.requestParticipation === "Digital Marketing & Media Promotion" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Digital Marketing & Media Promotion Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Company / Brand", "companyName", "Company / Brand", "text")}
                  {renderInput("Website", "website", "https://example.com", "url", false)}
                  {renderInput("Social Media Accounts", "socialMediaLink", "@yourhandle or profile links", "text", false)}
                  {renderInput("Industry", "industry", "e.g., Fashion, Beauty, Technology", "text")}
                  {renderInput("Target Audience", "targetAudience", "e.g., Women 18-35, Fashion buyers", "text")}
                  {renderInput("Target Country / Market", "targetMarket", "Target Country / Market", "text")}
                  {renderInput("Campaign Start Date", "campaignStartDate", "Select Date", "date", false)}
                  {renderInput("Campaign Duration", "campaignDuration", "e.g., 1 month, 3 months", "text", false)}
                  {renderInput("Estimated Budget", "estimatedBudget", "e.g., $5,000 - $10,000", "text", false)}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    What would you like to promote? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="promoteDescription"
                    value={formData.promoteDescription}
                    onChange={handleInputChange}
                    placeholder="Tell us about the brand, product, or event you'd like to promote..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {renderCheckboxGroup("Services Interested In", "servicesInterested", [
                  "Social Media Promotion",
                  "Website Advertising",
                  "Newsroom Feature",
                  "Brand Feature",
                  "Event Promotion",
                  "Video Promotion",
                  "Email Marketing",
                  "Press / Media Exposure",
                  "Other",
                ])}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Upload Logo / Media Kit
                  </label>
                  <input
                    type="file"
                    name="mediaKit"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
                  />
                  {formData.mediaKit && (
                    <p className="mt-2 text-xs text-gray-500">Selected: {formData.mediaKit.name}</p>
                  )}
                </div>
              </div>
            )}

            {formData.requestParticipation === "Consulting Services" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Consulting Services Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Company / Organization", "companyName", "Company / Organization", "text")}
                  {renderInput("Country / City", "city", "Country / City", "text")}
                  {renderInput("Website", "website", "https://example.com", "url", false)}
                  {renderInput("Desired Start Date", "desiredStartDate", "Select Date", "date", false)}
                  {renderInput("Estimated Budget", "estimatedBudget", "e.g., $5,000 - $10,000", "text", false)}
                </div>

                {renderCheckboxGroup("Type of Consultation Needed", "consultationTypes", [
                  "Event Production",
                  "Fashion Industry",
                  "Business Development",
                  "Branding",
                  "International Expansion",
                  "Sponsorship Strategy",
                  "Other",
                ])}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Briefly describe your project or business <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project or business..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    What would you like our assistance with? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="assistanceNeeded"
                    value={formData.assistanceNeeded}
                    onChange={handleInputChange}
                    placeholder="Let us know what you'd like help with..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            )}

            {formData.requestParticipation === "Booth / Table Exhibition Spaces" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Booth / Table Exhibition Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Company / Brand Name", "companyName", "Company / Brand Name", "text")}
                  {renderInput("Website", "website", "https://example.com", "url", false)}
                  {renderInput("Instagram / Social Media", "instagram", "@yourhandle", "text", false)}
                  {renderInput("Type of Business / Product", "businessType", "e.g., Apparel, Accessories, Beauty", "text")}
                  {renderSelect("Booth or Table Preference", "boothTablePreference", [
                    { value: "Booth", label: "Booth" },
                    { value: "Table", label: "Table" },
                  ])}
                  {renderInput("Preferred Event / Location", "preferredEventLocation", "Preferred Event / Location", "text")}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    What would you like to exhibit? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="exhibitItems"
                    value={formData.exhibitItems}
                    onChange={handleInputChange}
                    placeholder="Describe the products / collection you plan to exhibit..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {renderRadioGroup("Will you offer samples or demonstrations?", "samplesDemonstrations", ["Yes", "No"])}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Special Space / Electrical Requirements
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    placeholder="Let us know about any special space or electrical needs..."
                    rows="2"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Upload Brand Logo
                  </label>
                  <input
                    type="file"
                    name="brandLogo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
                  />
                  {formData.brandLogo && (
                    <p className="mt-2 text-xs text-gray-500">Selected: {formData.brandLogo.name}</p>
                  )}
                </div>
              </div>
            )}

            {formData.requestParticipation === "Press & Media Accreditation" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Press & Media Accreditation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Company Name", "companyName", "Company Name", "text")}
                  {renderInput("Address", "address", "Address", "text")}
                  {renderInput("City", "city", "City", "text")}
                  {renderInput("State/Province", "state", "State/Province", "text")}
                  {renderInput("Zip/Postal Code", "zipCode", "Zip/Postal Code", "text")}
                  {renderInput("Fax", "fax", "Fax Number", "tel", false)}
                  {renderInput("Website", "website", "https://example.com", "url")}
                  {renderInput("Current Event", "currentEvent", "Current Event", "text")}
                  {renderInput("Title", "jobTitle", "Title", "text")}
                  {renderInput("Date", "date", "Select Date", "date")}
                  {renderInput("Signature", "signature", "Digital Signature", "text")}
                  {renderInput("Name Of Media", "mediaName", "Name Of Media", "text")}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Upload Photo (for your Press Pass ID card) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
                  />
                  {formData.photo && (
                    <p className="mt-2 text-xs text-gray-500">Selected: {formData.photo.name}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    This photo will appear on the digital Press Pass sent to your email once your application is approved.
                  </p>
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

            {formData.requestParticipation === "Top Models & Casting Opportunities" && (
              <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
                <h3 className="text-xl font-bold mb-6">Top Models & Casting Opportunities Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("Age", "age", "Age", "number")}
                  {renderSelect("Gender", "gender", [
                    { value: "Female", label: "Female" },
                    { value: "Male", label: "Male" },
                    { value: "Non-binary", label: "Non-binary" },
                    { value: "Other", label: "Other" },
                  ])}
                  {renderInput("City / Country", "city", "City / Country", "text")}
                  {renderInput("Instagram", "instagram", "@yourhandle", "text", false)}
                  {renderInput("Height", "height", "e.g., 5'9\" / 175cm")}
                  {renderInput("Bust / Chest", "bustChest", "e.g., 34in / 86cm")}
                  {renderInput("Waist", "waist", "e.g., 26in / 66cm")}
                  {renderInput("Hips", "hips", "e.g., 36in / 91cm")}
                  {renderInput("Dress / Suit Size", "dressSuitSize", "e.g., US 4 / EU 36")}
                  {renderInput("Shoe Size", "shoeSize", "e.g., US 8 / EU 39")}
                  {renderInput("Eye Color", "eyeColor", "Eye Color")}
                  {renderInput("Hair Color", "hairColor", "Hair Color")}
                  {renderInput("Modeling Experience", "modelingExperience", "Years / brief summary", "text", false)}
                  {renderInput("Agency, if represented", "agencyRepresented", "Agency Name", "text", false)}
                  {renderInput("Event / Casting Interested In", "eventCastingInterest", "Event / Casting")}
                  {renderInput("Runway Walk Video / Link", "runwayVideoLink", "https://...", "url", false)}
                  {renderInput("Availability", "availability", "e.g., Dates you're available")}
                  {renderInput("Parent / Guardian Contact (required for applicants under 18)", "parentGuardianContact", "Name & Phone", "text", false)}
                </div>

                {renderRadioGroup("Runway Experience", "runwayExperience", ["Yes", "No"])}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Upload Comp Card <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="compCard"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
                    />
                    {formData.compCard && (
                      <p className="mt-2 text-xs text-gray-500">Selected: {formData.compCard.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Upload Digitals
                    </label>
                    <input
                      type="file"
                      name="digitals"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
                    />
                    {formData.digitals && (
                      <p className="mt-2 text-xs text-gray-500">Selected: {formData.digitals.name}</p>
                    )}
                  </div>
                </div>
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
                disabled={isSubmitting}
                className="w-full bg-black text-white py-2 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
