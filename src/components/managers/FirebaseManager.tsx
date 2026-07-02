
import React from "react";
import { getFirebaseConfig } from "../../lib/firebase";

export const FirebaseManager = () => {
  const config = getFirebaseConfig();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold mb-2">🔥 Firebase Connection</h3>
        <p className="text-gray-600 text-sm">
          Your hublet is connected to Firebase via AI Studio! All your data and photos are safely stored in the cloud.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h4 className="font-bold mb-4 text-lg text-green-600">✅ Connected</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Project ID</label>
            <div className="text-gray-600 font-mono text-sm">{config?.projectId}</div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Storage Bucket</label>
            <div className="text-gray-600 font-mono text-sm">{config?.storageBucket}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t pt-6 border-red-100">
        <h3 className="text-xl font-bold mb-2 text-red-600">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Completely reset the Firebase connection, clear all cached data, and delete all Firestore/Storage data.
        </p>
        <button 
          onClick={() => {
            if (confirm("Are you SURE you want to clear all data? This cannot be undone!")) {
              window.location.hash = "#reset";
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear All Data & Reset
        </button>
      </div>
    </div>
  );
};
