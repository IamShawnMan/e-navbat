import { Admin } from "../models/admin.model.js";
import { adminValidator } from "../utils/admin.validation.js";
import { catchError } from "../utils/error-response.js";

export class AdminController {
  async createAdmin(req, res) {
    try {
      const { error, value } = await adminValidator(req.body);
      if (error) {
        throw new Error("Admin malumotlari xato kiritildi");
      }
      const newAdmin = await Admin.create(value);

      return res.status(201).json({
        statusCode: 201,
        message: "Admin created successfully",
        data: {
          newAdmin,
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  }
}
