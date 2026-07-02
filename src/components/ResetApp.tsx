import React, { useEffect, useState } from "react";
import { getDb, getStorageInstance } from "../lib/firebase";
import { collection, getDocs, writeBatch } from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";
import { showToast } from "./Toast";

export const ResetApp = () => {
  const [status, setStatus] = useState("Starting reset...");

  const doReset = async () => {
    try {
      const db = getDb();
      const storage = getStorageInstance();
      
      if (db) {
        setStatus("Clearing Firebase data (Firestore)...");
        const collections = ["galleryData", "videoData", "partnerData", "programmeData", "channelData", "contactData", "roomData", "singletons"];
        
        for (const col of collections) {
          const snapshot = await getDocs(collection(db, col));
          const batch = writeBatch(db);
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
        }
      }
      
      if (storage) {
        setStatus("Clearing Firebase data (Storage)...");
        const folders = ["logos", "gallery", "partners", "programmes"];
        for (const folder of folders) {
          const folderRef = ref(storage, folder);
          try {
            const listResult = await listAll(folderRef);
            await Promise.all(listResult.items.map(item => deleteObject(item)));
          } catch(e) {
            console.log("Folder might not exist", folder);
          }
        }
      }
      
      setStatus("Clearing localStorage...");
      localStorage.clear();
      
      showToast("✅ All data cleared successfully!", "success");
      setStatus("App is now in clean state. Reloading...");
      
      setTimeout(() => {
        window.location.hash = "";
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setStatus("Error clearing data. See console.");
    }
  };

  useEffect(() => {
    doReset();
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <div className="animate-spin text-4xl mb-4">🔄</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Resetting App...</h2>
      <p className="text-gray-600">{status}</p>
    </div>
  );
};
