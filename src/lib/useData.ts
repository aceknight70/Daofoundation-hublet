import { useState, useEffect } from "react";
import { getStorage, setStorage } from "./storage";
import { getDb } from "./firebase";
import { collection, onSnapshot, doc, setDoc, getDocs, writeBatch } from "firebase/firestore";

export function useData<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [data, setData] = useState<T>(() => getStorage(key, defaultValue));

  useEffect(() => {
    const db = getDb();
    if (!db) return;

    const isCollection = Array.isArray(defaultValue) && 
      (defaultValue.length === 0 || typeof defaultValue[0] === 'object') && 
      key !== 'roomOrder';

    if (isCollection) {
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

        const finalItems = items.length > 0 ? (items as unknown as T) : defaultValue;
        setData(finalItems);
        localStorage.setItem(key, JSON.stringify(finalItems));
      });
      return () => unsub();
    } else {
      const docRef = doc(db, "singletons", key);
      const unsub = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          let val = docSnap.data() as any;
          if (val && val.hasOwnProperty('value') && Object.keys(val).length === 1) {
            val = val.value;
          }
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

    const isCollection = Array.isArray(val) && 
      (val.length === 0 || typeof val[0] === 'object') && 
      key !== 'roomOrder';

    if (isCollection) {
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
      let valToSave = val as any;
      if (typeof valToSave !== 'object' || Array.isArray(valToSave) || valToSave === null) {
        valToSave = { value: valToSave };
      }
      await setDoc(docRef, valToSave);
    }
  };

  return [data, updateData];
}
