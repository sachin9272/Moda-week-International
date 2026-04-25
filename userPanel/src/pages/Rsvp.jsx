import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Eventrsvp from "../assets/eventrsvp.jpg";
import runway from "../assets/runnaway.jpg";
import { baseURL } from "../config/api";

const processSteps = [
  {
    number: "1",
    title: "Submit your RSVP",
    description: "Complete the confidential profile form below.",
  },
  {
    number: "2",
    title: "Introductory Call",
    description: "Participate in a brief 5-minute introductory call.",
  },
  {
    number: "3",
    title: "Receive VIP Access",
    description: "Upon approval, receive full event details and VIP arrangements.",
  },
];

const alignmentOptions = [
  "Strategic Partnership",
  "Brand Positioning & Global Expansion",
  "Private Sponsorship / Patronage",
  "Cultural & Institutional Collaboration",
  "Media & Global Influence",
];

const qualificationOptions = [
  "Annual income exceeding $300,000 USD (past two years)",
  "Net worth exceeding $1,000,000 USD (excluding primary residence)",
];

const confidentialityOptions = [
  "I acknowledge that this is a private, invitation-based experience.",
  "Submission of this form does not constitute acceptance.",
  "All information, communications, and structures related to MWINTL are to be treated with strict confidentiality.",
];

const initialFormState = {
  fullName: "",
  nationality: "",
  residenceCity: "",
  directContact: "",
  privateEmail: "",
  organization: "",
  roleTitle: "",
  sector: "",
  website: "",
  alignment: [],
  otherInterest: "",
  qualifications: [],
  confidentiality: [],
  signatureName: "",
  signatureDate: "",
};

