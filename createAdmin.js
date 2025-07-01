const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  // Delete any existing admin with the specified email
  await User.deleteOne({ email: "fares.elsawy90@gmail.com" });

  const hashedPassword = await bcrypt.hash("Fares01127887720", 10);

  const admin = await User.create({
    name: "Fares El Sawy",
    email: "fares.elsawy90@gmail.com",
    password: hashedPassword,
    role: "admin",
    firstLogin: true,
  });
  console.log("Admin created:", admin.email);
  mongoose.disconnect();
}
createAdmin();
