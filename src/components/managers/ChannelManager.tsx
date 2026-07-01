import { useEffect, useState } from "react";
import { ChannelData } from "../../types";
import { getStorage, setStorage } from "../../lib/storage";
import { showToast } from "../Toast";

export const ChannelManager = () => {
  const [data, setData] = useState<ChannelData>({
    tiktok: "",
    facebook: "",
    instagram: "",
    youtube: "",
    website: "",
    email: "",
  });

  useEffect(() => {
    setData(
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

  const save = (newData: ChannelData) => {
    setData(newData);
    setStorage("channelData", newData);
    showToast("Channels saved", "success");
  };

  const handleChange = (field: keyof ChannelData, value: string) => {
    save({ ...data, [field]: value });
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Channel Manager</h3>
      <div className="space-y-4 max-w-lg">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700 capitalize">
              {key}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                handleChange(key as keyof ChannelData, e.target.value)
              }
              placeholder={`Enter ${key} ${key === "email" ? "address" : "URL"}`}
              className="p-2 border rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
