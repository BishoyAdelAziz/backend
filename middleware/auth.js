const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const NODE_ENV = process.env.NODE_ENV || "development";

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // 1) Check multiple token sources (Header, Cookie)
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Authentication required. Please log in.",
      });
    }

    // 2) Verify token with additional checks
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"], // Specify allowed algorithm
      ignoreExpiration: false, // Explicitly check expiration
    });

    // 3) Check if user exists and is active
    const currentUser = await User.findById(decoded.id).select("+active");
    if (!currentUser || !currentUser.active) {
      return res.status(401).json({
        status: "fail",
        message: "Account not found or deactivated.",
      });
    }

    // 4) Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "Password changed recently. Please log in again.",
      });
    }

    // 5) Attach user to request and proceed
    req.user = currentUser;
    next();
  } catch (err) {
    // Differentiate between different JWT errors
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : err.name === "JsonWebTokenError"
        ? "Invalid authentication token."
        : "Authentication failed. Please log in.";

    return res.status(401).json({
      status: "fail",
      message,
      ...(NODE_ENV === "development" && { stack: err.stack }),
    });
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        status: "fail",
        message: "User authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: `Access restricted to: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

// Token generation with enhanced options
const signToken = (id, additionalPayload = {}) => {
  return jwt.sign({ id, ...additionalPayload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
    issuer: "your-app-name",
  });
};

// Cookie-based authentication for web apps
const setAuthCookie = (res, token) => {
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

module.exports = {
  authenticate,
  authorize,
  signToken,
  setAuthCookie,
};
