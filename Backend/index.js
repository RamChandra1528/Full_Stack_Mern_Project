const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/FUll_Stack_DB"; // MongoDB URL
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// User schema and model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("users", userSchema);


app.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
})


app.post("/user/register", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const saltRouts = 10
    const hashpassword = await bcrypt.hash(password, saltRouts);
    // console.log(hashpassword)
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashpassword
    });
    await newUser.save()
    res.status(201).json({ message: "Successfully Registered !" })
  } catch (error) {
    res.status(500).json({ message: "Register action Failed !" })
  }


})
app.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    res.status(200).json({ message: "Login Successful!" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
