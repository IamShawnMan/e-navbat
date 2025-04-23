import Joi from "joi";

export const adminValidator = async (data) => {
  try {
    const admin = Joi.object({
      username: Joi.string().min(4).max(20).required(),
      password: Joi.string().required(),
      role: Joi.string().valid("admin", "superadmin").required(),
    });
    return admin.validate(data);
  } catch (error) {
    console.log(`Error on validate admin ${error.message}`);
  }
};
