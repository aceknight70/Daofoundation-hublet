import { useState } from "react";
import { ThemeData } from "../../types";
import { useData } from "../../lib/useData";

import { showToast } from "../Toast";

const PRESETS = [
  { name: "Default", primary: "#1a5e7a", secondary: "#e87a5d", bg: "#faf8f5", text: "#2d2d2d", outgoingBg: "#fef3e8" },
  { name: "Ocean", primary: "#006994", secondary: "#00b4d8", bg: "#f0f8ff", text: "#1a2a3a", outgoingBg: "#e0f7fa" },
  { name: "Green", primary: "#2d6a4f", secondary: "#52b788", bg: "#f0f8f0", text: "#1a2a1a", outgoingBg: "#e8f5e9" },
  { name: "Sunset", primary: "#e76f51", secondary: "#f4a261", bg: "#fef8f0", text: "#2d1a0a", outgoingBg: "#fef0e8" },
  { name: "Purple", primary: "#6c3b8a", secondary: "#9b59b6", bg: "#f8f0f8", text: "#1a0a2d", outgoingBg: "#f3e8f5" },
  { name: "Sky", primary: "#2196f3", secondary: "#64b5f6", bg: "#f0f8ff", text: "#0a1a2d", outgoingBg: "#e3f2fd" },
  { name: "Red", primary: "#c62828", secondary: "#e53935", bg: "#fef0f0", text: "#2a0a0a", outgoingBg: "#fde8e8" },
  { name: "Pink", primary: "#ad1457", secondary: "#e91e63", bg: "#fef0f5", text: "#2a0a1a", outgoingBg: "#fce4ec" }
];

export const ThemeManager = () => {
  const [theme, setTheme] = useData<ThemeData>("themeData", PRESETS[0]);

  const handleChange = (field: keyof ThemeData, value: string) => {
    setTheme({ ...theme, [field]: value });
  };

  const applyTheme = (newTheme: ThemeData) => {
    
    document.documentElement.style.setProperty("--gr", newTheme.primary);
    document.documentElement.style.setProperty("--pk", newTheme.secondary);
    document.documentElement.style.setProperty("--bg", newTheme.bg);
    document.documentElement.style.setProperty("--text", newTheme.text);
    document.documentElement.style.setProperty("--outgoing-bg", newTheme.outgoingBg);
    showToast("Theme applied", "success");
  };

  const handleApply = () => {
    applyTheme(theme);
  };

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setTheme(preset);
    applyTheme(preset);
  };

  const handleReset = () => {
    handlePreset(PRESETS[0]);
  };

  return (
    <div>
      <h3 className="font-bold text-xl mb-4 text-[var(--gr)]">Theme Customizer</h3>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h4 className="font-bold text-lg mb-4">Preset Themes</h4>
        <div className="flex flex-wrap gap-2 mb-6">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="px-4 py-2 rounded-full text-sm font-bold border transition-all"
              style={{
                backgroundColor: preset.primary,
                color: preset.bg,
                borderColor: preset.primary
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <h4 className="font-bold text-lg mb-4">Custom Colors</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Primary Color (--gr)</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={theme.primary} onChange={e => handleChange("primary", e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={theme.primary} onChange={e => handleChange("primary", e.target.value)} className="border p-2 rounded flex-grow uppercase text-sm font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Secondary Color (--pk)</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={theme.secondary} onChange={e => handleChange("secondary", e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={theme.secondary} onChange={e => handleChange("secondary", e.target.value)} className="border p-2 rounded flex-grow uppercase text-sm font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Background Color (--bg)</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={theme.bg} onChange={e => handleChange("bg", e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={theme.bg} onChange={e => handleChange("bg", e.target.value)} className="border p-2 rounded flex-grow uppercase text-sm font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Text Color (--text)</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={theme.text} onChange={e => handleChange("text", e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={theme.text} onChange={e => handleChange("text", e.target.value)} className="border p-2 rounded flex-grow uppercase text-sm font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Outgoing BG Color (--outgoing-bg)</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={theme.outgoingBg} onChange={e => handleChange("outgoingBg", e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={theme.outgoingBg} onChange={e => handleChange("outgoingBg", e.target.value)} className="border p-2 rounded flex-grow uppercase text-sm font-mono" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleApply} className="bg-[var(--gr)] text-white px-6 py-2 rounded-full font-bold hover:opacity-90">
            Apply Custom Theme
          </button>
          <button onClick={handleReset} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full font-bold hover:bg-gray-100">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};
