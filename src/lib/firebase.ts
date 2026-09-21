import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { GuestbookMessage, ContactInquiry } from '../types';

// Web App's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA70HlIDO0sAnVEi3ULlKD8KusYiZkqTNo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shekhar-jaat-portfolio.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shekhar-jaat-portfolio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shekhar-jaat-portfolio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "28064232504",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:28064232504:web:afc2cdcb57d2e88bcf62cd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-V9FY552BQB",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
let isInitialized = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    isInitialized = true;

    // Optional Analytics initialization in browser environment
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {
        // Analytics optional in restricted iframe environments
      });
    }
  }
} catch (error) {
  console.warn('Firebase initialization notice (falling back gracefully):', error);
}

export { app, db, analytics };

export const isFirebaseConfigured = (): boolean => {
  return isInitialized && db !== null;
};

export const getFirebaseConfigSummary = () => ({
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  isConfigured: isFirebaseConfigured(),
});

/**
 * Saves a new recruiter/client work inquiry into Firestore 'inquiries' collection
 */
export async function saveContactInquiry(inquiry: {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!db) {
    // Graceful offline fallback
    const offlineInquiries = JSON.parse(localStorage.getItem('shekhar_offline_inquiries') || '[]');
    offlineInquiries.push({ ...inquiry, createdAt: Date.now(), id: `local-${Date.now()}` });
    localStorage.setItem('shekhar_offline_inquiries', JSON.stringify(offlineInquiries));
    return { success: true, id: `local-${Date.now()}` };
  }

  try {
    const inquiriesCol = collection(db, 'inquiries');
    const docRef = await addDoc(inquiriesCol, {
      ...inquiry,
      createdAt: serverTimestamp(),
      createdMillis: Date.now(),
      status: 'unread',
      source: '3D Space Portfolio',
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error saving contact inquiry to Firestore:', error);
    return { success: false, error: error?.message || 'Failed to submit inquiry' };
  }
}

/**
 * Subscribes to real-time Guestbook endorsements from Firestore 'guestbook' collection
 */
export function subscribeToGuestbook(
  onUpdate: (messages: GuestbookMessage[]) => void,
  fallbackInitial: GuestbookMessage[]
): () => void {
  if (!db) {
    onUpdate(fallbackInitial);
    return () => {};
  }

  try {
    const guestbookCol = collection(db, 'guestbook');
    const q = query(guestbookCol, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(fallbackInitial);
          return;
        }

        const items: GuestbookMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            author: data.author || 'Anonymous Explorer',
            role: data.role || 'Visitor / Recruiter',
            message: data.message || '',
            timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
            avatarColor: data.avatarColor || '#38bdf8',
            rating: typeof data.rating === 'number' ? data.rating : 5,
          });
        });

        // Merge with initial messages if collection is small
        if (items.length < fallbackInitial.length) {
          const itemIds = new Set(items.map((i) => i.id));
          fallbackInitial.forEach((fallbackItem) => {
            if (!itemIds.has(fallbackItem.id)) {
              items.push(fallbackItem);
            }
          });
        }

        onUpdate(items);
      },
      (error) => {
        console.warn('Firestore guestbook snapshot note:', error.message);
        onUpdate(fallbackInitial);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Falling back to local guestbook:', err);
    onUpdate(fallbackInitial);
    return () => {};
  }
}

/**
 * Posts a new endorsement message to Firestore 'guestbook' collection
 */
export async function postGuestbookMessage(msg: {
  author: string;
  role?: string;
  message: string;
  avatarColor: string;
  rating?: number;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const payload = {
    ...msg,
    timestamp: Date.now(),
    createdAt: serverTimestamp(),
  };

  if (!db) {
    return { success: true, id: `local-${Date.now()}` };
  }

  try {
    const guestbookCol = collection(db, 'guestbook');
    const docRef = await addDoc(guestbookCol, payload);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error adding message to Firestore guestbook:', error);
    return { success: false, error: error?.message || 'Failed to post message' };
  }
}
