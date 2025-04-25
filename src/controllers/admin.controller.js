import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { adminValidator } from "../utils/admin.validation.js";
import { catchError } from "../utils/error-response.js";
import { decode, encode } from "../utils/bcrypt-encrypt.js";
import { successRes } from "../utils/success-response.js";
import { transporter } from "../utils/mailer.js";
import {
  generateAccessToekn,
  generateRefreshToekn,
} from "../utils/generate-token.js";

export class AdminController {
  async createSuperAdmin(req, res) {
    try {
      const { error, value } = adminValidator(req.body);
      if (error) {
        catchError(res, 400, "Superadmin validation failed");
      }

      const { username, password } = value;
      const superadmin = await Admin.findOne({ role: "superadmin" });
      if (superadmin) {
        catchError(res, 409, "Superadmin already exist");
      }

      const hashedPassword = await decode(password, 7);
      const newAdmin = await Admin.create({
        username,
        hashedPassword,
        role: "superadmin",
      });
      res.status(201).json({
        status: "success",
        message: "Superadmin crested",
        data: newAdmin,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async createAdmin(req, res) {
    try {
      const { error, value } = adminValidator(req.body);
      if (error) {
        catchError(res, 400, "Admin validation failed");
      }

      const { username, password } = value;
      const superadmin = await Admin.findOne({ role: "superadmin" });

      const hashedPassword = await decode(password, 7);
      const newAdmin = await Admin.create({
        username,
        hashedPassword,
        role: "admin",
      });
      res.status(201).json({
        status: "success",
        message: "Superadmin crested",
        data: newAdmin,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async getAllAdmins(_, res) {
    try {
      const admins = await Admin.find();
      res.status(200).json({
        status: "success",
        message: "All admins",
        data: admins,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async getAdminById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);
      if (!admin) {
        catchError(res, 404, "Admin not found");
      }
      successRes(res, 200, admin);
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async updateAdminById(req, res) {
    try {
      const id = req.params.id;
      const admin = await Admin.findById(id);
      if (!admin) {
        catchError(res, 404, "Admin not found");
      }
      const updateAdmin = await Admin.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      successRes(res, 200, updateAdmin);
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async deleteAdminById(req, res) {
    try {
      const id = req.params.id;
      const admin = await Admin.findById(id);
      if (!admin) {
        catchError(res, 404, "Admin not found");
      }
      if (admin.role === "superadmin") {
        catchError(res, 400, "Daaangggg! \n Superadmin can not be deleted!");
      }

      await Admin.findByIdAndDelete(id);
      successRes(res, 200, {});
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async singinAdmin(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        catchError(res, 404, "Admin not found");
      }
      const ismatchPassword = await encode(password, admin.hashedPassword);
      if (!ismatchPassword) {
        catchError(res, 400, "Invalid password");
      }
      const mailMessage = {
        from: process.env.SMTP_USER,
        to: "dilshod7861@gmail.com",
        subject: "Full stack N20",
        text: "Dangggg",
      };
      transporter.sendMail(mailMessage, function (err, info) {
        if (err) {
          catchError(res, 400, `Error on sending mail ${err}`);
        } else {
          console.log(info);
        }
      });
      const payload = { id: admin._id, role: admin.role };
      const accessToken = generateAccessToekn(payload);
      const refreshToken = generateRefreshToekn(payload);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      successRes(res, 200, accessToken);
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async signOutAdmin(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        catchError(res, 401, "Refresh token not found");
      }
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        catchError(res, 401, "Refresh token expired");
      }
      res.clearCookie("refreshToken");
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: {},
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async accessToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        catchError(res, 401, "Refresh token not found");
      }
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        catchError(res, 401, "Refresh token expired");
      }
      const payload = { id: decodedToken.id, role: decodedToken.role };
      const accessToken = generateAccessToekn(payload);
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: accessToken,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
}
