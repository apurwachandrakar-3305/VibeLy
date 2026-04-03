import { getAuth } from "@clerk/express";
import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import fs from "fs";
// Get user data from userId
export const getUserData = async (req, res) => {  
  try {
    const { userId } = getAuth(req);
    const user =  await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
//update userdata
export const updateUserData = async (req, res) => {
  try {
    const userId = req.auth();
    const { username, bio, location, full_name } = req.body;
    const tempUser = User.findById(userId);
    if (!tempUser) {
      return res.json({ success: false, message: "User not found" });
    }
    !username && (username = tempUser.username);
    if (tempUser.username !== username) {
      const user = User.findOne({ username });
      if (user) {
        // we will not chnage beacuse it is already taken
        username = tempUser.username;
      }
    }
    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };
    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];
    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: auto },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updatedData.profile_picture = url;
    }
    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: auto },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updatedData.cover_photo = url;
    }
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
// find users using username,email,location,name
export const discoverUsers = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { input } = req.body;
    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });
    const filteredUsers = allUsers.filter((user) => user._id !== userId);
    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
// follow users
export const followUsers = async (req, res) => {
  try {
    const userId = req.auth();
    const { id } = req.body;
    const user = await User.findById(userId);
    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You already following this user",
      });
    }
    user.following.push(id);
    await user.save();
    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();
    res.json({ success: true, message: "Now you are following this user" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
// unfollow the user
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.auth();
    const { id } = req.body;
    const user = await User.findById(userId);
    user.following = user.following.filter((user) => user !== id);
    await user.save();
    const toUser= await User.findById(id);
     toUser.followers=toUser.followers.filter(user=>user!==userId);
      res.json({ success: true, message: "You you are no longer following this user" });
    await toUser.save()
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
