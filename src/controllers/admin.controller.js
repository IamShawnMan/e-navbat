import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { adminValidator } from "../utils/admin.validation.js";
import { catchError } from "../utils/error-response.js";
import { decode, encode } from "../utils/bcrypt-encrypt.js";
import { successRes } from "../utils/success-response.js";
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
      successRes(res, 201, newAdmin);
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
      successRes(res, 201, newAdmin);
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
  async getAllAdmins(_, res) {
    try {
      const admins = await Admin.find();
      successRes(res, 200, admins);
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

      const payload = { id: admin._id, role: admin.role };
      const accessToken = generateAccessToekn(payload);
      const refreshToken = generateRefreshToekn(payload);

      successRes(res, 200, {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
}
