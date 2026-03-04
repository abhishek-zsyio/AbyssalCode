// ===================== AUDIO STORE (IndexedDB) =====================
// Stores downloaded audio blobs so blocked tracks play instantly on next visit.

const DB_NAME = 'AbyssalAudioDB';
const STORE_NAME = 'audioTracks';
const DB_VERSION = 1;

let _db = null;

function openDB() {
    if (_db) return Promise.resolve(_db);
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
        req.onerror = (e) => reject(e.target.error);
    });
}

/** Retrieve a cached audio Blob by YouTube video ID. Returns null on miss. */
export async function getTrack(id) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(id);
            req.onsuccess = () => resolve(req.result ? req.result.blob : null);
            req.onerror = (e) => reject(e.target.error);
        });
    } catch (e) {
        console.warn('[AudioStore] getTrack failed:', e);
        return null;
    }
}

/** Save an audio Blob under a YouTube video ID. */
export async function saveTrack(id, blob) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).put({ id, blob, savedAt: Date.now() });
            req.onsuccess = () => resolve();
            req.onerror = (e) => reject(e.target.error);
        });
    } catch (e) {
        console.warn('[AudioStore] saveTrack failed:', e);
    }
}

/** Delete a single cached track. */
export async function deleteTrack(id) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).delete(id);
            req.onsuccess = () => resolve();
            req.onerror = (e) => reject(e.target.error);
        });
    } catch (e) {
        console.warn('[AudioStore] deleteTrack failed:', e);
    }
}

/** Wipe the entire audio cache. */
export async function clearCache() {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).clear();
            req.onsuccess = () => resolve();
            req.onerror = (e) => reject(e.target.error);
        });
    } catch (e) {
        console.warn('[AudioStore] clearCache failed:', e);
    }
}
