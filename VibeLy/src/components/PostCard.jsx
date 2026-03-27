import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const [likes] = useState(post.likes_count || []);
  const currentuser = dummyUserData;

  const postWithHashtags = post.content?.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600">$1</span>',
  );
const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full">
      <div  onClick={()=>navigate('/profile/'+post.user._id)} className="flex items-center gap-3">
        <img
          src={post.user.profile_picture}
          className="w-10 h-10 rounded-full"
          alt=""
        />

        <div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>

          <div className="text-xs text-gray-500">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-preline"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {post.image_urls?.length > 0 && (
        <img src={post.image_urls[0]} className="w-full rounded-lg" alt="" />
      )}

      <div className="flex gap-6 text-sm text-gray-600 pt-2 border-t">
        <Heart className="w-4 h-4 cursor-pointer" />
        <MessageCircle className="w-4 h-4 cursor-pointer" />
        <Share2 className="w-4 h-4 cursor-pointer" />
      </div>
    </div>
  );
};

export default PostCard;
