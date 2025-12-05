const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// temp store
const otpStore = {};
const sessions = {};

const OTP_LEN = 6;
const OTP_EXPIRY = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 10 * 60 * 1000;

// generate random otp
function genOtp() {
  return ("" + Math.floor(Math.random() * 1000000)).padStart(OTP_LEN, "0");
}

function makeSalt() {
  return crypto.randomBytes(8).toString("hex");
}

function hash(val) {
  return crypto.createHash("sha256").update(val).digest("hex");
}

// session id
function newSession() {
  return crypto.randomBytes(16).toString("hex");
}

// request otp
app.post("/auth/request-otp", (req, res) => {
  const { identifier } = req.body;

  if (!identifier) {
    return res.status(400).json({ msg: "Identifier is required" });
  }

  const id = identifier.trim().toLowerCase();
  const prev = otpStore[id];

  if (prev && prev.blockTill && prev.blockTill > Date.now()) {
    return res.status(403).json({ msg: "Too many attempts. Try after some time." });
  }

  const otp = genOtp();
  const salt = makeSalt();
  const hashed = hash(otp + salt);

  otpStore[id] = {
    hash: hashed,
    salt,
    expireAt: Date.now() + OTP_EXPIRY,
    tries: 0,
    blockTill: null
  };

  console.log("OTP for", id, ":", otp);

  res.json({ msg: "OTP sent" });
});

// verify
app.post("/auth/verify-otp", (req, res) => {
  const { identifier, otp } = req.body;

  if (!identifier || !otp) {
    return res.status(400).json({ msg: "Missing fields" });
  }

  const id = identifier.toLowerCase();
  const data = otpStore[id];

  if (!data) {
    return res.status(400).json({ msg: "OTP not generated yet" });
  }

  if (data.blockTill && data.blockTill > Date.now()) {
    return res.status(403).json({ msg: "Blocked due to wrong attempts" });
  }

  if (Date.now() > data.expireAt) {
    delete otpStore[id];
    return res.status(400).json({ msg: "OTP expired" });
  }

  const checkHash = hash(otp + data.salt);

  if (checkHash !== data.hash) {
    data.tries += 1;

    if (data.tries >= MAX_ATTEMPTS) {
      data.blockTill = Date.now() + BLOCK_TIME;
      return res.status(403).json({ msg: "Max attempts reached" });
    }

    return res.status(401).json({ msg: "Wrong OTP" });
  }

  // success
  const token = newSession();

  sessions[token] = {
    id,
    time: Date.now()
  };

  delete otpStore[id];

  res.json({ token });
});

// get user
app.get("/auth/me", (req, res) => {
  const auth = req.headers.authorization || "";

  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token" });
  }

  const token = auth.split(" ")[1];
  const user = sessions[token];

  if (!user) {
    return res.status(401).json({ msg: "Invalid/expired token" });
  }

  res.json({ user: { id: user.id } });
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});
