
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
    </div>
  );
};
