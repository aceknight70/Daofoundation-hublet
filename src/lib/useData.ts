import { useState, useEffect } from "react";
import { getStorage, setStorage } from "./storage";
import { getDb } from "./firebase";
import { collection, onSnapshot, doc, setDoc, getDocs, writeBatch } from "firebase/firestore";

export function useData<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [data, setData] = useState<T>(() => getStorage(key, defaultValue));

  useEffect(() => {
    const db = getDb();
    if (!db) return;

    if (Array.isArray(defaultValue)) {
      const colRef = collection(db, key);
      const unsub = onSnapshot(colRef, (snapshot) => {
        const items = snapshot.docs.map(d => {
          const data = d.data();
          // Restore id as number if it was originally a number
          return {
            ...data,
            id: typeof data.id === "number" ? data.id : (d.id.startsWith("id_") ? parseInt(d.id.replace("id_", "")) || d.id : d.id)
          };
        });
        
        // Sort items by id if possible to preserve order
        items.sort((a: any, b: any) => {
          if (typeof a.id === "number" && typeof b.id === "number") return a.id - b.id;
          return 0;
        });

        setData(items as unknown as T);
        localStorage.setItem(key, JSON.stringify(items));
      });
      return () => unsub();
    } else {
      const docRef = doc(db, "singletons", key);
      const unsub = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const val = docSnap.data() as T;
          setData(val);
          localStorage.setItem(key, JSON.stringify(val));
        } else {
          setData(getStorage(key, defaultValue));
        }
      });
      return () => unsub();
    }
  }, [key]);

  const updateData = async (val: T) => {
    setData(val);
    setStorage(key, val);
    
    const db = getDb();
    if (!db) return;

    if (Array.isArray(val)) {
      const batch = writeBatch(db);
      const colRef = collection(db, key);
      
      const existing = await getDocs(colRef);
      const newIds = new Set(val.map(item => String(item.id || item.key || item.name)));
      
      existing.docs.forEach(d => {
        const originalId = d.id.startsWith("id_") ? d.id.replace("id_", "") : d.id;
        if (!newIds.has(originalId)) {
          batch.delete(d.ref);
        }
      });

      val.forEach(item => {
        const docId = String(item.id || item.key || item.name);
        const refId = docId.match(/^[0-9]+$/) ? `id_${docId}` : docId;
        const ref = doc(colRef, refId);
        batch.set(ref, item);
      });

      await batch.commit();
    } else {
      const docRef = doc(db, "singletons", key);
      await setDoc(docRef, val as any);
    }
  };

  return [data, updateData];
}
