const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Glitci Finance Tracker API",
      version: "1.0.0",
      description: "API documentation for your project",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./routes/*.js"], // Path to your route files for annotation
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
