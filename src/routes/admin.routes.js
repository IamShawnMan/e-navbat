import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { JwtAuthGuard } from "../middlewares/jwt-auth.guard.js";
import { SuperAdminGuard } from "../middlewares/superadmin.guard.js";
import { SelfGuard } from "../middlewares/self-admin.guard.js";

const router = Router();
const controller = new AdminController();

router
  .post("/superadmin", controller.createSuperAdmin)
  .post("/", JwtAuthGuard, SuperAdminGuard, controller.createAdmin)
  .post("/signin", controller.singinAdmin)
  .get("/", SuperAdminGuard, controller.getAllAdmins)
  .get("/:id", SelfGuard, controller.getAdminById)
  .put("/:id", SelfGuard, controller.updateAdminById)
  .delete("/:id", JwtAuthGuard, SuperAdminGuard, controller.deleteAdminById);

export { router as adminRouter };
