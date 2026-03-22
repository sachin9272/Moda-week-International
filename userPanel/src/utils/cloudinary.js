export const optimizeCloudinaryImage = (url, options = {}) => {
    if (!url || typeof url !== "string" || !url.includes("/upload/")) {
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
};
