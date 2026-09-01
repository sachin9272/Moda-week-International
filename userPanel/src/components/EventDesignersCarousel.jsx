import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

function DesignerCard({ designer, eventId }) {
  return (
    <div className="group flex flex-col w-[280px] md:w-[320px] shrink-0 overflow-hidden cursor-pointer bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={optimizeCloudinaryImage(designer.image?.url || designer.image, {
            width: 720,
            height: 900,
            crop: "fill",
          })}
          alt={designer.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
        
        {/* Badge */}
        {/* <div className="absolute top-3 left-3 z-10">
          {isFeatured ? (
            <span className="bg-[#B98D4D] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider shadow-sm">
              Featured Designer
            </span>
          ) : (
            <span className="bg-[#0D3B2E] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider shadow-sm">
              International Designer
            </span>
          )}
        </div> */}

        {/* Bottom Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-linear-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
          <h3 className="text-white text-xl md:text-2xl font-serif tracking-wide mb-1.5 uppercase drop-shadow-md">
            {designer.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            {designer.countryCode && (
              <img
                src={`https://flagcdn.com/w20/${designer.countryCode.toLowerCase()}.png`}
                alt={designer.country}
                className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
              />
            )}
            <span className="text-white text-[11px] md:text-xs font-semibold tracking-widest uppercase drop-shadow-sm">
              {designer.country}
            </span>
          </div>
          
          <p className="text-[#B98D4D] text-[10px] md:text-[11px] font-bold tracking-wider uppercase drop-shadow-sm">
            NYCFS 2026 • Participant
          </p>
        </div>
      </div>

      {/* Footer / View Designer Button */}
      <Link 
        to={`/event-details/${eventId}#designer-${designer._id}`}
        className="bg-white py-4 md:py-4.5 flex justify-center items-center gap-2 text-[#0D3B2E] font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-gray-50 transition-colors"
      >
        View Participant <span className="text-lg leading-none">&rarr;</span>
      </Link>
    </div>
  );
}

export default function EventDesignersCarousel({ heading, designers, eventId }) {
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
            <DesignerCard key={key} designer={designer} eventId={eventId} />
          ))}
        </div>
      </div>
    </section>
  );
}
