import {
  ChannelData,
  ContactData,
  Partner,
  Photo,
  Programme,
  RoomDef,
  Video,
} from "../types";

export const DEFAULT_ROOMS: RoomDef[] = [
  {
    id: "gallery",
    name: "Gallery",
    icon: "📸",
    slug: "#gallery",
    type: "system",
  },
  { id: "videos", name: "Videos", icon: "🎬", slug: "#videos", type: "system" },
  {
    id: "partners",
    name: "Partner Programmes",
    icon: "🤝",
    slug: "#partners",
    type: "system",
  },
  {
    id: "programmes",
    name: "Our Programmes",
    icon: "📋",
    slug: "#programmes",
    type: "system",
  },
  {
    id: "channels",
    name: "Channels",
    icon: "📡",
    slug: "#channels",
    type: "system",
  },
  {
    id: "connect",
    name: "Connect",
    icon: "📞",
    slug: "#connect",
    type: "system",
  },
  {
    id: "staff",
    name: "Staff Room",
    icon: "⚙",
    slug: "#staff",
    type: "system",
  },
];

export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(defaultValue)) {
        if (Array.isArray(parsed)) return parsed as any;
        return defaultValue;
      }
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return { ...defaultValue, ...parsed };
      }
      return parsed;
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return defaultValue;
  }
};

export const setStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage`, error);
  }
};
