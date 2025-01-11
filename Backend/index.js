const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "1274fhsgfntugvndm#$%";
const port = 5000;
const MONGO_URL = "mongodb://127.0.0.1:27017/FUll_Stack_DB";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Middleware
const authToken = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({ error: "Authorization token required" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("users", userSchema);

// Get all users (Protected)
app.get("/", authToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Register a user
app.post("/user/register", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error Registering User" });
  }
});

// Login a user
app.post("/user/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({ token, message: "User Logged In Successfully" });
      } else {
        res.status(401).json({ error: "Invalid Credentials" });
      }
    } else {
      res.status(404).json({ error: "User Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error Logging In User" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
