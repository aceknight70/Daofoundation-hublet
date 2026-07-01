import React, { useState, useEffect } from "react";
import { useData } from "../../lib/useData";
import { getStorage, setStorage } from "../../lib/storage";
import { showToast } from "../Toast";
import { initFirebase } from "../../lib/firebase";

export const FirebaseManager = () => {
  const [config, setConfig] = useState({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  });

  useEffect(() => {
    const savedConfig = getStorage("firebaseConfig", null);
    if (savedConfig) {
      setConfig(savedConfig);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setStorage("firebaseConfig", config);
    showToast("Firebase Config Saved", "success");
  };

  const handleConnect = () => {
    setStorage("firebaseConfig", config);
    const app = initFirebase();
    if (app) {
      showToast("Connected to Firebase! ✅", "success");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showToast("Failed to connect. Check keys.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold mb-2">🔥 Firebase Setup</h3>
        <p className="text-gray-600 text-sm">
          Connect your hublet to Firebase to enable cloud storage. This ensures all photos and data are saved permanently and appear on all devices.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.keys(config).map((key) => (
          <div key={key}>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {key}
            </label>
            <input
              type="text"
              name={key}
              value={config[key as keyof typeof config]}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm"
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSave}
          className="bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Save Config
        </button>
        <button
          onClick={handleConnect}
          className="bg-[var(--gr)] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Connect & Reload
        </button>
      </div>
    </div>
  );
};
