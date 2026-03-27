import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from './../components/PostCard';
import moment from "moment";
import ProfileModel from "../components/ProfileModel";
const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* profile card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* cover photo */}
          <div className="h-40 md:h-56 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                className="w-full h-full object-cover"
                alt=""
              />
            )}
          </div>
          {/* User Info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>
        {/* TAbs */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1 w-100 justify-between">
            {["posts", "media", "likes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Posts */}
        {activeTab === "posts" && (
          <div className="mt-6 flex flex-col items-center gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
        {/* Media */}
        {activeTab === "media" && (
          <div className="flex flex-wrap mt-6 max-w-6xl">
            {posts
              .filter((post) => post.image_urls.length > 0)
              .map((post) => (
                <>
                  {post.image_urls.map((image, index) => (
                    <Link
                      target="_blank"
                      to={image}
                      key={index}
                      className="relative group"
                    >
                      <img
                        src={image}
                        key={index}
                        alt=""
                        className="w-64 aspect-video object-cover"
                      />
                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                        Posted{moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))}
                </>
              ))}
          </div>
        )}
      </div>
      {/* Edit profile  */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit}/>}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
