// validators/user.validator.js
const Joi = require("joi");
const mongoose = require("mongoose");
const { roles } = require("../config/roles");

// Joi schema for user creation
const createUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least {#limit} characters",
      "string.max": "Name cannot exceed {#limit} characters",
      "string.pattern.base": "Name contains invalid characters",
    }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),

  password: Joi.string()
    .min(8)
    .max(30)
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least {#limit} characters",
      "string.max": "Password cannot exceed {#limit} characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }),

  role: Joi.string()
    .valid(...roles)
    .required()
    .messages({
      "any.only": "Invalid role specified",
      "string.empty": "Role is required",
    }),

  department: Joi.string().max(50).allow("").optional(),
});

// Joi schema for user update
const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      "string.min": "Name must be at least {#limit} characters",
      "string.max": "Name cannot exceed {#limit} characters",
      "string.pattern.base": "Name contains invalid characters",
    }),

  email: Joi.string().email().messages({
    "string.email": "Please enter a valid email address",
  }),

  role: Joi.string()
    .valid(...roles)
    .messages({
      "any.only": "Invalid role specified",
    }),

  department: Joi.string().max(50).allow(""),
}).min(1); // At least one field required for update

// Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid user ID format",
    });
  }
  next();
};

// Middleware to validate user creation
const validateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));

    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Middleware to validate user update
const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));

    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Middleware to check if email already exists
const checkEmailExists = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next();

  try {
    const existingUser = await mongoose.model("User").findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email already registered",
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware to check if email is being used by another user during update
const checkEmailNotInUse = async (req, res, next) => {
  const { email } = req.body;
  const { id } = req.params;

  if (!email) return next();

  try {
    const existingUser = await mongoose.model("User").findOne({
      email,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email already in use by another user",
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateObjectId,
  checkEmailExists,
  checkEmailNotInUse,
};
