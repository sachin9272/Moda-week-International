    import express from "express";
    import jwt from "jsonwebtoken";
    import Admin from "../models/adminModel.js";
    
    const ssoRouter = express.Router();
    
    ssoRouter.get("/", async (req, res) => {
      const { token } = req.query;
      const frontendAdminUrl = process.env.FRONTEND_ADMIN_URL || "https://admin.modaweekinternational.com";
    
      if (!token) {
        return res.redirect(`${frontendAdminUrl}/login?error=Missing+SSO+token`);
      }
    
      try {
        const secret = process.env.SSO_SECRET || "super_secret_sso_key_456";
        const decoded = jwt.verify(token, secret);
    
        // Strictly enforce: only users with Super Admin full access can bypass password
        if (decoded.role !== 'Super Admin') {
          console.warn("SSO rejected: user does not have Super Admin role", decoded);
          return res.redirect(`${frontendAdminUrl}/login?error=Super+Admin+access+required`);
        }
    
        // Find or obtain admin in Moda-Week database
        let admin = await Admin.findOne({ email: decoded.email });
        if (!admin) {
          admin = await Admin.findOne({ email: "info@modaweekinternational.com" });
        }
        if (!admin) {
          admin = await Admin.findOne({});
        }
        if (!admin) {
          admin = await Admin.create({
            email: decoded.email || "info@modaweekinternational.com",
            password: Math.random().toString(36).slice(-12) + "A1!",
          });
        }
    
        // Generate valid Moda-Week JWT token for the admin
        const jwtSecret = process.env.JWT_SECRET || "thisisasercedtkeyformodaweekinternationalwhichissercure";
        const modaToken = jwt.sign({ id: admin._id }, jwtSecret, { expiresIn: '30d' });
    
        // Set cookie on domain as additional backup
        res.cookie("admin_sso_token", modaToken, {
          httpOnly: false,
          secure: true,
          domain: ".modaweekinternational.com",
          maxAge: 1000 * 60 * 60 * 24 * 30
        });
    
        // Redirect to frontend Admin Dashboard with credentials
        const redirectUrl = `${frontendAdminUrl}/?sso_token=${modaToken}&email=${encodeURIComponent(admin.email)}&id=${admin._id}`;
        return res.redirect(redirectUrl);
      } catch (error) {
        console.error("SSO Error:", error);
        return res.redirect(`${frontendAdminUrl}/login?error=Invalid+or+expired+SSO+token`);
      }
    });
    
    export default ssoRouter;
