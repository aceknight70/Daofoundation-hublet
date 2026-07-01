export interface Photo {
  id: number;
  image: string;
  caption: string;
  description: string;
  date: string;
  location: string;
}

export interface Video {
  id: number;
  title: string;
  youtubeUrl: string;
  shortCaption: string;
}

export interface Partner {
  id: number;
  partnerName: string;
  attributionName?: string;
  logo: string;
  coverImage: string;
  pitchLine: string;
  details: string;
  location: string;
  date: string;
  ctaLabel: string;
  outboundLink: string;
  sdgs: number[];
  isIncoming: boolean;
  isHero: boolean;
}

export interface Programme {
  id: number;
  name: string;
  photo: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
}

export interface ChannelData {
  tiktok: string;
  facebook: string;
  instagram: string;
  youtube: string;
  website: string;
  email: string;
}

export interface HeroData {
  logo: string;
  foundationName: string;
  foundationWebsite: string;
  secondLogo: string;
  aboutBtnText: string;
  aboutTitle: string;
  aboutContent: string;
}

export interface ContactCard {
  id: number;
  title: string;
  phone: string;
  whatsapp: boolean;
  email: string;
}

export interface ContactData {
  contactCards: ContactCard[];
  escalation: Array<{
    id: number;
    name: string;
    role: string;
    phone: string;
    whatsapp: boolean;
  }>;
}

export interface RoomDef {
  id: string;
  name: string;
  icon: string;
  slug: string;
  type: "system" | "custom";
  content?: string; // for custom rooms
}

export interface ThemeData {
  primary: string;
  secondary: string;
  bg: string;
  text: string;
  outgoingBg: string;
}
