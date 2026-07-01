import React, { useEffect, useRef, useState } from "react";
import { Photo } from "../types";
import { getStorage, setStorage } from "../lib/storage";
import { compressImage } from "../lib/imageUtils";
import { showToast } from "./Toast";
import { X } from "lucide-react";

export const GalleryRoom = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(getStorage("galleryData", []));
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      const newPhoto: Photo = {
        id: Date.now(),
        image: compressed,
        caption: "",
        description: "",
        date: new Date().toLocaleDateString(),
        location: "",
      };

      const newPhotos = [newPhoto, ...photos];
      setPhotos(newPhotos);
      setStorage("galleryData", newPhotos);
      showToast("Photo uploaded successfully! ✅", "success");
    } catch (error) {
      showToast("Failed to upload photo", "error");
    }
  };

  // Ensure we show at least 10 frames (placeholders)
  const displayPhotos = [...photos];
  while (displayPhotos.length < 10) {
    displayPhotos.push({
      id: Math.random(),
      image: "",
      caption: "",
      description: "",
      date: "",
      location: "",
    });
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-[var(--gr)] font-bold mb-2">
            📸 GALLERY
          </h2>
          <p className="text-gray-600">Stories from our work</p>
        </div>
        <button
          onClick={handleUploadClick}
          className="bg-[var(--gr)] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-colors"
        >
          + Upload Photo
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayPhotos.map((photo, i) => (
          <div
            key={photo.id}
            onClick={() => photo.image && setSelectedPhoto(photo)}
            className={`bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1 ${photo.image ? "cursor-pointer" : ""}`}
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center border-b border-gray-100 relative">
              {photo.image ? (
                <img
                  src={photo.image}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick();
                  }}
                  className="text-gray-400 text-sm flex flex-col items-center gap-2 hover:text-[var(--gr)] transition-colors"
                >
                  <span className="text-2xl">[+]</span>
                  <span>Upload Photo</span>
                </button>
              )}
            </div>
            {photo.image && (
              <div className="p-4">
                <p className="font-bold text-sm truncate">
                  {photo.caption || "Untitled"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.caption}
                className="w-full rounded-lg mb-6"
              />
              <h3 className="text-2xl font-serif font-bold mb-4">
                {selectedPhoto.caption || "Untitled"}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                {selectedPhoto.date && (
                  <span>📅 Date: {selectedPhoto.date}</span>
                )}
                {selectedPhoto.location && (
                  <span>📍 Location: {selectedPhoto.location}</span>
                )}
              </div>

              {selectedPhoto.description && (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
