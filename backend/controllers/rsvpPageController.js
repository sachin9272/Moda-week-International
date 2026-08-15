import { deleteS3Asset } from '../utils/s3Helper.js';
import RsvpPage from "../models/rsvpPageModel.js";

const getOrCreateRsvpPage = async () => {
  let page = await RsvpPage.findOne();
  if (!page) {
    page = await RsvpPage.create({});
  }
  return page;
};

const replaceImage = async (page, key, file) => {
  const currentImage = page[key];

  if (currentImage?.publicId) {
    try {
      await deleteS3Asset(currentImage.publicId);
    } catch (error) {
      console.error(`Failed to replace RSVP ${key}:`, error);
    }
  }

  page[key] = {
    url: file.location,
    publicId: file.key,
  };
};

const removeImage = async (page, key) => {
  const currentImage = page[key];

  if (currentImage?.publicId) {
    try {
      await deleteS3Asset(currentImage.publicId);
    } catch (error) {
      console.error(`Failed to delete RSVP ${key}:`, error);
    }
  }

  page[key] = {
    url: "",
    publicId: "",
  };
};

export const getRsvpPage = async (req, res) => {
  try {
    const page = await getOrCreateRsvpPage();
    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching RSVP page:", error);
    res.status(500).json({ message: "Error fetching RSVP page data", error: error.toString() });
  }
};

export const updateRsvpPage = async (req, res) => {
  try {
    const page = await getOrCreateRsvpPage();
    const removeGalaImage = req.body.removeGalaImage === "true";
    const removeSeatingImage = req.body.removeSeatingImage === "true";

    if (removeGalaImage) {
      await removeImage(page, "galaImage");
    }

    if (removeSeatingImage) {
      await removeImage(page, "seatingImage");
    }

    if (req.files?.galaImage?.[0]) {
      await replaceImage(page, "galaImage", req.files.galaImage[0]);
    }

    if (req.files?.seatingImage?.[0]) {
      await replaceImage(page, "seatingImage", req.files.seatingImage[0]);
    }

    const savedPage = await page.save();
    res.status(200).json({ message: "RSVP page updated successfully", page: savedPage });
  } catch (error) {
    console.error("Error updating RSVP page:", error);
    res.status(500).json({ message: "Error updating RSVP page", error: error.toString() });
  }
};
