import express from "express";
import crypto from "crypto";

const masterStatsRouter = express.Router();

masterStatsRouter.get("/", async (req, res) => {
  const apiKey = req.headers["x-master-api-key"] || req.query.apiKey;
  const expectedKey = process.env.MASTER_API_KEY || "super_secret_master_key_123";

  if (!apiKey) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const keyBuf = Buffer.from(String(apiKey));
    const expBuf = Buffer.from(String(expectedKey));
    if (keyBuf.length !== expBuf.length || !crypto.timingSafeEqual(keyBuf, expBuf)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // In a real implementation, query the Moda database here
    const stats = {
      project: "Moda-Week-International",
      totalUsers: 890,
      activeSessions: 112,
      recentRegistrations: 45,
      totalRevenue: 28000,
      status: "healthy",
      lastUpdated: new Date().toISOString()
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default masterStatsRouter;