export default function Rsvp() {
  const [formData, setFormData] = useState(initialFormState);
  const [pageImages, setPageImages] = useState({
    galaImage: Eventrsvp,
    seatingImage: runway,
  });

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    const fetchRsvpPage = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/rsvp-page`);
        setPageImages({
          galaImage: response.data.galaImage?.url || Eventrsvp,
          seatingImage: response.data.seatingImage?.url || runway,
        });
      } catch (error) {
        console.error("Error fetching RSVP page images:", error);
      }
    };

    fetchRsvpPage();
  }, []);

  const experienceCards = [
    {
      eyebrow: "Exclusive Access",
      title: "Private VIP Gala Dinner",
      description:
        "High-level networking with capital partners, brands, and creative leaders.",
      image: pageImages.galaImage,
    },
    {
      eyebrow: "Front Row",
      title: "Exclusive VIP Fashion Show Seating",
      description:
        "Strategic investment and collaboration opportunities.",
      image: pageImages.seatingImage,
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCheckboxGroup = (groupName, value) => {
    setFormData((current) => {
      const group = current[groupName];
      const nextGroup = group.includes(value)
        ? group.filter((item) => item !== value)
        : [...group, value];

      return {
        ...current,
        [groupName]: nextGroup,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitRsvp();
  };

  const submitRsvp = async () => {
    try {
      const response = await fetch(`${baseURL}/api/forms/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit RSVP application.");
      }

      toast.success("RSVP application submitted successfully!");
      setFormData(initialFormState);
    } catch (error) {
      console.error("RSVP submission error:", error);
      toast.error(error.message || "Failed to submit RSVP application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#C7913E] to-white pt-28 text-black">
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[120px] pointer-events-none" />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-12 pt-10 text-center md:pb-14">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8C5D25]">
            Private Access
          </p>
          <h1 className="relative inline-block bg-gradient-to-r from-[#3C2306] via-[#734F1C] to-[#C7913E] bg-clip-text font-playfair text-4xl text-transparent md:text-6xl">
            MWINTL | VIP RSVP
            <span className="absolute left-1/2 -bottom-4 h-1 w-24 -translate-x-1/2 bg-[#C7913E]"></span>
          </h1>
          <h2 className="mt-10 font-playfair text-2xl text-[#2f2f2f] md:text-4xl">
            Private Access
          </h2>
          <p className="mt-8 max-w-3xl text-sm leading-8 text-[#555] md:text-base">
            This RSVP is exclusively reserved for serious inquiries and distinguished
            guests seeking access to MWINTL&apos;s private events, strategic
            partnerships, and high-level benefits.
          </p>
          <a
            href="#confidential-profile"
            className="mt-10 inline-flex items-center justify-center bg-linear-to-r from-[#8C5D25] to-[#C7913E] px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(140,93,37,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Reserve Your Seat
          </a>
        </div>
      </section>

      <section className="bg-white px-6 py-10 md:py-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mx-auto max-w-4xl text-sm leading-8 text-[#626262] md:text-base">
            Our private gatherings are designed to connect executives, investors,
            and industry leaders within an intimate and curated environment that
            supports meaningful collaboration, investment, and long-term growth
            across our fashion and cultural platforms.
          </p>
          <h3 className="mt-14 font-playfair text-3xl text-[#1d1d1d] md:text-4xl">
            Private Experience
          </h3>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-2">
          {experienceCards.map((card) => (
            <div key={card.title} className="group">
              <div className="relative overflow-hidden bg-black">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[340px]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C7913E]">
                    {card.eyebrow}
                  </p>
                  <h4 className="mt-2 font-playfair text-2xl md:text-[30px]">
                    {card.title}
                  </h4>
                </div>
              </div>
              <p className="pt-5 text-sm leading-7 text-[#5a5a5a]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1a1a1a] px-6 py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-center font-playfair text-3xl md:text-5xl">
            Reservation Process
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.number} className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C7913E] text-sm font-semibold text-[#C7913E]">
                  {step.number}
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="confidential-profile" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#C7913E]">
            Confidential Profile
          </p>
          <h3 className="mt-4 font-playfair text-4xl text-[#1f1f1f] md:text-5xl">
            Express Your Interest
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-4xl border border-[#efefef] bg-[#fbfbfb] px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:px-12 md:py-12"
        >
          <FormSection title="Personal Information">
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput label="Full Name *" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <FormInput label="Nationality *" name="nationality" value={formData.nationality} onChange={handleChange} required />
              <FormInput label="City of Residence *" name="residenceCity" value={formData.residenceCity} onChange={handleChange} required />
              <FormInput label="Direct Contact *" name="directContact" value={formData.directContact} onChange={handleChange} required />
            </div>
            <div className="mt-5">
              <FormInput label="Private Email *" name="privateEmail" type="email" value={formData.privateEmail} onChange={handleChange} required />
            </div>
          </FormSection>

          <FormSection title="Professional & Strategic Positioning">
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput label="Organization / Brand *" name="organization" value={formData.organization} onChange={handleChange} required />
              <FormInput label="Role / Title *" name="roleTitle" value={formData.roleTitle} onChange={handleChange} required />
              <FormInput label="Primary Sector of Influence *" name="sector" value={formData.sector} onChange={handleChange} required />
              <FormInput label="Website / Portfolio" name="website" value={formData.website} onChange={handleChange} />
            </div>
          </FormSection>

          <FormSection title="Alignment & Interest">
            <p className="mb-4 text-sm text-[#5f5f5f]">
              Please indicate your area of alignment within MWINTL:
            </p>
            <div className="space-y-3">
              {alignmentOptions.map((option) => (
                <CheckboxRow
                  key={option}
                  label={option}
                  checked={formData.alignment.includes(option)}
                  onChange={() => handleCheckboxGroup("alignment", option)}
                />
              ))}
            </div>
            <div className="mt-5">
              <FormInput
                label="Other (By Discretion)"
                name="otherInterest"
                value={formData.otherInterest}
                onChange={handleChange}
              />
            </div>
          </FormSection>

          <FormSection title="Confidential Qualification">
            <p className="mb-4 text-sm leading-7 text-[#5f5f5f]">
              To preserve the integrity and level of this private environment,
              participation is aligned with individuals who meet the following criteria:
            </p>
            <div className="space-y-3">
              {qualificationOptions.map((option) => (
                <CheckboxRow
                  key={option}
                  label={option}
                  checked={formData.qualifications.includes(option)}
                  onChange={() => handleCheckboxGroup("qualifications", option)}
                />
              ))}
            </div>
          </FormSection>

          <FormSection title="Discretion & Confidentiality">
            <div className="space-y-3">
              {confidentialityOptions.map((option) => (
                <CheckboxRow
                  key={option}
                  label={option}
                  checked={formData.confidentiality.includes(option)}
                  onChange={() => handleCheckboxGroup("confidentiality", option)}
                />
              ))}
            </div>
          </FormSection>

          <FormSection title="Signature">
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput
                label="Full Name *"
                name="signatureName"
                value={formData.signatureName}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Date *"
                name="signatureDate"
                type="date"
                min={today}
                value={formData.signatureDate}
                onChange={handleChange}
                required
              />
            </div>
          </FormSection>

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              className="inline-flex min-w-[260px] items-center justify-center bg-linear-to-r from-[#8C5D25] via-[#C7913E] to-[#111] px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_24px_rgba(140,93,37,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Submit Confidential Profile
            </button>
          </div>
        </form>
      </section>

      <section className="bg-[#1a1a1a] px-6 py-10 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#C7913E]">
            Important Notice
          </p>
          <p className="mt-4 text-sm leading-8 text-white/75 md:text-base">
            Attendance is highly limited to preserve the exclusivity and value of
            the experience. Confirmed guests are kindly expected to honor their
            reservation.
          </p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C7913E] transition-colors hover:text-white"
            >
              Need additional assistance?
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="border-t border-[#e6e6e6] pt-8 first:border-t-0 first:pt-0">
      <h4 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b8b8b]">
        {title}
      </h4>
      {children}
    </section>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  min,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b8b8b]">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="h-12 w-full border border-[#ececec] bg-white px-4 text-sm text-black outline-none transition-colors focus:border-[#C7913E]"
      />
    </label>
  );
}

function CheckboxRow({ label, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 text-sm text-[#4f4f4f]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded-none border-[#d2d2d2] text-[#C7913E] focus:ring-[#C7913E]"
      />
      <span className="leading-6">{label}</span>
    </label>
  );
}
