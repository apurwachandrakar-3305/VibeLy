import React, { useEffect, useState } from "react";
import { assets, dummyPostsData } from "./../assets/assets";
import Loading from "./../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="flex justify-center gap-8 py-10 px-6">
      {/* FEED */}
      <div className="w-full max-w-2xl">
        <StoriesBar />

        <div className="mt-6 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-72">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-semibold mb-2">Sponsored</p>

          <img
            src={assets.sponsored_img}
            className="w-full h-40 object-cover rounded-md"
            alt=""
          />

          <p className="mt-2 font-medium">Email marketing</p>

          <p className="text-xs text-gray-500">
            Supercharge your marketing with a powerful platform built for
            results.
          </p>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <RecentMessages></RecentMessages>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
