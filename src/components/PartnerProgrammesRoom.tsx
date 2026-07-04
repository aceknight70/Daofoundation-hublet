import { ImageWithLoader } from "./ImageWithLoader";
import { useEffect, useState } from "react";
import { Partner } from "../types";
import { useData } from "../lib/useData";
import { X } from "lucide-react";

export const PartnerProgrammesRoom = () => {
  const [partners] = useData<Partner[]>("partnerData", []);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);


  const incoming = partners.filter((p) => p.isIncoming);
  const outgoing = partners.filter((p) => !p.isIncoming);

  const displayIncoming = [...incoming];
  while (displayIncoming.length < 4) { // 1 hero + 3 other
    displayIncoming.push({
      id: Math.random(),
      partnerName: "Placeholder Foundation",
      logo: "",
      coverImage: "",
      pitchLine: "We collaborate on global goals.",
      details: "",
      location: "Global",
      date: "",
      ctaLabel: "View →",
      outboundLink: "",
      sdgs: [17],
      isIncoming: true,
      isHero: displayIncoming.length === 0, // make the first one hero if none exists
    });
  }

  const displayOutgoing = [...outgoing];
  while (displayOutgoing.length < 3) {
    displayOutgoing.push({
      id: Math.random(),
      partnerName: "Placeholder Foundation",
      logo: "",
      coverImage: "",
      pitchLine: "An open door for collaboration.",
      details: "",
      location: "Global",
      date: "",
      ctaLabel: "Details",
      outboundLink: "",
      sdgs: [17],
      isIncoming: false,
      isHero: false,
    });
  }

  const heroPartner = displayIncoming.find((p) => p.isHero) || displayIncoming[0];
  const otherIncoming = displayIncoming.filter((p) => p !== heroPartner);

  return (
    <div className="animate-fade-in space-y-12">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-serif text-[var(--gr)] font-bold mb-2">
          🤝 PARTNER PROGRAMMES
        </h2>
        <p className="text-gray-600">The Open Door</p>
        <p className="inline-block mt-4 bg-[var(--outgoing-bg)] text-[var(--pk)] px-3 py-1 rounded-full text-xs font-bold">
          🏆 SDG 17 Champion — Partnerships for the Goals
        </p>
      </div>

      {/* WE'VE BEEN INVITED (Incoming) */}
      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span>⭐</span> WE'VE BEEN INVITED
        </h3>

        {heroPartner && (
          <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden mb-8 border border-gray-100">
            {heroPartner.coverImage ? (
              <ImageWithLoader
                src={heroPartner.coverImage}
                alt={heroPartner.partnerName}
                className="w-full h-[350px] object-cover"
              />
            ) : (
              <div className="w-full h-[350px] bg-gray-100 flex items-center justify-center text-gray-400">
                [+] Upload Logo/Image
              </div>
            )}
            <div className="p-8">
              <h4 className="text-3xl font-serif font-bold mb-2">
                {heroPartner.partnerName}
              </h4>
              <p className="text-gray-500 mb-4 font-bold flex items-center gap-2">
                <span>📍</span> {heroPartner.location}{" "}
                {heroPartner.date && `• ${heroPartner.date}`}
              </p>
              <p className="text-xl mb-6 italic">"{heroPartner.pitchLine}"</p>
              <p className="text-sm font-bold text-gray-500 mb-6">
                🤝 Invited by: {heroPartner.attributionName || heroPartner.partnerName}
              </p>

              <div className="flex justify-between items-center">
                <a
                  href={heroPartner.outboundLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--gr)] text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors"
                >
                  {heroPartner.ctaLabel || "View Programme →"}
                </a>
                <span className="text-xs font-bold text-gray-400">
                  🏷️ SDG 17
                </span>
              </div>
            </div>
          </div>
        )}

        {otherIncoming.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {otherIncoming.map((p) => (
              <a
                key={p.id}
                href={p.outboundLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[350px] border border-gray-100 hover:-translate-y-1 transition-transform block"
              >
                {p.coverImage ? (
                  <ImageWithLoader
                    src={p.coverImage}
                    alt={p.partnerName}
                    className="w-full h-[60%] object-cover"
                  />
                ) : (
                  <div className="w-full h-[60%] bg-gray-100 flex items-center justify-center text-gray-400">
                    [+] Upload Logo/Image
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h5 className="font-bold text-lg mb-1">{p.partnerName}</h5>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {p.pitchLine}
                  </p>
                  <p className="text-xs text-gray-400 mb-auto">
                    📍 {p.location}
                  </p>
                  <p className="text-xs text-gray-500 font-bold mb-2">
                    🤝 Invited by: {p.attributionName || p.partnerName}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-[var(--gr)] font-bold text-sm hover:underline">
                      {p.ctaLabel || "View →"}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      🏷️ SDG 17
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* WE'RE INVITING (Outgoing) */}
      <section className="bg-[var(--outgoing-bg)] p-8 rounded-2xl border border-[var(--pk)] shadow-sm relative overflow-hidden">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--pk)] relative z-10">
          <span>🟧</span> WE'RE INVITING
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {displayOutgoing.map((p) => (
            <div
              key={p.id}
              onClick={() => p.details && setSelectedPartner(p)}
              className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[350px] transition-transform hover:-translate-y-1 ${p.details ? 'cursor-pointer' : ''}`}
            >
              {p.coverImage ? (
                <ImageWithLoader
                  src={p.coverImage}
                  alt={p.partnerName}
                  className="w-full h-[60%] object-cover"
                />
              ) : (
                <div className="w-full h-[60%] bg-gray-100 flex items-center justify-center text-gray-400">
                  [+] Upload Logo/Image
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h5 className="font-bold text-lg mb-1">{p.partnerName}</h5>
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {p.pitchLine}
                </p>
                <p className="text-xs text-gray-400 mb-auto">
                  📍 {p.location}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-[var(--pk)] font-bold text-sm">
                    {p.ctaLabel || "Details"}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    🏷️ SDG 17
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal for Outgoing */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <button
                onClick={() => setSelectedPartner(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            {selectedPartner.coverImage && (
              <ImageWithLoader
                src={selectedPartner.coverImage}
                alt={selectedPartner.partnerName}
                className="w-full h-[300px] object-cover"
              />
            )}

            <div className="p-8">
              <h3 className="text-3xl font-serif font-bold mb-2">
                🌍 {selectedPartner.partnerName}
              </h3>
              <p className="text-gray-500 mb-6 font-bold">
                📍 {selectedPartner.location}{" "}
                {selectedPartner.date && `• ${selectedPartner.date}`}
              </p>

              <div className="text-gray-700 whitespace-pre-wrap mb-8 text-lg">
                {selectedPartner.details}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <p className="font-bold text-gray-600">
                  🤝 Invited by: Our Foundation
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <a
                  href={selectedPartner.outboundLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[var(--pk)] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors text-center"
                >
                  Visit Partner &rarr;
                </a>
                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  🏷️ SDG 17 — Partnerships for the Goals
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
