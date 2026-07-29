export const optimizeCloudinaryImage = (url, options = {}) => {
    if (!url || typeof url !== "string") {
        return url;
    }

    const {
        width,
        height,
        crop,
        gravity = "auto",
        quality = "auto",
        format = "auto",
    } = options;

    if (url.includes("/upload/")) {
        const gravitySupportedCrops = new Set([
            "fill",
            "lfill",
            "fill_pad",
            "crop",
            "thumb",
            "auto",
        ]);

        const transformations = [`f_${format}`, `q_${quality}`, "dpr_auto"];

        if (width) transformations.push(`w_${width}`);
        if (height) transformations.push(`h_${height}`);

        if (crop) {
            transformations.push(`c_${crop}`);
        } else if (width || height) {
            transformations.push("c_limit");
        }

        if (gravity && crop && gravitySupportedCrops.has(crop)) {
            transformations.push(`g_${gravity}`);
        }

        return url.replace("/upload/", `/upload/${transformations.join(",")}/`);
    }

    // Fallback for S3 images using a fast, free CDN proxy for dynamic resizing
    if (url.includes("amazonaws.com")) {
        let proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp&q=80`;
        if (width) proxyUrl += `&w=${width}`;
        if (height) proxyUrl += `&h=${height}`;
        if (crop === 'fill') proxyUrl += `&fit=cover`;
        else if (crop === 'limit') proxyUrl += `&fit=inside`;
        
        return proxyUrl;
    }

    return url;
};
