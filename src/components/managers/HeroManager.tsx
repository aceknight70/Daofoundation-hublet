import { useRef } from "react";
import { showToast } from "../Toast";
import { compressImage } from "../../lib/imageUtils";
import { HeroData } from "../../types";
import { useData } from "../../lib/useData";
import { uploadImageToFirebase } from "../../lib/firebase";

export const HeroManager = () => {
  const [data, setData] = useData<HeroData>("heroData", { 
    logo: "", 
    foundationName: "",
    foundationWebsite: "",
    secondLogo: "",
    aboutBtnText: "About This Hublet",
    aboutTitle: "About This Hublet",
    aboutContent: "Welcome to the Partnership for Goals Hublet\n\nThis hublet is a simple, easy-to-share link that serves as a digital storefront for your foundation, FBO, NGO, or CSS organization.\n\nHere you can:\n\n📸 Share your photos and stories (Gallery)\n🎬 Showcase your videos (Videos)\n🤝 Feature partnerships (Partner Programmes)\n📋 Highlight your programmes (Our Programmes)\n📡 Connect to social media (Channels)\n📞 Provide contact info (Connect)\n\nThis initiative comes from the SDGs Learning Lab, encouraging foundations, FBOs, NGOs & CSS to share their work and build partnerships for the Sustainable Development Goals."
  });
  
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const save = (newData: typeof data) => {
    setData(newData);
    showToast("Saved successfully", "success");
  };

  const handleUpload = async (file: File, key: "logo" | "secondLogo") => {
    try {
      const compressed = await compressImage(file);
      const fbUrl = await uploadImageToFirebase(compressed, "logos", `${key}_${Date.now()}`);
      save({ ...data, [key]: fbUrl || compressed });
    } catch {
      showToast("Error uploading image", "error");
    }
  };


  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Hero Manager</h3>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Organization Logo (Top, ~600px)
          </label>
          <div className="flex gap-4 items-start">
            {data.logo && (
              <img src={data.logo} alt="Logo" className="w-48 border rounded" />
            )}
            <div className="space-y-2 flex-grow">
              <button
                onClick={() => fileInputRef1.current?.click()}
                className="bg-gray-100 px-4 py-2 rounded border border-gray-300 text-sm font-bold hover:bg-gray-200"
              >
                Upload Logo
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef1}
                onChange={(e) =>
                  e.target.files?.[0] && handleUpload(e.target.files[0], "logo")
                }
              />
              <div>
                <span className="text-xs text-gray-500">Or use URL:</span>
                <input
                  type="text"
                  value={data.logo}
                  onChange={(e) => save({ ...data, logo: e.target.value })}
                  className="w-full mt-1 p-2 border rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Foundation Name (Between Logos)
          </label>
          <input
            type="text"
            value={data.foundationName}
            onChange={(e) => save({ ...data, foundationName: e.target.value })}
            placeholder="e.g., PHEW Foundation"
            className="w-full p-2 border rounded text-lg font-bold"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Foundation Website
          </label>
          <input
            type="text"
            value={data.foundationWebsite}
            onChange={(e) => save({ ...data, foundationWebsite: e.target.value })}
            placeholder="e.g., phewfoundation.org"
            className="w-full p-2 border rounded text-sm text-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Second Logo (Center)
          </label>
          <div className="flex gap-4 items-start">
            {data.secondLogo && (
              <img
                src={data.secondLogo}
                alt="Second Logo"
                className="w-32 border rounded"
              />
            )}
            <div className="space-y-2 flex-grow">
              <button
                onClick={() => fileInputRef2.current?.click()}
                className="bg-gray-100 px-4 py-2 rounded border border-gray-300 text-sm font-bold hover:bg-gray-200"
              >
                Upload Second Logo
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef2}
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleUpload(e.target.files[0], "secondLogo")
                }
              />
              <div>
                <span className="text-xs text-gray-500">Or use URL:</span>
                <input
                  type="text"
                  value={data.secondLogo}
                  onChange={(e) =>
                    save({ ...data, secondLogo: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            About Button Text
          </label>
          <input
            type="text"
            value={data.aboutBtnText}
            onChange={(e) => save({ ...data, aboutBtnText: e.target.value })}
            placeholder="e.g., About This Hublet"
            className="w-full p-2 border rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            About Title
          </label>
          <input
            type="text"
            value={data.aboutTitle}
            onChange={(e) => save({ ...data, aboutTitle: e.target.value })}
            placeholder="e.g., About This Hublet"
            className="w-full p-2 border rounded text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            About Content
          </label>
          <textarea
            value={data.aboutContent}
            onChange={(e) => save({ ...data, aboutContent: e.target.value })}
            placeholder="Content for the about section..."
            className="w-full p-2 border rounded text-sm h-48"
          />
        </div>
      </div>
    </div>
  );
};
