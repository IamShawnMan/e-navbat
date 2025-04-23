import { catchError } from "../utils/error-response.js";

export const SelfGuard = (req, res, next) => {
  try {
    const user = req?.user;
    if (user || user?.role === "superadmin" || user?.id == req.params.id) {
      next();
    } else {
      res.status(403).json({
        statusCode: 403,
        message: "Forbidden user",
      });
    }
  } catch (error) {
    catchError(error, res);
  }
};
