import React, { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from "moment";
import StoryModel from "./StoryModel";
import StoryViewer from "./StoryViewer";

const StoriesBar = () => {
  const [stories, setStories] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  const fetchStories = async () => {
    setStories(dummyStoriesData);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="flex flex-nowrap gap-4 pb-5">
        {/* Create Story */}
        <div
          onClick={() => setShowModel(true)}
          className="rounded-lg shadow-sm
          w-[120px] h-[160px]
          shrink-0 cursor-pointer
          hover:shadow-lg transition
          border-2 border-dashed border-indigo-300
          bg-gradient-to-b from-indigo-50 to-white"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>

            <p className="text-sm font-medium text-slate-700 text-center">
              Create Story
            </p>
          </div>
        </div>

        {/* Stories */}
        {stories.map((story, index) => (
          <div
            key={index}
            onClick={() => setViewStory(story)}
            className="relative rounded-lg shadow-sm
            w-[120px] h-[160px]
            shrink-0 cursor-pointer
            hover:shadow-lg transition
            bg-gradient-to-b from-indigo-500 to-purple-600"
          >
            {story.media_type !== "text" && (
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                {story.media_type === "image" ? (
                  <img
                    src={story.media_url}
                    className="h-full w-full object-cover opacity-70"
                    alt=""
                  />
                ) : (
                  <video
                    src={story.media_url}
                    className="h-full w-full object-cover opacity-70"
                    autoPlay
                    muted
                    loop
                  />
                )}
              </div>
            )}

            <img
              src={story.user.profile_picture}
              className="absolute size-8 top-3 left-3 rounded-full ring ring-white"
              alt=""
            />

            <p className="absolute bottom-2 right-2 text-xs text-white">
              {moment(story.createdAt).fromNow()}
            </p>
          </div>
        ))}
      </div>

      {showModel && (
        <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />
      )}

      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
};

export default StoriesBar;
