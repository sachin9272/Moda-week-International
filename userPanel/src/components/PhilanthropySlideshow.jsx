import React, { useEffect, useRef, useState } from "react";

// Import images
import img1 from "../assets/Events-1.jpg";
import img2 from "../assets/Events-2.jpg";
import img3 from "../assets/Events-3.jpg";
import img4 from "../assets/Events-4.jpg";
import img5 from "../assets/Events-5.jpg";

const images = [img1, img2, img3, img4, img5];

const PhilanthropySlideshow = ({ images = [] }) => {
    const scrollRef = useRef(null);
    const [isInteracting, setIsInteracting] = useState(false);

    // Use dynamic images (extract URLs) or fallback
    const displayImages = images && images.length > 0
        ? images.map(img => img.url)
        : [img1, img2, img3, img4, img5];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId;
        const scrollSpeed = 1; // Adjust speed as needed

        const scroll = () => {
            if (!isInteracting && scrollContainer) {
                // If scrolled past half (where the duplicate set starts), reset to 0
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isInteracting, displayImages]); // Re-run if images change

    if (!displayImages || displayImages.length === 0) return null;

    return (
        <div className="py-0 bg-white">
            <div
                className="w-full relative group"
                onTouchStart={() => setIsInteracting(true)}
                onTouchEnd={() => setIsInteracting(false)}
            >
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-[10px] pb-0 no-scrollbar px-0"
                    style={{
                        scrollBehavior: 'auto',
                        scrollbarWidth: 'none',  // Firefox
                        msOverflowStyle: 'none'  // IE/Edge
                    }}
                >
                    {/* Hide scrollbar for Webkit */}
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {/* Original list */}
                    {displayImages.map((img, i) => (
                        <div key={`orig-${i}`} className="h-[300px] md:h-[450px] w-auto relative shrink-0">
                            <img
                                src={img}
                                alt={`Philanthropy Event ${i + 1}`}
                                className="w-full h-full object-cover select-none transition-opacity duration-300 hover:opacity-90"
                                draggable="false"
                            />
                        </div>
                    ))}

                    {/* Duplicate list for infinite scroll */}
                    {displayImages.map((img, i) => (
                        <div key={`dup-${i}`} className="h-[300px] md:h-[450px] w-auto relative shrink-0">
                            <img
                                src={img}
                                alt={`Philanthropy Event Duplicate ${i + 1}`}
                                className="w-full h-full object-cover select-none transition-opacity duration-300 hover:opacity-90"
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PhilanthropySlideshow;
