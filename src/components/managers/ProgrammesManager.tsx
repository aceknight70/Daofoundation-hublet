import { useEffect, useRef, useState } from "react";
import { Programme } from "../../types";
import { getStorage, setStorage } from "../../lib/storage";
import { compressImage } from "../../lib/imageUtils";
import { showToast } from "../Toast";
import { Trash, Upload } from "lucide-react";

export const ProgrammesManager = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);

  useEffect(() => {
    setProgrammes(getStorage("programmeData", []));
  }, []);

  const save = (newProgs: Programme[]) => {
    setProgrammes(newProgs);
    setStorage("programmeData", newProgs);
  };

  const addProgramme = () => {
    const newProg: Programme = {
      id: Date.now(),
      name: "New Programme",
      photo: "",
      shortDescription: "",
      fullDescription: "",
      date: "",
    };
    save([newProg, ...programmes]);
    showToast("Programme added", "success");
  };

  const updateProg = (id: number, field: keyof Programme, value: string) => {
    save(programmes.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const deleteProg = (id: number) => {
    if (confirm("Delete this programme?")) {
      save(programmes.filter((p) => p.id !== id));
      showToast("Programme deleted", "success");
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
      updateProg(activeUploadId, "photo", compressed);
      showToast("Image uploaded", "success");
    } catch {
      showToast("Error uploading image", "error");
    }
    setActiveUploadId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Programmes Manager</h3>
        <button
          onClick={addProgramme}
          className="bg-[var(--gr)] text-white px-4 py-2 rounded font-bold text-sm"
        >
          + Add Programme
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
        {programmes.length === 0 && (
          <p className="text-gray-500 italic">No programmes added yet.</p>
        )}
        {programmes.map((prog) => (
          <div
            key={prog.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4"
          >
            <div className="w-1/4 flex flex-col gap-2">
              {prog.photo ? (
                <img
                  src={prog.photo}
                  className="w-full aspect-square object-cover rounded border"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 rounded border flex items-center justify-center text-gray-400 text-sm text-center p-2">
                  Thumbnail
                </div>
              )}
              <button
                onClick={() => handleUploadClick(prog.id)}
                className="bg-gray-200 text-sm py-1 rounded hover:bg-gray-300 font-bold flex items-center justify-center gap-1"
              >
                <Upload size={14} /> Upload
              </button>
            </div>

            <div className="w-3/4 space-y-3">
              <div className="flex justify-between">
                <input
                  type="text"
                  value={prog.name}
                  onChange={(e) => updateProg(prog.id, "name", e.target.value)}
                  placeholder="Programme Name"
                  className="font-bold text-lg p-2 border rounded w-3/4"
                />
                <button
                  onClick={() => deleteProg(prog.id)}
                  className="text-red-500 p-2 hover:bg-red-50 rounded"
                >
                  <Trash size={20} />
                </button>
              </div>

              <input
                type="text"
                value={prog.date}
                onChange={(e) => updateProg(prog.id, "date", e.target.value)}
                placeholder="Date (Optional)"
                className="w-1/2 p-2 border rounded text-sm"
              />

              <input
                type="text"
                value={prog.shortDescription}
                onChange={(e) =>
                  updateProg(prog.id, "shortDescription", e.target.value)
                }
                placeholder="Short Description (Card preview)"
                className="w-full p-2 border rounded text-sm"
              />

              <textarea
                value={prog.fullDescription}
                onChange={(e) =>
                  updateProg(prog.id, "fullDescription", e.target.value)
                }
                placeholder="Full Description"
                className="w-full p-2 border rounded h-24 text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
