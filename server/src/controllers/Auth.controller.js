import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";

///////////user registration ///////////////
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already exists, please login" });

    //hash password
    const hashedPassword = bcrypt.hash(password, 10);
    const newUser = await User.createOne({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
};

///////////user login ///////////////
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //check if user exists
    const existingUser = await User.findOne({ username });
    if (!existingUser)
      return res
        .status(400)
        .json({ message: "User does not exist, please register" });

    //compare passwords
    bcrypt.compare(password, existingUser.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });
    });

    const accessToken = createAccessToken({ id: existingUser._id });
    const refreshToken = createRefreshToken({ id: existingUser._id });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "User logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
};

//////////get user ////////////////
export const getUser = async (req, res) => {
  try {
    const { username } = req.body;

    const existingUser = await User.findOne({ username }, "-password");
    if (!existingUser)
      return res.status(400).json({ message: "User does not exist" });

    res.status(200).json({ existingUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
};
