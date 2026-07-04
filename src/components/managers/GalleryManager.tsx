import { ImageWithLoader } from "../ImageWithLoader";
import { useRef, useState } from "react";
import { Photo } from "../../types";
import { useData } from "../../lib/useData";

import { compressImage } from "../../lib/imageUtils";
import { uploadImageToFirebase } from "../../lib/firebase";
import { showToast } from "../Toast";
import { Trash } from "lucide-react";

export const GalleryManager = () => {
  const [photos, setPhotos] = useData<Photo[]>("galleryData", []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  

  const save = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    
  };

  const handleUpload = async (file: File, id: number) => {
    try {
      const compressed = await compressImage(file);
      const url = await uploadImageToFirebase(compressed, "gallery", `photo_${Date.now()}`);
      save(photos.map((p) => (p.id === id ? { ...p, image: url || compressed } : p)));
      showToast("Photo uploaded", "success");
    } catch {
      showToast("Error uploading photo", "error");
    }
  };

  const addNewPhoto = () => {
    const newPhoto: Photo = {
      id: Date.now(),
      image: "",
      caption: "",
      description: "",
      date: new Date().toLocaleDateString(),
      location: "",
    };
    save([...photos, newPhoto]);
  };

  const updatePhoto = (id: number, field: keyof Photo, value: string) => {
    save(photos.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const deletePhoto = (id: number) => {
    if (confirm("Delete this photo?")) {
      save(photos.filter((p) => p.id !== id));
      showToast("Photo deleted", "success");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Gallery Manager</h3>
      </div>

      <div className="space-y-6">
        {photos.length === 0 && (
          <p className="text-gray-500 italic">No photos added yet.</p>
        )}
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="border border-gray-200 rounded-lg p-4 flex gap-4 bg-gray-50 flex-col sm:flex-row"
          >
            <div className="w-full sm:w-32 flex-shrink-0">
              <span className="text-sm font-bold block mb-2 text-gray-500">Photo #{index + 1}</span>
              {photo.image ? (
                <div className="relative group">
                  <ImageWithLoader
                    src={photo.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <label className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer rounded transition-opacity">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleUpload(e.target.files[0], photo.id)
                      }
                    />
                  </label>
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-bold text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && handleUpload(e.target.files[0], photo.id)
                    }
                  />
                </label>
              )}
            </div>
            <div className="flex-grow space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) =>
                    updatePhoto(photo.id, "caption", e.target.value)
                  }
                  placeholder="Caption"
                  className="w-full p-2 border rounded font-bold"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={photo.date}
                  onChange={(e) =>
                    updatePhoto(photo.id, "date", e.target.value)
                  }
                  placeholder="Date"
                  className="w-1/2 p-2 border rounded text-sm"
                />
                <input
                  type="text"
                  value={photo.location}
                  onChange={(e) =>
                    updatePhoto(photo.id, "location", e.target.value)
                  }
                  placeholder="Location"
                  className="w-1/2 p-2 border rounded text-sm"
                />
              </div>
              <textarea
                value={photo.description}
                onChange={(e) =>
                  updatePhoto(photo.id, "description", e.target.value)
                }
                placeholder="Description"
                className="w-full p-2 border rounded text-sm h-16"
              />
            </div>
            <button
              onClick={() => deletePhoto(photo.id)}
              className="text-red-500 hover:bg-red-50 p-2 rounded self-start"
            >
              <Trash size={20} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addNewPhoto}
        className="mt-6 w-full py-4 border-2 border-dashed border-[var(--gr)] text-[var(--gr)] rounded-lg font-bold hover:bg-[var(--bg)] transition-colors"
      >
        + Add New Photo
      </button>
    </div>
  );
};
