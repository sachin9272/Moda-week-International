import express from "express";
import jwt from "jsonwebtoken";

const ssoRouter = express.Router();

ssoRouter.get("/", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing SSO token" });
  }

  try {
    const secret = process.env.SSO_SECRET;
    if (!secret) {
      throw new Error("SSO_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret);
    
    // Redirect to the frontend Admin Dashboard
    const frontendAdminUrl = process.env.FRONTEND_ADMIN_URL || "http://localhost:5173/admin";
    
    // We set a cookie here to bypass auth on the frontend
    res.cookie("admin_sso_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    });

    res.redirect(frontendAdminUrl);
  } catch (error) {
    console.error("SSO Error:", error);
    res.status(401).json({ success: false, message: "Invalid SSO token" });
  }
});

export default ssoRouter;
