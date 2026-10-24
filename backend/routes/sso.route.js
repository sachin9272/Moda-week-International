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

        const isSuperAdmin = decoded.role === 'Super Admin';
        const permittedProjects = decoded.permittedProjects || [];
        const hasModaAccess = 
          isSuperAdmin || 
          permittedProjects.includes('Moda Week International') || 
          permittedProjects.includes('*');

        if (!hasModaAccess) {
          console.warn("SSO rejected: user does not have Moda Week clearance", decoded);
          return res.redirect(`${frontendAdminUrl}/login?error=Moda+Week+access+is+not+granted`);
        }
    
        const esmeraldaUserId = decoded.userId;
        const normalizedEmail = (decoded.email || "").toLowerCase().trim();

        // 1. Identity resolution
        let admin = null;
        if (esmeraldaUserId) {
          admin = await Admin.findOne({ esmeraldaUserId });
        }

        if (!admin && normalizedEmail) {
          const byEmail = await Admin.findOne({ email: normalizedEmail });
          if (byEmail) {
            admin = byEmail;
          }
        }

        if (admin) {
          if (admin.status === 'Inactive') {
            admin.status = 'Active';
          }

          // Link identity and sync role/permissions
          if (esmeraldaUserId) admin.esmeraldaUserId = esmeraldaUserId;
          admin.role = decoded.role || admin.role;
          admin.permittedProjects = permittedProjects;
          if (decoded.modaPermissions) {
            admin.modaPermissions = decoded.modaPermissions;
          }
          await admin.save();
        } else {
          // Create admin record with linked identity
          admin = await Admin.create({
            esmeraldaUserId,
            email: normalizedEmail || "info@modaweekinternational.com",
            role: decoded.role || 'Admin Access',
            status: 'Active',
            permittedProjects,
            modaPermissions: decoded.modaPermissions || {},
            password: Math.random().toString(36).slice(-12) + "A1!moda",
            source: 'esmeralda_master'
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
