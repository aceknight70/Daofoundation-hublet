import { useEffect, useState } from "react";
import { ChannelData } from "../types";
import { getStorage } from "../lib/storage";

export const ChannelsRoom = () => {
  const [channels, setChannels] = useState<ChannelData>({
    tiktok: "",
    facebook: "",
    instagram: "",
    youtube: "",
    website: "",
    email: "",
  });

  useEffect(() => {
    setChannels(
      getStorage("channelData", {
        tiktok: "",
        facebook: "",
        instagram: "",
        youtube: "",
        website: "",
        email: "",
      }),
    );
  }, []);

  const links = [
    {
      key: "tiktok",
      label: "TikTok",
      icon: "🎵",
      url: channels.tiktok,
      color: "bg-black text-white",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: "f",
      url: channels.facebook,
      color: "bg-[#1877F2] text-white",
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: "📸",
      url: channels.instagram,
      color:
        "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white",
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: "▶️",
      url: channels.youtube,
      color: "bg-[#FF0000] text-white",
    },
    {
      key: "website",
      label: "Website",
      icon: "🌐",
      url: channels.website,
      color: "bg-[var(--gr)] text-white",
    },
    {
      key: "email",
      label: "Email",
      icon: "📧",
      url: channels.email ? `mailto:${channels.email}` : "",
      color: "bg-gray-600 text-white",
    },
  ];

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif text-[var(--gr)] font-bold mb-2">
          📡 CHANNELS
        </h2>
        <p className="text-gray-600">Connect with us on social media</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {links.map((link) => {
          if (link.url) {
            return (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} rounded-xl p-6 flex flex-col items-center justify-center gap-3 shadow-md hover:-translate-y-1 transition-transform`}
              >
                <span className="text-3xl font-bold">{link.icon}</span>
                <span className="font-bold text-sm">{link.label}</span>
              </a>
            );
          } else {
            return (
              <div
                key={link.key}
                title={`${link.label} link not set`}
                className="bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-3"
              >
                <span className="text-3xl font-bold">{link.icon}</span>
                <span className="font-bold text-sm">{link.label}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
