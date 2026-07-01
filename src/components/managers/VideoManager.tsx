import { useState } from "react";
import { Video } from "../../types";
import { useData } from "../../lib/useData";

import { showToast } from "../Toast";
import { Trash } from "lucide-react";

export const VideoManager = () => {
  const [videos, setVideos] = useData<Video[]>("videoData", []);

  const save = (newVids: Video[]) => {
    setVideos(newVids);
    
  };

  const addVideo = () => {
    const newVideo: Video = {
      id: Date.now(),
      title: "New Video",
      youtubeUrl: "",
      shortCaption: "",
    };
    save([newVideo, ...videos]);
    showToast("Video added", "success");
  };

  const updateVideo = (id: number, field: keyof Video, value: string) => {
    save(videos.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const deleteVideo = (id: number) => {
    if (confirm("Delete this video?")) {
      save(videos.filter((v) => v.id !== id));
      showToast("Video deleted", "success");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Video Manager</h3>
        <button
          onClick={addVideo}
          className="bg-[var(--gr)] text-white px-4 py-2 rounded font-bold text-sm"
        >
          + Add Video
        </button>
      </div>

      <div className="space-y-4">
        {videos.length === 0 && (
          <p className="text-gray-500 italic">No videos added yet.</p>
        )}
        {videos.map((video) => (
          <div
            key={video.id}
            className="border border-gray-200 rounded-lg p-4 flex gap-4 bg-gray-50"
          >
            <div className="flex-grow space-y-3">
              <input
                type="text"
                value={video.title}
                onChange={(e) => updateVideo(video.id, "title", e.target.value)}
                placeholder="Video Title"
                className="w-full p-2 border rounded font-bold"
              />
              <input
                type="text"
                value={video.youtubeUrl}
                onChange={(e) =>
                  updateVideo(video.id, "youtubeUrl", e.target.value)
                }
                placeholder="YouTube URL"
                className="w-full p-2 border rounded text-sm text-blue-600"
              />
              <input
                type="text"
                value={video.shortCaption}
                onChange={(e) =>
                  updateVideo(video.id, "shortCaption", e.target.value)
                }
                placeholder="Short Caption"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <button
              onClick={() => deleteVideo(video.id)}
              className="text-red-500 hover:bg-red-50 p-2 rounded self-start"
            >
              <Trash size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
