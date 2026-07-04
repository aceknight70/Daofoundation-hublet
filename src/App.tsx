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
import { getFirebaseConfig, initFirebase, migrateLocalStorageToFirebase } from "./lib/firebase";

import { useData } from "./lib/useData";

import { ResetApp } from "./components/ResetApp";
import { ToastContainer, showToast } from "./components/Toast";

export default function App() {
  const [activeSlug, setActiveSlug] = useState<string>(""); // empty means Cover Page
  const [isSwitchingRoom, setIsSwitchingRoom] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [rooms, setRooms] = useData<RoomDef[]>("roomData", DEFAULT_ROOMS);
  const [roomOrder, setRoomOrder] = useData<string[]>("roomOrder", DEFAULT_ROOMS.map(r => r.slug));
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState("");
  const [themeData] = useData<any>("themeData", null);

  useEffect(() => {
    // Show initial loader for at least 2.5 seconds
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const config = getFirebaseConfig();
    if (config && !localStorage.getItem("firebaseMigrated")) {
      initFirebase();
      setMigrating(true);
      migrateLocalStorageToFirebase(setMigrationStatus).then((success) => {
        if (success) {
          showToast("Data migrated to Firebase! ✅", "success");
        }
        setMigrating(false);
      });
    } else if (config) {
      initFirebase();
    }
  }, []);

  useEffect(() => {
    // Load theme
    if (themeData) {
      document.documentElement.style.setProperty("--gr", themeData.primary);
      document.documentElement.style.setProperty("--pk", themeData.secondary);
      document.documentElement.style.setProperty("--bg", themeData.bg);
      document.documentElement.style.setProperty("--text", themeData.text);
      document.documentElement.style.setProperty("--outgoing-bg", themeData.outgoingBg);
    }
  }, [themeData]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash !== activeSlug) {
        setIsSwitchingRoom(true);
        setActiveSlug(window.location.hash);
        setTimeout(() => {
          setIsSwitchingRoom(false);
        }, 1500); // brief spinner for room switch
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Initial call without setting isSwitchingRoom (handled by initialLoading)
    setActiveSlug(window.location.hash);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [activeSlug]);

  // Ensure all rooms have a slug for backwards compatibility
  const normalizedRooms = rooms.map(r => ({
    ...r,
    slug: r.slug || (r.id.toString().startsWith('#') ? r.id.toString() : `#${r.id}`)
  }));

  // Guarantee all system rooms exist
  DEFAULT_ROOMS.forEach(dr => {
    if (!normalizedRooms.find(r => r.id === dr.id)) {
      normalizedRooms.push(dr);
    }
  });

  const sortedRooms = roomOrder
    .map((slug) => normalizedRooms.find((r) => r.slug === slug))
    .filter((r): r is RoomDef => Boolean(r));

  // Add any new rooms that might not be in the order
  normalizedRooms.forEach((r) => {
    if (!sortedRooms.find((sr) => sr.slug === r.slug)) {
      sortedRooms.push(r);
    }
  });

  const activeRoom = sortedRooms.find((r) => r.slug === activeSlug);

  const renderActiveRoom = () => {
    if (activeSlug === "#reset") {
      return <ResetApp />;
    }

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
            rooms={normalizedRooms}
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center flex-grow text-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--gr)] rounded-full animate-spin mb-6 drop-shadow-md"></div>
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-500 mb-8 text-lg">Please wait</p>
          <p className="text-sm text-gray-400">⏳ This may take a few seconds on mobile</p>
        </div>
        
        <footer className="w-full max-w-md border-t border-gray-200 pt-6 text-center text-sm text-gray-500 mb-8 animate-fade-in">
          <p className="font-bold mb-1">Partnership for Goals Hublet</p>
          <p className="text-xs">Designed by FATAP-CT & ESGMC through the SDGs Learning Lab</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans pb-16">
      <ToastContainer />
      {migrating && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🔄</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Migrating Data...</h2>
            <p className="text-gray-600">{migrationStatus}</p>
          </div>
        </div>
      )}
      {!getFirebaseConfig() && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm font-bold shadow-sm z-50 relative">
          Connect to Firebase for cloud storage (go to Staff Room)
        </div>
      )}
      {!isCoverPage && (
        <Navigation rooms={sortedRooms} activeSlug={activeSlug} />
      )}

      <main className="max-w-4xl mx-auto px-4 py-8 relative min-h-[50vh]">
        {isSwitchingRoom ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg)]/80 z-10 animate-fade-in">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--gr)] rounded-full animate-spin mb-4 drop-shadow"></div>
            <p className="text-gray-500 font-medium">Loading...</p>
          </div>
        ) : null}
        <div className={isSwitchingRoom ? "opacity-50" : "opacity-100 transition-opacity duration-300"}>
          {renderActiveRoom()}
        </div>
      </main>

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
