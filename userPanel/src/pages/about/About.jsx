import AboutUsTop from "../../assets/aboutustop.png";
import AboutUs1 from "../../assets/aboutus1.png";
import Founder from "../../assets/founder.png";
import Founder2 from "../../assets/founder2.jpg";
import CtaSection from "../../components/CtaSection";
import Card from "./Card";
import Footer from "../../components/Footer";
import { ChevronDown } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function ModaWeekSite() {
  const cardData = [
    {
      title: "VISIONARIES",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      description:
        "MWINTL leads the future of the fashion industry by transforming traditional runway events into global platforms of purpose. We anticipate trends, create new pathways for international collaboration, and elevate fashion beyond aesthetics, into education, social impact, and long-term industry development.",
    },
    {
      title: "CULTURE",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
      description:
        "Rooted in diversity and global heritage, celebrates fashion as a cultural bridge. We unite nations, indigenous communities, and international designers under one stage, honoring identity, storytelling, and artistic expression while positioning culture as a driving force for global connection",
    },
    {
      title: "INNOVATION",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
      description:
        "From international partnerships to emerging talent development and global fashion calendar systems, we provide forward thinking solutions that shape the industry of today and the one yet to come.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${AboutUsTop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "539.4px",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/90 z-10"></div>
        <div className="relative z-20 text-center px-4">
          <h2 className="text-4xl font-bold mb-6 tracking-wider">
            WHAT IS MODA WEEK INTERNATIONAL
          </h2>
          <span className="absolute w-[50%] left-1/4 md:bottom-32 h-px bg-linear-to-r from-transparent via-yellow-500 to-transparent"></span>

          <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mt-24 md:mt-10">
            INTERNATIONAL FASHION SHOW PRODUCTION ORGANIZATION WITH THE PURPOSE
            OF CONVEYING GLAMOROUS EVENTS, EDUCATION & COMMUNITY SUPPORT.
          </p>
          <ChevronDown className="text-[#A87530] absolute left-1/2 md:bottom-[-90px] -bottom-10" />
        </div>
      </section>

      {/* Moda Week International Section */}
      <section className="p-10 bg-white text-gray-900">
        <div className="max-w-9xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 grad-text">
            MODA WEEK INTERNATIONAL
          </h2>
          <p className="text-lg mb-4 leading-relaxed">
            Moda Week International (MWINTL) is a prestigious philanthropic
            fashion show production and global business commerce platform that
            brings together distinguished fashion designers, world-class
            performances, industry leaders, and influential audiences, combining
            philanthropy, business, and cultural leadership.
          </p>
          <p className="text-lg mb-4 leading-relaxed">
            Participants and partners of MWINTL gain privileged access to
            exclusive business opportunities, strategic industry connections and
            elite media exposure. Benefits include high-visibility recognition
            and market influence.
          </p>
          <p className="text-lg mb-4 leading-relaxed">
            MWINTL beyond glamour and commerce, is rooted in a higher purpose.
            Our mission is to produce iconic fashion events with meaningful
            impact, empowering lives through education, communities advancement,
            and cultural celebration. We proudly stand as a global philanthropic
            movement that produce fashion show events as real-world
            transformation.
          </p>

          <p className="text-lg mb-4 leading-relaxed">
            MWINTL where fashion meets purpose, business meets impact, every
            fashion show runway open doors to a brighter and powerful
            improvement to the world.
          </p>
        </div>
        <div className="mt-6">
          <img
            src={AboutUs1}
            alt="About Us"
            className="max-w-9xl w-full h-[373px] object-cover"
          />
        </div>
      </section>

      {/* Foundation Section */}
      <section className="py-10 px-4 bg-[radial-gradient(circle_at_top_left,#C7913E_10%,#C7913E_10%,white_80%)]">
        <div className="max-w-9xl ">
          {/* <div className="flex flex-col md:flex-row items-center md:items-start gap-12"> */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-12">
            <div className="w-full flex justify-center h-full items-center">
              <img
                src={Founder}
                alt="Founder"
                className="shadow-lg w-full max-w-sm object-cover"
              />
            </div>

            <div className="text-gray-800">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 grad-text">
                FOUNDATION
              </h2>
              <p className="md:text-sm mb-3 leading-relaxed">
                "Leading the Way in Fashion and Education: The Chairwoman and
                CEO of Moda Week International"
              </p>
              <p className="md:text-sm mb-1 leading-relaxed">
                I am deeply fascinated by the art of global fashion, and always
                seek to explore its finest expressions." Esmeralda is a
                executive fashion show producer, experience and expertise in the
                field. Her multicultural background and exceptional
                organizational skills have played a significant role in her
                success, as she draws inspiration from a diverse range of
                influences. Originally from Leticia, Amazonas  the southernmost
                city in Colombia, bordering Peru and Brazil - Esmeralda's work
                is infused with the unique cultural and natural treasures of her
                native region.
              </p>
              <p className="md:text-sm mb-1 leading-relaxed">
                With a passion for creativity and an unwavering commitment to excellence, Esmeralda has made a name for herself in the global fashion industry. She has worked with the world's most prestigious brands and designers, helping to shape and define the industry as we know it today. In addition to her impressive professional accomplishments, Esmeralda is also known for her energetic and dynamic personality, which has endeared her to colleagues and clients alike.
              </p>
              <p className="md:text-sm mb-1 leading-relaxed">
                Esmeralda continues to push the boundaries of fashion and style through her work as the founder and CEO of Moda Week International, a premier fashion event that showcases the latest trends and designs from around the world. Through her leadership and vision, Esmeralda has helped to establish MWINTL as a key player in the industry, and has cemented her reputation as a true innovator and trailblazer in the world of education and fashion.  MWINTL's events celebrate life and convey elegance while also supporting the future of young students in the fashion industry.
              </p>
              <p className="md:text-sm mb-1 leading-relaxed">
                The company believes that fashion design brings art directly to one's skin and shows not only who you are but also the values that make you who you are.  MWINTL delivers trendsetting creations that focus on the present and future of fashion artists today. Through their events and projects, they hope to inspire guests to join them in supporting the education and development of future generations in the fashion and art industries.
              </p>
              <p className="md:text-sm mb-1 leading-relaxed">
                ‘’At Moda Week International, our diverse and extensive experiences around the world allow us to produce iconic events that positively impact communities globally. Our bold mission is to shape many communities around the globe through philanthropic educational projects. God willing, we will continue to make a difference."

              </p>
              <p className="md:text-sm italic">— Karina Fay Hernandez / CEO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white md:px-10 ">
        <div className="w-full p-10 bg-[radial-gradient(circle_at_bottom_right,#C7913E_10%,#C7913E_10%,white_80%)]">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 grad-text">
            OUR PHILOSOPHY
          </h2>

          <div className="flex flex-col md:flex-row items-start gap-12">
            {/* Left Text */}
            <div className="text-gray-800 md:text-sm leading-relaxed space-y-1 flex-1">
              <p>
                Moda Week International (MWINTL) is a distinguished global
                platform that merges the art of fashion with professional
                business acumen, cultural diplomacy, and philanthropic impact.
                Our exclusive events spotlight the latest trends in the fashion
                industry while providing a strategic platform for both emerging
                and established designers to present their collections to an
                international audience.
              </p>

              <p>
                Each production brings together a powerful network of designers,
                buyers, retailers, media partners, and fashion investors,
                fostering elite connections, commercial opportunities, and
                cross-border collaborations. MWINTL is committed to elevating
                the global fashion industry while positioning itself as a
                premier business and creative force.
              </p>

              <p>
                Founded in 2012, Moda Week International operates through key
                global stations, promoting the cultural pulse of various fashion
                capitals while reinforcing commercial growth and industry
                relevance. Our brand is built on a foundation of integrity,
                precision, and economic foresight, dedicated to advancing
                fashion as both an art form and a business.
              </p>

              <p>
                Our commitment extends to community development and the future
                of fashion. Through hands-on experience and platform exposure,
                we support the growth of next generation designers, fashion
                students, and creatives.
              </p>

              <p>
                Join us, where elegance meets enterprise, where fashion becomes
                a catalyst for business opportunities, empowerment and lasting
                legacy.
              </p>
            </div>

            {/* Right Image */}
            <div className="flex justify-center flex-1">
              <img
                src={Founder2}
                alt="Fashion Model"
                className="w-[500px] h-[500px] max-w-full object-cover object-top shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Global Platform Section */}
      <section className="md:py-16 py-10 md:px-10 bg-white">
        <div className="w-full bg-[#f4f4f4] mx-auto px-10 py-6">
          <h2 className="text-2xl md:text-[45px] font-bold text-center mb-6 text-gray-900">
            A GLOBAL PLATFORM FOR VISIONARIES,
            <br />
            CULTURE & INNOVATION
          </h2>
          <p className="text-center text-lg text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed">
            MWINTL is the global platform where visionary leadership, cultural excellence, and industry-shaping innovation converge transforming fashion into a bridge between nations, elevating diverse artistic heritage, and pioneering new models of collaboration, education, and international impact for the future of the industry.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {cardData.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                image={item.image}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />
      <Footer />
    </div>
  );
}
