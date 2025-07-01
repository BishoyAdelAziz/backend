const express = require("express");
const swaggerUi = require("swagger-ui-express"); // <-- You need this import
const swaggerSpec = require("./swagger");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const port = 5000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // <-- Place this before app.listen
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => console.log(`Example App listent on port ${port}`));
app.use(cookieParser());
app.use(
  session({
    secret: "your_secret_key", // use a strong secret in production!
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // set to true if using HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day
    },
  })
);
