import { useEffect, useRef, useState } from "react";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

function DesignerCard({ designer }) {
  return (
    <div className="group relative h-[300px] md:h-[400px] w-[220px] md:w-[280px] shrink-0 overflow-hidden cursor-default">
      <img
        src={optimizeCloudinaryImage(designer.image?.url || designer.image, {
          width: 720,
          height: 960,
          crop: "fill",
        })}
        alt={designer.name}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-center items-center gap-3 bg-black/60 backdrop-blur-xs h-auto min-h-[4rem] transition-all duration-300">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <h3 className="text-white text-sm font-bold tracking-widest uppercase text-center">
            {designer.name}
          </h3>
          {designer.countryCode && (
            <img
              src={`https://flagcdn.com/w20/${designer.countryCode.toLowerCase()}.png`}
              alt={designer.country}
              className="w-6 h-auto"
            />
          )}
        </div>

        <div className="flex items-center gap-4 mt-1">
          {designer.instagram && (
            <a
              href={designer.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#C7913E] transition-colors"
              title="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          )}
          {designer.website && (
            <a
              href={designer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#C7913E] transition-colors"
              title="Website"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventDesignersCarousel({ heading, designers }) {
  const scrollRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const canLoop = designers.length > 1;
  // Repeat the list enough times so the track is always wider than the
  // viewport (otherwise there's nothing to scroll on wide screens), while
  // keeping each "set" identical so the loop-reset below is seamless.
  const repeatCount = canLoop ? Math.max(2, Math.ceil(12 / designers.length)) : 1;
  const trackDesigners = canLoop
    ? Array.from({ length: repeatCount }, (_, setIndex) =>
        designers.map((designer) => ({ designer, key: `${setIndex}-${designer._id}` }))
      ).flat()
    : designers.map((designer) => ({ designer, key: designer._id }));

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !canLoop) return;

    let animationFrameId;
    const scrollSpeed = 1;

    const scroll = () => {
      if (!isInteracting && scrollContainer) {
        const setWidth = scrollContainer.scrollWidth / repeatCount;
        if (scrollContainer.scrollLeft >= setWidth) {
          scrollContainer.scrollLeft -= setWidth;
        } else {
          scrollContainer.scrollLeft += scrollSpeed;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting, canLoop, repeatCount, designers]);

  if (!designers || designers.length === 0) return null;

  return (
    <section className="bg-white py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-l from-[#8C5D25] to-[#C7913E] bg-clip-text text-transparent uppercase">
            {heading}
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollBehavior: "auto" }}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={() => setIsInteracting(false)}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
        >
          {trackDesigners.map(({ designer, key }) => (
            <DesignerCard key={key} designer={designer} />
          ))}
        </div>
      </div>
    </section>
  );
}
