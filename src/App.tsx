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
  const [rooms, setRooms] = useData<RoomDef[]>("roomData", DEFAULT_ROOMS);
  const [roomOrder, setRoomOrder] = useData<string[]>("roomOrder", DEFAULT_ROOMS.map(r => r.slug));
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState("");
  const [themeData] = useData<any>("themeData", null);

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
      setActiveSlug(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Ensure all rooms have a slug for backwards compatibility
  const normalizedRooms = rooms.map(r => ({
    ...r,
    slug: r.slug || (r.id.toString().startsWith('#') ? r.id.toString() : `#${r.id}`)
  }));

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
