import React, { useState } from "react";

const ProgressiveImage = ({
    src,
    alt,
    wrapperClassName = "",
    imgClassName = "",
    skeletonClassName = "",
    ...imgProps
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${wrapperClassName}`}>
            {!loaded && (
                <div
                    className={`absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 ${skeletonClassName}`}
                    aria-hidden="true"
                />
            )}
            <img
                src={src}
                alt={alt}
                className={`${imgClassName} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                {...imgProps}
            />
        </div>
    );
};

export default ProgressiveImage;
