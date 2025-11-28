import AboutUsTop from "../../assets/aboutustop.png";
import AboutUs1 from "../../assets/aboutus1.png";
import Founder from "../../assets/founder.png";
import Founder2 from "../../assets/founder2.jpg";
import CtaSection from "../../components/CtaSection";
import Card from "./Card";
import Footer from "../../components/Footer";

export default function ModaWeekSite() {
  const cardData = [
    {
      title: "VISIONARIES",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      description:
        "MWI/NTL paints the future of the fashion industry through our productions. By creating a curated global platform of visionaries, we encourage teams made with pathways for international collaboration, inclusivity, and genuine support — for long-term industry development.",
    },
    {
      title: "CULTURE",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
      description:
        "Fashion as diversity and global-heritage. MWI/NTL is committed to celebrating diverse cultures, Indigenous communities, and international designers under one singular vision. We give platform for cultural expression, art and style—supporting a strong back for global-culture.",
    },
    {
      title: "INNOVATION",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
      description:
        "From sustainable performance in designing best-thinking through technology, AI-led fashion systems, we provide forward-thinking solutions that shape the course of today and the future of the industry.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            WHAT IS MODA WEEK INTERNATIONAL
          </h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            INTERNATIONAL FASHION SHOW PRODUCTION ORGANIZATION WITH THE PURPOSE
            OF CONVERGING FASHION EVENTS, EDUCATION & ADVOCACY SUPPORT.
          </p>
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
      <section className="py-20 px-4 bg-[radial-gradient(circle_at_top_left,_#C7913E_10%,_#C7913E_10%,_white_80%)]">
        <div className="max-w-9xl ">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            {/* <div className="w-[1000px]">
              <img
                src={Founder}
                alt="Founder"
                className="shadow-lg h-[500px] w-[386px] object-cover"
              />
            </div> */}
            <div className="w-full flex justify-center items-end">
              <img
                src={Founder}
                alt="Founder"
                className="shadow-lg w-full max-w-sm object-cover"
              />
            </div>

            <div className="text-gray-800">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 grad-text">
                FOUNDATION
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                "Leading the Way in Fashion and Education" The Chief-Mentor and
                CEO of Moda Week International.
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                Karina Fay Hernandez is the VP and Founder of MODA WEEK
                INTERNATIONAL FASHION / NTL. She is an International Fashion
                Event Producer with over a decade of Fashion Business Management
                and organizational leadership experience in fashion, education
                and philanthropy. Originally from Latvia, she has toured
                multiple continents (Los Clemente, Germany/New and Brazil) -
                Given-Maro a lifelong passion-forward focus.
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                She is the CEO of NTL Fashion Events LLC, her entertainment in
                event-agency made it easy to blend the global fashion market
                innovation, hosting fashion and other cultural industry
                events/conferences, hosting fashion and designer competitions.
                Everyone is a firm believer by "the fashion industry holds a lot
                of world that matter."
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                Believing in the power of education and exposure, she developed
                her MODA WEEK INTERNATIONAL - Fashion Event Company
                International, a premier fashion event that showcases the latest
                trends and designs from around the world. Through her company,
                Karina has gained a reputation for producing flawless, impactful
                runway shows that have set the standard, and the networks she
                has built have transformed her from just producer into a
                respected figure in the fashion/design, education, and cultural
                industry events.
              </p>
              <p className="text-sm italic">— Karina Fay Hernandez / CEO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white px-10 ">
        <div className="w-full p-10 bg-[radial-gradient(circle_at_bottom_right,_#C7913E_10%,_#C7913E_10%,_white_80%)]">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 grad-text">
            OUR PHILOSOPHY
          </h2>

          <div className="flex flex-col md:flex-row items-start gap-12">
            {/* Left Text */}
            <div className="text-gray-800 text-lg leading-relaxed space-y-6 flex-1">
              <p>
                We believe in bringing together a powerful network of designers,
                buyers, stylists, media and more – our fashion platforms,
                headlined with world-leaders, are where opportunities begin. MWI
                uniquely combines networking with live, experience-led
                productions, creating global fashion experiences that stand as a
                premier immersive and creative destination.
              </p>

              <p>
                Each production unites designers, buyers, stylists, and media to
                build opportunities within the fashion ecosystem. Our platforms
                merge creative energy with impactful storytelling to elevate
                industry experiences.
              </p>

              <p>
                Our platform encourages authentic discovery, deep cultural
                contexts, diversity, and industry relevance. We celebrate
                fashion, passion, advocacy, and cultural expression, shaping the
                global narrative for the next generation of fashion consumers.
              </p>

              <p>
                MWI continuously evolves with the future of fashion. Through
                strategic equity partnerships, we support the growth of
                designers, cultural innovators, and enthusiasts shaping
                tomorrow’s global trends.
              </p>
            </div>

            {/* Right Image */}
            <div className="flex justify-center flex-1">
              <img
                src={Founder2}
                alt="Fashion Model"
                className="w-[500px] max-w-full object-cover object-top shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Global Platform Section */}
      <section className="py-20 px-10 bg-white">
        <div className="w-full bg-[#f4f4f4] mx-auto px-10 py-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
            A GLOBAL PLATFORM FOR VISIONARIES,
            <br />
            CULTURE & INNOVATION
          </h2>
          <p className="text-center text-lg text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed">
            MWI/NTL is how global platform, where category leadership, cultural
            excellence, and industry-shaping innovation converge-transforming
            fashion into a bridge between nations, elevating diverse artistic
            heritages, and pioneering new modes of collaboration, education, and
            business impact for the future of the industry.
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
