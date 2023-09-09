const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationMail } = require("../utils/sendVerificationEmail");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const keyLengthInBytes = 32; // 32 bytes for AES-256
    const aesKey = crypto.randomBytes(keyLengthInBytes);
    const aesKeyHex = aesKey.toString("hex");

    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json("User with given mail exists!");

    if (!name || !email || !password)
      return res.status(400).json("All fields are required");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be valid");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be strong");

    user = new userModel({
      name,
      email,
      password,
      secureKey: aesKeyHex,
      emailToken: crypto.randomBytes(64).toString("hex"),
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    sendVerificationMail(user);

    const token = createToken(user._id);

    res
      .status(200)
      .json({ _id: user._id, name, email, token, secureKey: user.secureKey });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("invalid email or password");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json("invalid email or password");

    const token = createToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      token,
      secureKey: user.secureKey,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.emailToken;

    if (!emailToken) return res.status(404).json("EmailToken not found");

    const user = await userModel.findOne({ emailToken });

    if (user) {
      user.emailToken = null;
      user.isVerified = true;

      await user.save();

      const token = createToken(user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        isVerified: user?.isVerified,
        secureKey: user.secureKey,
      });
    } else res.status(404).json("Email verification failed, invalid token!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers, verifyEmail };
