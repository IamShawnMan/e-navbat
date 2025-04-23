import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { adminValidator } from "../utils/admin.validation.js";
import { catchError } from "../utils/error-response.js";
import { decode, encode } from "../utils/bcrypt-encrypt.js";
import {
  generateAccessToekn,
  generateRefreshToekn,
} from "../utils/generate-token.js";

export class AdminController {
  async createSuperAdmin(req, res) {
    try {
      const { error, value } = adminValidator(req.body);
      if (error) {
        throw new Error(`error on creating superadmin: ${error}`);
      }

      const { username, password } = value;
      const superadmin = await Admin.findOne({ role: "superadmin" });
      if (superadmin) {
        return res.status(409).json({
          statusCode: 409,
          message: "Super admin already exist",
        });
      }

      const hashedPassword = await decode(password, 7);
      const newAdmin = await Admin.create({
        username,
        hashedPassword,
        role: "superadmin",
      });
      return res.status(201).json({
        statusCode: 201,
        message: "success",
        data: newAdmin,
      });
    } catch (error) {
      catchError(error, res);
    }
  }
  async createAdmin(req, res) {
    try {
      // console.log(req.body);

      const { error, value } = adminValidator(req.body);
      if (error) {
        throw new Error(`error on creating admin: ${error}`);
      }

      const { username, password } = value;
      const superadmin = await Admin.findOne({ role: "superadmin" });

      const hashedPassword = await decode(password, 7);
      const newAdmin = await Admin.create({
        username,
        hashedPassword,
        role: "admin",
      });
      return res.status(201).json({
        statusCode: 201,
        message: "success",
        data: newAdmin,
      });
    } catch (error) {
      catchError(error, res);
    }
  }
  async getAllAdmins(req, res) {
    try {
      const admins = await Admin.find();
      return res.status(200).json({
        statusCode: 200,
        message: `succes`,
        data: admins,
      });
    } catch (error) {
      catchError(error, res);
    }
  }
  async getAdminById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);
      if (!admin) {
        throw new Error(`admin not found`);
      }
      return res.status(200).json({
        statusCode: 200,
        message: `succes`,
        data: admin,
      });
    } catch (error) {
      catchError(error, res);
    }
  }
  async updateAdminById(req, res) {
    try {
      const id = req.params.id;
      const admin = await Admin.findById(id);
      if (!admin) {
        throw new Error(`admin not found`);
      }
      const updateAdmin = await Admin.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({
        statusCode: 200,
        message: `succes`,
        data: updateAdmin,
      });
    } catch (error) {
      catchError(error, res);
    }
  }
  async deleteAdminById(req, res) {
    try {
      const id = req.params.id;
      const admin = await Admin.findById(id);
      if (!admin) {
        throw new Error(`admin not found`);
      }
      if (admin.role === "superadmin") {
        return res.status(400).json({
          statusCode: 400,
          message: "Daanggggg",
        });
      }

      await Admin.findByIdAndDelete(id);
      return res.status(200).json({
        statusCode: 200,
        message: `succes`,
        data: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  }
  async singinAdmin(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        throw new Error(`admin not found`);
      }
      const ismatchPassword = await encode(password, admin.hashedPassword);
      if (!ismatchPassword) {
        throw new Error(`invalid password`);
      }

      const payload = { id: admin._id, role: admin.role };
      const accessToken = generateAccessToekn(payload);
      const refreshToken = generateRefreshToekn(payload);

      return res.status(200).json({
        statusCode: 200,
        message: `succes`,
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  }
}
