import { Inngest } from "inngest";
import connectDB from "../configs/db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "vibely-app" });

/* =========================
   ✅ CREATE USER
========================= */
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      let username = email_addresses[0].email_address.split("@")[0];
      // check availability of username
      const user = await User.findOne({ username });
      if (user) {
        username = username + Math.floor(Math.random() * 10000);
      }
      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        full_name: first_name + " " + last_name,
        profile_picture: image_url,
        username,
      };
      await User.create(userData);
    } catch (error) {}
  },
);

/* =========================
   ✅ UPDATE USER
========================= */
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: { event: "clerk/user.updated" },
  },
  async ({ event }) => {
    try {
      // await connectDB();

      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const updatedUserData = {
        email: email_addresses[0].email_address,
        full_name: first_name + " " + last_name,
        profile_picture: image_url,
      };
      await User.findByIdAndUpdate(id, updatedUserData);
    } catch (error) {
      console.log("ERROR (UPDATE):", error.message);
      throw error;
    }
  },
);

/* =========================
   ✅ DELETE USER
========================= */
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
    triggers: { event: "clerk/user.deleted" },
  },
  async ({ event }) => {
    try {
      // await connectDB();

      const id = event.data.id;

      await User.findByIdAndDelete(id);

      return { success: true };
    } catch (error) {
      console.log("ERROR (DELETE):", error.message);
      throw error;
    }
  },
);

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
