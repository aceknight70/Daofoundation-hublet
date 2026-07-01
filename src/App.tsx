import { useEffect, useState } from "react";
import { CoverPage } from "./components/CoverPage";
import { GalleryRoom } from "./components/GalleryRoom";
import { VideosRoom } from "./components/VideosRoom";
import { PartnerProgrammesRoom } from "./components/PartnerProgrammesRoom";
import { OurProgrammesRoom } from "./components/OurProgrammesRoom";
import { ChannelsRoom } from "./components/ChannelsRoom";
import { ConnectRoom } from "./components/ConnectRoom";
import { StaffRoom } from "./components/StaffRoom";
import { CustomRoom } from "./components/CustomRoom";
import { DEFAULT_ROOMS, getStorage } from "./lib/storage";
import { RoomDef } from "./types";
import { Navigation } from "./components/Navigation";

import { ToastContainer } from "./components/Toast";

export default function App() {
  const [activeSlug, setActiveSlug] = useState<string>(""); // empty means Cover Page
  const [rooms, setRooms] = useState<RoomDef[]>([]);
  const [roomOrder, setRoomOrder] = useState<string[]>([]);

  useEffect(() => {
    // Load theme
    const storedTheme = getStorage<any>("themeData", null);
    if (storedTheme) {
      document.documentElement.style.setProperty("--gr", storedTheme.primary);
      document.documentElement.style.setProperty("--pk", storedTheme.secondary);
      document.documentElement.style.setProperty("--bg", storedTheme.bg);
      document.documentElement.style.setProperty("--text", storedTheme.text);
      document.documentElement.style.setProperty("--outgoing-bg", storedTheme.outgoingBg);
    }

    // Load rooms
    const storedRooms = getStorage<RoomDef[]>("roomData", DEFAULT_ROOMS);
    setRooms(storedRooms);

    const storedOrder = getStorage<string[]>(
      "roomOrder",
      storedRooms.map((r) => r.slug),
    );
    setRoomOrder(storedOrder);

    const handleHashChange = () => {
      setActiveSlug(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const sortedRooms = roomOrder
    .map((slug) => rooms.find((r) => r.slug === slug))
    .filter((r): r is RoomDef => Boolean(r));

  // Add any new rooms that might not be in the order
  rooms.forEach((r) => {
    if (!sortedRooms.find((sr) => sr.slug === r.slug)) {
      sortedRooms.push(r);
    }
  });

  const activeRoom = sortedRooms.find((r) => r.slug === activeSlug);

  const renderActiveRoom = () => {
    if (!activeSlug || activeSlug === "#cover") {
      return <CoverPage />;
    }

    if (!activeRoom) {
      return <div>Room not found</div>;
    }

    switch (activeRoom.slug) {
      case "#gallery":
        return <GalleryRoom />;
      case "#videos":
        return <VideosRoom />;
      case "#partners":
        return <PartnerProgrammesRoom />;
      case "#programmes":
        return <OurProgrammesRoom />;
      case "#channels":
        return <ChannelsRoom />;
      case "#connect":
        return <ConnectRoom />;
      case "#staff":
        return (
          <StaffRoom
            rooms={rooms}
            setRooms={setRooms}
            roomOrder={roomOrder}
            setRoomOrder={setRoomOrder}
          />
        );
      default:
        if (activeRoom.type === "custom") {
          return <CustomRoom room={activeRoom} />;
        }
        return <div>Room under construction</div>;
    }
  };

  const isCoverPage = !activeSlug || activeSlug === "#cover";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans pb-16">
      <ToastContainer />
      {!isCoverPage && (
        <Navigation rooms={sortedRooms} activeSlug={activeSlug} />
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">{renderActiveRoom()}</main>

      {!isCoverPage && (
        <footer className="max-w-4xl mx-auto px-4 py-8 mt-12 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="font-bold">Foundations, FBOs, NGOs & CSS</p>
          <p>Partnership for Goals Hublet</p>
          <p className="mt-2 text-base">
            🌍 SDG 17 — Partnerships for the Goals 🏆
          </p>
          <p className="mt-4 text-xs">Designed by FATAP-CT & ESGMC through the SDGs Learning Lab</p>
        </footer>
      )}
    </div>
  );
}
