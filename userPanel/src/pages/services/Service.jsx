import React from "react";
import Navbar from "../../components/Navbar";
import Service1 from "../../assets/services1.jpg";
import services1 from "../../assets/service1.jpg";
import services2 from "../../assets/service2.jpg";
import services3 from "../../assets/service3.png";
import services4 from "../../assets/service4.png";
import ServiceCard from "./ServiceCard";
import ApplicationForm from "./Forms";
import CtaSection from "../../components/CtaSection";
import Footer from "../../components/Footer";
import { baseURL } from '../../config/api';

export default function Service() {
  /* State for dynamic services */
  const [services, setServices] = React.useState([]);
  const [heroData, setHeroData] = React.useState({
    title: "COLLABORATION & EXPOSURE PLATFORM",
    subtitle: "OUR SERVICES",
    description: "Moda Week International offers a premier platform for companies and brands to showcase their presence through our international fashion show productions and global promotional events. By participating, partners gain direct visibility to high value audiences, international designers, media, VIPs, and commerce industry, while accessing exclusive networking opportunities that foster long term collaboration. Through aligned sponsorships, branding, and co-produced initiatives, MWINTL creates meaningful mutual growth and global impact uniting fashion, culture, and business on an international stage platform.",
    image: Service1 // Default image
  });

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${baseURL}/api/service-types`);
        const data = await response.json();
        if (data && data.length > 0) {
          const formatted = data.map(s => ({
            title: s.title,
            desc: s.description,
            img: s.image
          }));
          setServices(formatted);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    };

    const fetchHero = async () => {
      try {
        const response = await fetch(`${baseURL}/api/service-hero`);
        const data = await response.json();
        if (data) {
          setHeroData({
            title: data.title || heroData.title,
            subtitle: data.subtitle || heroData.subtitle,
            description: data.description || heroData.description,
            image: data.image || Service1
          });
        }
      } catch (error) {
        console.error("Failed to fetch hero data", error);
      }
    };

    fetchServices();
    fetchHero();
  }, []);


  return (
    <div>
      <Navbar />
      <section
        className="relative w-full min-h-[90vh] flex items-center bg-cover bg-top"
        style={{ backgroundImage: `url(${heroData.image})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/75"></div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-2 py-8 md:gap-12 w-full max-w-6xl mx-auto px-6">
          {/* Left Content */}
          <div className="text-white flex flex-col justify-center mt-28">
            <p className="text-xl tracking-widest mb-3 uppercase">{heroData.subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6 uppercase">
              {heroData.title}
            </h2>
          </div>

          {/* Right side empty — background image already covers */}
          <div>
            <p className="text-lg md:text-base leading-loose text-white">
              {heroData.description}
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
      <ApplicationForm />
      <section className="text-white">
        <CtaSection />
      </section>
      <Footer />
    </div>
  );
}
