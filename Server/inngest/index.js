 import { Inngest } from "inngest";
import connectDB from "../configs/db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "vibely-app" });
console.log("🔥 FUNCTION STARTED");
/* =========================
   ✅ CREATE USER
========================= */
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: { event: "clerk/user.created" },
  },
  async ({ event }) => {
    try {
      console.log("STEP 1: Function started");

      await connectDB();
      console.log("🔥 FUNCTION STARTED");
      console.log("STEP 2: DB connected");

      const data = event.data;

      if (!data) throw new Error("No event data");

      const id = data.id;
      const email = data.email_addresses?.[0]?.email_address;

      if (!email) throw new Error("Email not found");

      console.log("STEP 3: Data extracted");

      // Prevent duplicate
      const existing = await User.findById(id);
      if (existing) {
        console.log("User already exists");
        return { success: true };
      }

      let username = email.split("@")[0];

      const check = await User.findOne({ username });
      if (check) {
        username = username + Math.floor(Math.random() * 1000);
      }

      await User.create({
        _id: id,
        email,
        full_name: `${data.first_name || ""} ${data.last_name || ""}`,
        profile_picture: data.image_url,
        username,
      });

      console.log("STEP 4: User created");

      return { success: true };

    } catch (error) {
      console.log("ERROR (CREATE):", error.message);
      throw error;
    }
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
    try {
      await connectDB();

      const data = event.data;

      await User.findByIdAndUpdate(data.id, {
        email: data.email_addresses?.[0]?.email_address,
        full_name: `${data.first_name || ""} ${data.last_name || ""}`,
        profile_picture: data.image_url,
      });

      console.log("User updated");

      return { success: true };

    } catch (error) {
      console.log("ERROR (UPDATE):", error.message);
      throw error;
    }
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
    try {
      await connectDB();

      const id = event.data.id;

      await User.findByIdAndDelete(id);

      console.log("User deleted");

      return { success: true };

    } catch (error) {
      console.log("ERROR (DELETE):", error.message);
      throw error;
    }
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];