import Joi from "joi";

export const adminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4).max(20).required(),
    password: Joi.string().required(),
    role: Joi.string().valid("admin", "superadmin").required(),
  });
  return admin.validate(data);
};
