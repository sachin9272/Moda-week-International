import React from "react";
import Service1 from "../../assets/services1.jpg";
import services1 from "../../assets/service1.jpg";
import services2 from "../../assets/service2.jpg";
import services3 from "../../assets/service3.png";
import services4 from "../../assets/service4.png";
import ServiceCard from "./ServiceCard";
import ApplicationForm from "./Forms";
import CtaSection from "../../components/CtaSection";
import Footer from "../../components/Footer";

export default function Service() {
  const services = [
    {
      img: services1,
      title: "INTERNATIONAL FASHION SHOW",
      desc: "Signature runway productions that unite global talent, deliver high-impact visibility, and create luxury cultural experiences for brands, designers, and audiences worldwide.",
    },
    {
      img: services2,
      title: "CONSULTING SERVICES",
      desc: "Strategic guidance for fashion designers, brands, performances, and emerging companies covering collection development, branding, business positioning, event participation, and international market expansion.",
    },
    {
      img: services3,
      title: "SPONSORSHIP & CORPORATE PARTNERSHIP",
      desc: "Customized alliances offering brand integration, VIP exposure, media visibility, and co-branded opportunities that generate mutual growth and measurable impact.",
    },
    {
      img: services4,
      title: "FASHION DESIGNER PLATFORM",
      desc: "A premier stage platform for established and emerging designers to present collections, access global press, gain industry recognition, and scale their brand internationally.",
    },
  ];

  return (
    <div>
      <section
        className="relative w-full min-h-[90vh] flex items-center bg-cover bg-top"
        style={{ backgroundImage: `url(${Service1})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/75"></div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-6xl mx-auto px-6">
          {/* Left Content */}
          <div className="text-white flex flex-col justify-center">
            <p className="text-xl tracking-widest mb-3">OUR SERVICES</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              COLLABORATION &
              <br />
              EXPOSURE PLATFORM
            </h2>
          </div>

          {/* Right side empty — background image already covers */}
          <div>
            <p className="text-lg md:text-base leading-loose text-white">
              Moda Week International offers a premier platform for companies
              and brands to showcase their presence through our international
              fashion show productions and global promotional events. By
              participating, partners gain direct visibility to high value
              audiences, international designers, media, VIPs, and commerce
              industry, while accessing exclusive networking opportunities that
              foster long term collaboration. Through aligned sponsorships,
              branding, and co-produced initiatives, MWINTL creates meaningful
              mutual growth and global impact uniting fashion, culture, and
              business on an international stage platform.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="p-8">
          <div className="font-bold pb-8">
            <p className="ml-4  grad-text text-[24px]">PRIMARY SERVICE TYPE</p>
            <div className="-mx-8 mt-3 border-t  border-black "></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((item, index) => (
              <ServiceCard
                key={index}
                img={item.img}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Application Forms */}
      <ApplicationForm/>
      <section className="text-white">
        <CtaSection/>
      </section>
      <Footer/>
    </div>
  );
}
