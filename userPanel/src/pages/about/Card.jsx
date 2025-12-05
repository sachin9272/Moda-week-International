import React from "react";

const Card = ({ image, title, description }) => {
  return (
    <div className="overflow-hidden bg-white">
      <div className="relative group">
        <img
          src={image}
          alt={title}
          className="w-full h-96 object-cover"
        />

        {/* Title overlay on image */}
        <div className="absolute inset-0 bg-black/40 flex items-end p-6">
          <h3 className="text-3xl font-bold text-white">{title}</h3>
        </div>
      </div>

      {/* Description below image */}
      <p className="text-sm leading-relaxed mt-4 text-black p-4">
        {description}
      </p>
    </div>
  );
};

export default Card;
