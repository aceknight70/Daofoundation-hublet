import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, writeBatch, getDocs } from "firebase/firestore";
import { getStorage as getFirebaseStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getStorage } from "./storage";

export const getFirebaseConfig = () => {
  try {
    const config = localStorage.getItem("firebaseConfig");
    return config ? JSON.parse(config) : null;
  } catch (e) {
    return null;
  }
};

export const initFirebase = () => {
  const config = getFirebaseConfig();
  if (!config || !config.apiKey) return null;
  
  try {
    if (getApps().length === 0) {
      return initializeApp(config);
    }
    return getApp();
  } catch (e) {
    console.error("Firebase init error", e);
    return null;
  }
};

export const getDb = () => {
  const app = initFirebase();
  if (!app) return null;
  return getFirestore(app);
};

export const getStorageInstance = () => {
  const app = initFirebase();
  if (!app) return null;
  return getFirebaseStorage(app);
};

export const uploadImageToFirebase = async (base64String: string, folder: string, filename: string): Promise<string | null> => {
  const storage = getStorageInstance();
  if (!storage) return null;
  
  try {
    const storageRef = ref(storage, `${folder}/${filename}`);
    await uploadString(storageRef, base64String, 'data_url');
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Firebase upload failed", error);
    return null;
  }
};

export const migrateLocalStorageToFirebase = async (onProgress: (msg: string) => void) => {
  const db = getDb();
  if (!db) return false;

  const collections = ["galleryData", "videoData", "partnerData", "programmeData", "channelData", "contactData", "roomData"];
  const singletons = ["heroData", "themeData", "roomOrder", "staffPassword"];
  
  let hasData = false;
  
  for (const key of [...collections, ...singletons]) {
    if (localStorage.getItem(key)) {
      hasData = true;
      break;
    }
  }

  if (!hasData) return false;

  try {
    onProgress("Migrating singletons...");
    for (const key of singletons) {
      const dataStr = localStorage.getItem(key);
      if (dataStr) {
        let data = JSON.parse(dataStr);
        // Upload images if any
        if (key === "heroData") {
          if (data.logo && data.logo.startsWith("data:image")) {
            const url = await uploadImageToFirebase(data.logo, "logos", `logo_${Date.now()}`);
            if (url) data.logo = url;
          }
          if (data.secondLogo && data.secondLogo.startsWith("data:image")) {
            const url = await uploadImageToFirebase(data.secondLogo, "logos", `secondLogo_${Date.now()}`);
            if (url) data.secondLogo = url;
          }
        }
        await setDoc(doc(db, "singletons", key), data);
      }
    }

    const batch = writeBatch(db);
    let imageCount = 0;

    for (const key of collections) {
      onProgress(`Migrating ${key}...`);
      const dataStr = localStorage.getItem(key);
      if (dataStr) {
        const dataArray = JSON.parse(dataStr);
        if (Array.isArray(dataArray)) {
          for (let i = 0; i < dataArray.length; i++) {
            const item = dataArray[i];
            
            // Upload images for different collections
            if (key === "galleryData" && item.url && item.url.startsWith("data:image")) {
              const url = await uploadImageToFirebase(item.url, "gallery", `photo_${item.id}_${Date.now()}`);
              if (url) item.url = url;
              imageCount++;
              if (imageCount % 3 === 0) onProgress(`Migrating images ${imageCount}...`);
            }
            if (key === "partnerData" && item.logo && item.logo.startsWith("data:image")) {
              const url = await uploadImageToFirebase(item.logo, "partners", `partner_${item.id}_${Date.now()}`);
              if (url) item.logo = url;
              imageCount++;
              if (imageCount % 3 === 0) onProgress(`Migrating images ${imageCount}...`);
            }
            if (key === "programmeData" && item.image && item.image.startsWith("data:image")) {
              const url = await uploadImageToFirebase(item.image, "programmes", `programme_${item.id}_${Date.now()}`);
              if (url) item.image = url;
              imageCount++;
              if (imageCount % 3 === 0) onProgress(`Migrating images ${imageCount}...`);
            }
            
            const docId = String(item.id || item.key || item.name || i);
            const refId = docId.match(/^[0-9]+$/) ? `id_${docId}` : docId;
            batch.set(doc(collection(db, key), refId), item);
          }
        }
      }
    }

    onProgress("Committing to Firebase...");
    await batch.commit();

    // Clear local storage after successful migration
    for (const key of [...collections, ...singletons]) {
      localStorage.removeItem(key);
    }
    
    // Create a flag so we know we migrated
    localStorage.setItem("firebaseMigrated", "true");
    
    return true;
  } catch (e) {
    console.error("Migration failed", e);
    return false;
  }
};


