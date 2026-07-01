import { useEffect, useState } from "react";
import { Programme } from "../types";
import { useData } from "../lib/useData";
import { X } from "lucide-react";

export const OurProgrammesRoom = () => {
  const [programmes] = useData<Programme[]>("programmeData", []);
  const [selectedProg, setSelectedProg] = useState<Programme | null>(null);


  const displayProgrammes = [...programmes];
  while (displayProgrammes.length < 6) {
    displayProgrammes.push({
      id: Math.random(),
      name: "Placeholder Programme",
      photo: "",
      shortDescription: "Description will appear here",
      fullDescription: "",
      date: "",
    });
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-[var(--gr)] font-bold mb-2">
          📋 OUR PROGRAMMES
        </h2>
        <p className="text-gray-600">What we offer</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {displayProgrammes.map((prog) => (
          <div
            key={prog.id}
            onClick={() => prog.fullDescription && setSelectedProg(prog)}
            className={`bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1 flex flex-col ${prog.fullDescription ? 'cursor-pointer' : ''}`}
          >
            <div className="aspect-square bg-gray-100 relative">
              {prog.photo ? (
                <img
                  src={prog.photo}
                  alt={prog.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  [+] Upload Image
                </div>
              )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-bold text-sm mb-1 line-clamp-2">
                {prog.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mt-auto">
                {prog.shortDescription}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedProg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedProg(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <button
                onClick={() => setSelectedProg(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            {selectedProg.photo && (
              <img
                src={selectedProg.photo}
                alt={selectedProg.name}
                className="w-full max-h-[400px] object-cover"
              />
            )}

            <div className="p-8">
              <h3 className="text-3xl font-serif font-bold mb-4">
                {selectedProg.name}
              </h3>
              {selectedProg.date && (
                <p className="text-gray-500 mb-6 font-bold">
                  📅 {selectedProg.date}
                </p>
              )}
              <div className="text-gray-700 whitespace-pre-wrap text-lg">
                {selectedProg.fullDescription}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
