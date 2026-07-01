import { useRef, useState } from "react";
import { Partner } from "../../types";
import { useData } from "../../lib/useData";

import { compressImage } from "../../lib/imageUtils";
import { uploadImageToFirebase } from "../../lib/firebase";
import { showToast } from "../Toast";
import { Trash, Upload } from "lucide-react";

export const OpenDoorManager = () => {
  const [partners, setPartners] = useData<Partner[]>("partnerData", []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);

  

  const save = (newPartners: Partner[]) => {
    setPartners(newPartners);
    
  };

  const addPartner = () => {
    const newPartner: Partner = {
      id: Date.now(),
      partnerName: "New Partner",
      logo: "",
      coverImage: "",
      pitchLine: "",
      details: "",
      location: "",
      date: "",
      ctaLabel: "View Programme →",
      outboundLink: "",
      sdgs: [17],
      isIncoming: true,
      isHero: false,
    };
    save([newPartner, ...partners]);
    showToast("Partner added", "success");
  };

  const updatePartner = (id: number, field: keyof Partner, value: any) => {
    let newPartners = partners.map((p) =>
      p.id === id ? { ...p, [field]: value } : p,
    );

    // If setting a hero, unset others
    if (field === "isHero" && value === true) {
      newPartners = newPartners.map((p) =>
        p.id === id ? p : { ...p, isHero: false },
      );
    }

    save(newPartners);
  };

  const deletePartner = (id: number) => {
    if (confirm("Delete this partner?")) {
      save(partners.filter((p) => p.id !== id));
      showToast("Partner deleted", "success");
    }
  };

  const handleUploadClick = (id: number) => {
    setActiveUploadId(id);
    fileInputRef.current?.click();
  };

  const handleUpload = async (file: File) => {
    if (!activeUploadId) return;
    try {
      const compressed = await compressImage(file);
      updatePartner(activeUploadId, "coverImage", compressed);
      showToast("Image uploaded", "success");
    } catch {
      showToast("Error uploading image", "error");
    }
    setActiveUploadId(null);
  };

  return (
    <div>
      <div className="bg-[var(--outgoing-bg)] border border-[var(--pk)] p-4 rounded-lg mb-8 text-sm">
        <h4 className="font-bold text-[var(--pk)] mb-2">About The Open Door</h4>
        <p className="text-gray-700">
          Every foundation we build a hublet for can feature other foundations'
          programmes, and be featured in return. Before adding a partner,
          confirm that the cross-listing has been agreed. SDG 17 is the champion
          goal — it makes all other goals possible.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Open Door Manager</h3>
        <button
          onClick={addPartner}
          className="bg-[var(--gr)] text-white px-4 py-2 rounded font-bold text-sm"
        >
          + Add Partnership
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      <div className="space-y-6">
        {partners.length === 0 && (
          <p className="text-gray-500 italic">No partners added yet.</p>
        )}
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-1/2 flex flex-col gap-2">
                <input
                  type="text"
                  value={partner.partnerName}
                  onChange={(e) =>
                    updatePartner(partner.id, "partnerName", e.target.value)
                  }
                  placeholder="Partner Name"
                  className="text-lg font-bold p-2 border rounded"
                />
                <input
                  type="text"
                  value={partner.attributionName || ""}
                  onChange={(e) =>
                    updatePartner(partner.id, "attributionName", e.target.value)
                  }
                  placeholder="Attribution Name (e.g. SDG Summer Camp)"
                  className="p-2 border rounded text-sm"
                />
              </div>
              <button
                onClick={() => deletePartner(partner.id)}
                className="text-red-500 p-2 hover:bg-red-50 rounded"
              >
                <Trash size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center bg-white p-3 rounded border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={partner.isIncoming}
                  onChange={(e) =>
                    updatePartner(partner.id, "isIncoming", e.target.checked)
                  }
                />
                <span className="text-sm font-bold">
                  Is INCOMING (We've been invited)
                </span>
              </label>

              {partner.isIncoming && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={partner.isHero}
                    onChange={(e) =>
                      updatePartner(partner.id, "isHero", e.target.checked)
                    }
                  />
                  <span className="text-sm font-bold text-[var(--pk)]">
                    Promote to Hero
                  </span>
                </label>
              )}
            </div>

            <div className="flex gap-4">
              <div className="w-1/3 flex flex-col gap-2">
                {partner.coverImage ? (
                  <img
                    src={partner.coverImage}
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded border flex items-center justify-center text-gray-400">
                    Cover Image
                  </div>
                )}
                <button
                  onClick={() => handleUploadClick(partner.id)}
                  className="bg-gray-200 text-sm py-1 rounded hover:bg-gray-300 font-bold flex items-center justify-center gap-2"
                >
                  <Upload size={14} /> Upload Cover
                </button>
                <input
                  type="text"
                  value={partner.coverImage}
                  onChange={(e) =>
                    updatePartner(partner.id, "coverImage", e.target.value)
                  }
                  placeholder="Or Cover Image URL"
                  className="text-xs p-1 border rounded"
                />
              </div>

              <div className="w-2/3 space-y-3">
                <input
                  type="text"
                  value={partner.pitchLine}
                  onChange={(e) =>
                    updatePartner(partner.id, "pitchLine", e.target.value)
                  }
                  placeholder="Pitch Line (Short tagline)"
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={partner.location}
                    onChange={(e) =>
                      updatePartner(partner.id, "location", e.target.value)
                    }
                    placeholder="Location"
                    className="w-1/2 p-2 border rounded text-sm"
                  />
                  <input
                    type="text"
                    value={partner.date}
                    onChange={(e) =>
                      updatePartner(partner.id, "date", e.target.value)
                    }
                    placeholder="Date"
                    className="w-1/2 p-2 border rounded text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={partner.ctaLabel}
                    onChange={(e) =>
                      updatePartner(partner.id, "ctaLabel", e.target.value)
                    }
                    placeholder="CTA Label"
                    className="w-1/3 p-2 border rounded text-sm"
                  />
                  <input
                    type="text"
                    value={partner.outboundLink}
                    onChange={(e) =>
                      updatePartner(partner.id, "outboundLink", e.target.value)
                    }
                    placeholder="Outbound Link (URL)"
                    className="w-2/3 p-2 border rounded text-sm text-blue-600"
                  />
                </div>
              </div>
            </div>

            <textarea
              value={partner.details}
              onChange={(e) =>
                updatePartner(partner.id, "details", e.target.value)
              }
              placeholder="Full invitation details..."
              className="w-full p-2 border rounded h-24 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
