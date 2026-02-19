import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let otpStore = {};

/* LOGIN */
app.post("/auth/login", (req, res) => {
  res.json({ message: "Login successful (demo)" });
});

/* SIGNUP */
app.post("/auth/signup", (req, res) => {
  res.json({ message: "Account created (demo)" });
});

/* REQUEST OTP */
app.post("/auth/request-otp", (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[req.body.email] = otp;
  console.log("OTP:", otp);
  res.json({ message: "OTP sent" });
});

/* VERIFY OTP */
app.post("/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] == otp) {
    res.json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

/* GOOGLE LOGIN */
app.get("/auth/google", (req, res) => {
  res.send("Integrate Google OAuth here");
});

/* GITHUB LOGIN */
app.get("/auth/github", (req, res) => {
  res.send("Integrate GitHub OAuth here");
});

app.listen(5000, () => console.log("Backend running on 5000"));
