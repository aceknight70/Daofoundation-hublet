import { useEffect, useState } from "react";
import { Video } from "../types";
import { getStorage } from "../lib/storage";

export const VideosRoom = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    setVideos(getStorage("videoData", []));
  }, []);

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let videoId = "";
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1);
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    } catch {
      return "";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-[var(--gr)] font-bold mb-2">
          🎬 VIDEOS
        </h2>
        <p className="text-gray-600">Watch our stories</p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <p>No videos added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            >
              <div className="aspect-video bg-gray-100">
                {getEmbedUrl(video.youtubeUrl) ? (
                  <iframe
                    src={getEmbedUrl(video.youtubeUrl)}
                    title={video.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Invalid Video URL
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                <p className="text-gray-600 text-sm">{video.shortCaption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
