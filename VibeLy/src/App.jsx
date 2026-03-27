import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Profile from "./pages/Profile";
import { useUser } from "@clerk/clerk-react";
import {Toaster} from 'react-hot-toast'
import Discover from "./pages/Discover";
import CreatePost from "./pages/CreatePost";

const App = () => {
  const { user } = useUser(); // Clerk hook

  return (
    <>
      <Toaster />
      <Routes>
        {/* Root Route */}
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          {/* ✅ Default page after login */}
          <Route index element={<Feed />} />

          {/* ✅ Feed */}
          <Route path="feed" element={<Feed />} />

          {/* ✅ Messages */}
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />

          {/* ✅ Connections */}
          <Route path="connections" element={<Connections />} />

          {/* ✅ Profile */}
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />

          {/* ✅ Create Post */}
          <Route path="create-post" element={<CreatePost />} />
          <Route path="discover" element={<Discover/>} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
