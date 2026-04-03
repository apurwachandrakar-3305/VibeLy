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
    triggers: { event: "clerk/user.created" },
  },
  async ({ event }) => {
    await connectDB(); // 🔥 IMPORTANT

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    // Prevent duplicate
    const existing = await User.findById(id);
    if (existing) return;

    let username = email_addresses[0].email_address.split("@")[0];

    const check = await User.findOne({ username });
    if (check) {
      username = username + Math.floor(Math.random() * 1000);
    }

    await User.create({
      _id: id, // using Clerk ID as Mongo _id
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    });

    return { success: true };
  }
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
    await connectDB(); // 🔥 IMPORTANT

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    });

    return { success: true };
  }
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
    await connectDB(); // 🔥 IMPORTANT

    const { id } = event.data;

    await User.findByIdAndDelete(id);

    return { success: true };
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];