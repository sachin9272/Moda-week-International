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
import { useSearchParams } from "react-router-dom";

export default function Service() {
  /* State for dynamic services */
  const [services, setServices] = React.useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
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

  React.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      const element = document.getElementById("application-forms");
      if (element) {
        // slight delay to allow layout to settle
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [searchParams]);


  const handleCardClick = () => {
    setSearchParams({ tab: "service" });
    const element = document.getElementById("application-forms");
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="h-auto md:h-[450px] w-full bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center py-10 md:py-0 px-6">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center md:px-16 px-4 mt-14 md:mt-0">
          <div className="flex flex-col gap-2">
            <p className="text-sm md:text-base">OUR SERVICES</p>
            <h2 className="text-3xl md:text-[44px] font-bold grad-text leading-tight uppercase">
              COLLABORATION & <br className="hidden md:block" />
              EXPOSURE PLATFORM
            </h2>
          </div>
          <div>
            <p className="text-[14px] md:text-[18px] text-black leading-7 text-justify mt-10">
              Moda Week International offers a premier platform for companies and brands to showcase their presence through our international fashion show productions and global promotional events. By participating, partners gain direct visibility to high value audiences, international designers, media, VIPs, and commerce industry, while accessing exclusive networking opportunities that foster long term collaboration. Through aligned sponsorships, branding, and co-produced initiatives, MWINTL creates meaningful mutual growth and global impact uniting fashion, culture, and business on an international stage platform.
            </p>
          </div>
        </div>
      </div>
      <section>
        <div className="p-8">
          <div className="font-bold pb-8">
            <p className="ml-4 grad-text text-[24px]">PRIMARY SERVICE TYPE</p>
            <div className="-mx-8 mt-3 border-t border-black"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((item, index) => (
              <div
                key={index}
                onClick={handleCardClick}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <ServiceCard
                  img={item.img}
                  title={item.title}
                  desc={item.desc}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Forms */}
      <div id="application-forms">
        <ApplicationForm />
      </div>
      <section className="text-white">
        <CtaSection />
      </section>
      <Footer />
    </div>
  );
}
