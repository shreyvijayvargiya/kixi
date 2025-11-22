// Data caching utility using IndexedDB and cookies
class DataCache {
	constructor() {
		this.dbName = "brahman-travel-cache";
		this.dbVersion = 1;
		this.storeName = "locations";
		this.cookieName = "brahman-cache-timestamp";
		this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
	}

	// Initialize IndexedDB
	async initDB() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.dbVersion);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result);

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					const store = db.createObjectStore(this.storeName, { keyPath: "id" });
					store.createIndex("name", "name", { unique: false });
					store.createIndex("state", "state", { unique: false });
				}
			};
		});
	}

	// Check if cache is valid
	isCacheValid() {
		const timestamp = this.getCookie(this.cookieName);
		if (!timestamp) return false;

		const cacheTime = parseInt(timestamp);
		const now = Date.now();
		return now - cacheTime < this.cacheExpiry;
	}

	// Get data from cache
	async getCachedData() {
		try {
			if (!this.isCacheValid()) {
				return null;
			}

			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readonly");
			const store = transaction.objectStore(this.storeName);
			const request = store.getAll();

			return new Promise((resolve, reject) => {
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});
		} catch (error) {
			console.error("Error reading from cache:", error);
			return null;
		}
	}

	// Store data in cache
	async setCachedData(data) {
		try {
			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readwrite");
			const store = transaction.objectStore(this.storeName);

			// Clear existing data
			await store.clear();

			// Add new data
			for (const item of data) {
				store.add(item);
			}

			// Set cache timestamp
			this.setCookie(this.cookieName, Date.now().toString(), 1);

			return true;
		} catch (error) {
			console.error("Error writing to cache:", error);
			return false;
		}
	}

	// Clear cache
	async clearCache() {
		try {
			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readwrite");
			const store = transaction.objectStore(this.storeName);
			await store.clear();

			this.deleteCookie(this.cookieName);
			return true;
		} catch (error) {
			console.error("Error clearing cache:", error);
			return false;
		}
	}

	// Cookie utilities
	setCookie(name, value, days) {
		const expires = new Date();
		expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
	}

	getCookie(name) {
		const nameEQ = name + "=";
		const ca = document.cookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === " ") c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	deleteCookie(name) {
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
	}
}

export default DataCache;
