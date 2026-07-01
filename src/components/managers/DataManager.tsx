import React, { useState, useEffect } from "react";
import { getStorage } from "../../lib/storage";
import { showToast } from "../Toast";

export const DataManager = () => {
  const [summary, setSummary] = useState({
    gallery: 0,
    partners: 0,
    programmes: 0,
    videos: 0,
    channels: 0,
    contacts: 0,
    theme: "Default",
  });

  useEffect(() => {
    updateSummary();
  }, []);

  const updateSummary = () => {
    setSummary({
      gallery: getStorage("galleryData", []).length,
      partners: getStorage("partnerData", []).length,
      programmes: getStorage("programmeData", []).length,
      videos: getStorage("videoData", []).length,
      channels: getStorage("channelData", []).filter((c: any) => c.url).length,
      contacts: getStorage("contactData", []).length,
      theme: getStorage("themeData", null) ? "Custom" : "Default",
    });
  };

  const handleExport = () => {
    try {
      const allData = {
        heroData: getStorage("heroData", {}),
        galleryData: getStorage("galleryData", []),
        videoData: getStorage("videoData", []),
        partnerData: getStorage("partnerData", []),
        programmeData: getStorage("programmeData", []),
        channelData: getStorage("channelData", []),
        contactData: getStorage("contactData", []),
        roomData: getStorage("roomData", []),
        roomOrder: getStorage("roomOrder", []),
        themeData: getStorage("themeData", null),
        staffPassword: getStorage("staffPassword", "admin123"),
      };

      const dataStr = JSON.stringify(allData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `hublet-backup-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
      
      showToast("Data exported successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to export data", "error");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Restore all valid keys
        const keys = [
          "heroData",
          "galleryData",
          "videoData",
          "partnerData",
          "programmeData",
          "channelData",
          "contactData",
          "roomData",
          "roomOrder",
          "themeData",
          "staffPassword"
        ];

        for (const key of keys) {
          if (json[key] !== undefined) {
            localStorage.setItem(key, JSON.stringify(json[key]));
          }
        }

        showToast("Data restored successfully! ✅", "success");
        updateSummary();
        
        // Reload page to apply all changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error(err);
        showToast("Failed to import data. Invalid JSON file.", "error");
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (e.target) {
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold mb-2">💾 Data Manager</h3>
        <p className="text-gray-600 text-sm">
          Backup your entire hublet, including all photos, text, and settings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h4 className="font-bold mb-4 text-lg">Export Data</h4>
          <p className="text-sm text-gray-600 mb-6">
            Download a complete backup of your hublet. This JSON file contains all images, text, links, and settings. Keep it safe or share it to transfer your hublet.
          </p>
          <button
            onClick={handleExport}
            className="w-full bg-[var(--gr)] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
          >
            <span>⬇️</span> Export Backup JSON
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h4 className="font-bold mb-4 text-lg">Import Data</h4>
          <p className="text-sm text-gray-600 mb-6">
            Restore your hublet from a backup JSON file. <strong>Warning:</strong> This will overwrite all your current data and settings instantly.
          </p>
          <label className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer flex items-center justify-center gap-2">
            <span>⬆️</span> Upload JSON File
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h4 className="font-bold mb-4 text-lg border-b pb-2">Current Data Summary</h4>
        <ul className="grid grid-cols-2 gap-y-3 text-sm">
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-600">Gallery Photos:</span>
            <span className="font-bold">{summary.gallery}</span>
          </li>
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-600">Partner Cards:</span>
            <span className="font-bold">{summary.partners}</span>
          </li>
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-600">Programme Cards:</span>
            <span className="font-bold">{summary.programmes}</span>
          </li>
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-600">Videos:</span>
            <span className="font-bold">{summary.videos}</span>
          </li>
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-600">Channels:</span>
            <span className="font-bold">{summary.channels} links</span>
          </li>
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-600">Contact Cards:</span>
            <span className="font-bold">{summary.contacts}</span>
          </li>
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-600">Theme:</span>
            <span className="font-bold">{summary.theme}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
