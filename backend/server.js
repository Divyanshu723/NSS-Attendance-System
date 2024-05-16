const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("./models/admin");
const userRoutes = require("./routes/User");
const adminRoutes = require("./routes/Admin");
const eventRoutes = require("./routes/Event");
const connectDatabase = require("./database/conn");


require("dotenv").config();

const CORS_URL = process.env.CORS_URL;
const port = process.env.PORT || 8000;

const moment = require("moment-timezone");
// Assuming you have the necessary imports and setup for the Event model

// Generate a secure secret key
// const secretKey = process.env.secretKey;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ origin: CORS_URL, credentials: true }));

router.get("/checkAuth", async (req, res) => {
  console.log("/checkAuth");

  // Retrieve the token from the Authorization header
  const authorizationHeader = req.headers.authorization;

  const token = authorizationHeader && authorizationHeader.split(" ")[1];
  if (token === "null") {
    return res.json({ success: false, message: "Not Logged In" });
  }
  else {
    const decodedToken = jwt.decode(token);
    const adminType = decodedToken?.adminType;
    const adminEmail = decodedToken?.email;
    const admin = Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res.json({ success: false, message: "User Not found" });
    }
    return res.json({
      success: true,
      adminType: adminType,
      message: "Already Logged In",
    });
  }
});

//Setting up routes
app.use(userRoutes);
app.use(eventRoutes);
app.use(adminRoutes);


app.use(router);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
