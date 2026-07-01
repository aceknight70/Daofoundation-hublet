import { useEffect, useState } from "react";
import { getStorage } from "../lib/storage";
import { HeroData } from "../types";

export const CoverPage = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    logo: "",
    foundationName: "",
    foundationWebsite: "",
    secondLogo: "",
    aboutBtnText: "About This Hublet",
    aboutTitle: "About This Hublet",
    aboutContent: "Welcome to the Partnership for Goals Hublet\n\nThis hublet is a simple, easy-to-share link that serves as a digital storefront for your foundation, FBO, NGO, or CSS organization.\n\nHere you can:\n\n📸 Share your photos and stories (Gallery)\n🎬 Showcase your videos (Videos)\n🤝 Feature partnerships (Partner Programmes)\n📋 Highlight your programmes (Our Programmes)\n📡 Connect to social media (Channels)\n📞 Provide contact info (Connect)\n\nThis initiative comes from the SDGs Learning Lab, encouraging foundations, FBOs, NGOs & CSS to share their work and build partnerships for the Sustainable Development Goals."
  });
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    setHeroData(getStorage("heroData", {
      logo: "",
      foundationName: "",
      foundationWebsite: "",
      secondLogo: "",
      aboutBtnText: "About This Hublet",
      aboutTitle: "About This Hublet",
      aboutContent: "Welcome to the Partnership for Goals Hublet\n\nThis hublet is a simple, easy-to-share link that serves as a digital storefront for your foundation, FBO, NGO, or CSS organization.\n\nHere you can:\n\n📸 Share your photos and stories (Gallery)\n🎬 Showcase your videos (Videos)\n🤝 Feature partnerships (Partner Programmes)\n📋 Highlight your programmes (Our Programmes)\n📡 Connect to social media (Channels)\n📞 Provide contact info (Connect)\n\nThis initiative comes from the SDGs Learning Lab, encouraging foundations, FBOs, NGOs & CSS to share their work and build partnerships for the Sustainable Development Goals."
    }));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center">
      {heroData.logo ? (
        <img
          src={heroData.logo}
          alt="Organization Logo"
          className="w-full max-w-[600px] mb-12 object-contain"
        />
      ) : (
        <div className="w-full max-w-[600px] h-48 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 mb-12 rounded-lg">
          [ Logo Placeholder ~600px ]
        </div>
      )}

      {heroData.foundationName && (
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--gr)] mb-2">
          {heroData.foundationName}
        </h1>
      )}

      {heroData.foundationWebsite && (
        <a
          href={heroData.foundationWebsite.startsWith('http') ? heroData.foundationWebsite : `https://${heroData.foundationWebsite}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-gray-500 hover:text-[var(--pk)] transition-colors mb-12"
        >
          {heroData.foundationWebsite.replace(/^https?:\/\//, '')}
        </a>
      )}

      {(!heroData.foundationName && !heroData.foundationWebsite) && (
        <div className="mb-12 h-8"></div>
      )}

      {heroData.secondLogo ? (
        <img
          src={heroData.secondLogo}
          alt="Second Logo"
          className="w-48 h-48 mb-12 object-contain"
        />
      ) : (
        <div className="w-48 h-48 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 mb-12 rounded-full">
          [ Second Logo ]
        </div>
      )}

      <div className="flex flex-col gap-4 mb-24">
        <a
          href="#gallery"
          className="inline-flex items-center justify-center gap-2 bg-[var(--pk)] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-md"
        >
          Explore Our Work &rarr;
        </a>
        <button
          onClick={() => setShowAbout(true)}
          className="inline-flex items-center justify-center gap-2 bg-white text-[var(--text)] border-2 border-[var(--gr)] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-sm"
        >
          {heroData.aboutBtnText || "About This Hublet"}
        </button>
      </div>

      <div className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
        <p>Partnership for Goals Hublet</p>
        <p>
          Empowering change through collaboration across foundations, FBOs, NGOs
          & CSS.
        </p>
        <p className="mt-2 text-sm text-[var(--gr)] font-bold tracking-normal">
          🏆 SDG 17 — Partnerships for the Goals
        </p>
        <p className="mt-2 text-[10px]">Designed by FATAP-CT & ESGMC through the SDGs Learning Lab</p>
      </div>

      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in text-left">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h2 className="text-xl font-bold font-serif">📖 {heroData.aboutTitle || "About This Hublet"}</h2>
              <button
                onClick={() => setShowAbout(false)}
                className="text-gray-400 hover:text-gray-800 transition-colors p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base">
              {heroData.aboutContent}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-center sm:justify-end">
              <button
                onClick={() => setShowAbout(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition-colors w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
