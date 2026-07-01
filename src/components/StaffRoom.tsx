import React, { useState } from "react";
import { getStorage, setStorage } from "../lib/storage";
import { RoomDef } from "../types";
import { showToast } from "./Toast";

// Managers
import { HeroManager } from "./managers/HeroManager";
import { GalleryManager } from "./managers/GalleryManager";
import { VideoManager } from "./managers/VideoManager";
import { OpenDoorManager } from "./managers/OpenDoorManager";
import { ProgrammesManager } from "./managers/ProgrammesManager";
import { ChannelManager } from "./managers/ChannelManager";
import { ConnectManager } from "./managers/ConnectManager";
import { RoomManager } from "./managers/RoomManager";
import { ThemeManager } from "./managers/ThemeManager";
import { DataManager } from "./managers/DataManager";
import { FirebaseManager } from "./managers/FirebaseManager";

interface StaffRoomProps {
  rooms: RoomDef[];
  setRooms: (rooms: RoomDef[]) => void;
  roomOrder: string[];
  setRoomOrder: (order: string[]) => void;
}

export const StaffRoom = ({
  rooms,
  setRooms,
  roomOrder,
  setRoomOrder,
}: StaffRoomProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = getStorage("staffPassword", "admin123");
    if (passwordInput === storedPass) {
      setIsAuthenticated(true);
      showToast("Logged in to Staff Room", "success");
    } else {
      showToast("Incorrect password", "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-serif text-[var(--gr)] font-bold mb-6">
          ⚙ STAFF ROOM
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gr)]"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[var(--gr)] text-white p-3 rounded-lg font-bold hover:bg-opacity-90"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: "hero", name: "Hero Manager" },
    { id: "gallery", name: "Gallery Manager" },
    { id: "videos", name: "Video Manager" },
    { id: "partners", name: "Open Door Manager" },
    { id: "programmes", name: "Programmes Manager" },
    { id: "channels", name: "Channel Manager" },
    { id: "connect", name: "Front Desk & Escalation" },
    { id: "rooms", name: "Room Manager" },
    { id: "theme", name: "Theme Customizer" },
    { id: "data", name: "Data Manager" },
    { id: "firebase", name: "Firebase Setup" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-serif text-[var(--gr)] font-bold mb-2">
            ⚙ STAFF ROOM
          </h2>
          <p className="text-gray-600">Admin Panel</p>
        </div>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPasswordInput("");
          }}
          className="text-sm text-gray-500 hover:text-gray-800 font-bold"
        >
          Log Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-2 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-3 rounded-lg font-bold text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--gr)] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow bg-white rounded-xl shadow-sm p-6 md:p-8 min-h-[500px]">
          {activeTab === "hero" && <HeroManager />}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "videos" && <VideoManager />}
          {activeTab === "partners" && <OpenDoorManager />}
          {activeTab === "programmes" && <ProgrammesManager />}
          {activeTab === "channels" && <ChannelManager />}
          {activeTab === "connect" && <ConnectManager />}
          {activeTab === "theme" && <ThemeManager />}
          {activeTab === "data" && <DataManager />}
          {activeTab === "firebase" && <FirebaseManager />}
          {activeTab === "rooms" && (
            <RoomManager
              rooms={rooms}
              setRooms={setRooms}
              roomOrder={roomOrder}
              setRoomOrder={setRoomOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
};
