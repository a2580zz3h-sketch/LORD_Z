/**
 * Lo/Js.js
 * Main Handler - Task Distributor & Memory Manager
 * Connects all modules: LORD/Chat.js + Lo/My.js
 * Memory: 700MB limit | Chat persistence | Image sending
 * Version: 2.0
 */

const LoJs = (function() {
    'use strict';

    // ==================== CONFIG ====================
    const CONFIG = {
        MEMORY_LIMIT: 700 * 1024 * 1024, // 700MB
        STORAGE_PREFIX: 'lojs_',
        CHAT_HISTORY_KEY: 'lojs_chat_history',
        IMAGE_CACHE_KEY: 'lojs_image_cache',
        MAX_IMAGE_CACHE: 50, // max cached images
        SYNC_INTERVAL: 3000, // ms
        VERSION: '2.0.0'
    };

    // ==================== MEMORY MANAGER ====================
    const MemoryManager = (function() {
        let usedMemory = 0;
        let memoryLog = [];

        function estimateSize(obj) {
            try {
                return new Blob([JSON.stringify(obj)]).size;
            } catch (e) {
                return 0;
            }
        }

        function getUsedMemory() {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
                }
            }
            usedMemory = total;
            return total;
        }

        function getAvailableMemory() {
            return CONFIG.MEMORY_LIMIT - getUsedMemory();
        }

        function isMemoryFull() {
            return getUsedMemory() >= CONFIG.MEMORY_LIMIT;
        }

        function cleanup() {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(CONFIG.STORAGE_PREFIX));
            keys.sort((a, b) => {
                const aTime = parseInt(localStorage.getItem(a + '_ts') || '0');
                const bTime = parseInt(localStorage.getItem(b + '_ts') || '0');
                return aTime - bTime; // oldest first
            });

            let freed = 0;
            const target = CONFIG.MEMORY_LIMIT * 0.8; // free until 80%

            for (const key of keys) {
                if (getUsedMemory() <= target) break;
                const size = localStorage[key].length * 2;
                localStorage.removeItem(key);
                localStorage.removeItem(key + '_ts');
                freed += size;
            }

            memoryLog.push({
                action: 'cleanup',
                freed: freed,
                timestamp: Date.now()
            });

            return freed;
        }

        function logMemory() {
            const info = {
                used: getUsedMemory(),
                limit: CONFIG.MEMORY_LIMIT,
                available: getAvailableMemory(),
                percentage: ((getUsedMemory() / CONFIG.MEMORY_LIMIT) * 100).toFixed(2) + '%',
                timestamp: Date.now()
            };
            memoryLog.push(info);
            if (memoryLog.length > 100) memoryLog = memoryLog.slice(-50);
            return info;
        }

        function getMemoryLog() {
            return [...memoryLog];
        }

        return {
            getUsedMemory,
            getAvailableMemory,
            isMemoryFull,
            cleanup,
            logMemory,
            getMemoryLog,
            estimateSize
        };
    })();

    // ==================== CHAT PERSISTENCE ====================
    const ChatPersistence = (function() {
        function saveChatHistory(messages) {
            try {
                const data = {
                    messages: messages.slice(-5000), // keep last 5000
                    savedAt: Date.now()
                };
                const json = JSON.stringify(data);

                if (MemoryManager.estimateSize(json) > MemoryManager.getAvailableMemory()) {
                    MemoryManager.cleanup();
                }

                localStorage.setItem(CONFIG.CHAT_HISTORY_KEY, json);
                localStorage.setItem(CONFIG.CHAT_HISTORY_KEY + '_ts', Date.now().toString());
                return true;
            } catch (e) {
                console.error('Chat save failed:', e);
                return false;
            }
        }

        function loadChatHistory() {
            try {
                const raw = localStorage.getItem(CONFIG.CHAT_HISTORY_KEY);
                if (!raw) return [];
                const data = JSON.parse(raw);
                return data.messages || [];
            } catch (e) {
                console.error('Chat load failed:', e);
                return [];
            }
        }

        function clearChatHistory() {
            localStorage.removeItem(CONFIG.CHAT_HISTORY_KEY);
            localStorage.removeItem(CONFIG.CHAT_HISTORY_KEY + '_ts');
        }

        function exportChat() {
            const history = loadChatHistory();
            return {
                version: CONFIG.VERSION,
                exportedAt: new Date().toISOString(),
                messageCount: history.length,
                messages: history
            };
        }

        function importChat(data) {
            if (!data || !Array.isArray(data.messages)) return false;
            saveChatHistory(data.messages);
            return true;
        }

        return {
            saveChatHistory,
            loadChatHistory,
            clearChatHistory,
            exportChat,
            importChat
        };
    })();

    // ==================== IMAGE CACHE ====================
    const ImageCache = (function() {
        function getCacheKey(id) {
            return CONFIG.IMAGE_CACHE_KEY + '_' + id;
        }

        function saveImage(id, imageData) {
            try {
                const key = getCacheKey(id);
                if (MemoryManager.estimateSize(imageData) > MemoryManager.getAvailableMemory() * 0.5) {
                    MemoryManager.cleanup();
                }
                localStorage.setItem(key, imageData);
                localStorage.setItem(key + '_ts', Date.now().toString());

                // Limit cache size
                cleanupOldImages();
                return true;
            } catch (e) {
                console.error('Image save failed:', e);
                return false;
            }
        }

        function getImage(id) {
            return localStorage.getItem(getCacheKey(id));
        }

        function deleteImage(id) {
            localStorage.removeItem(getCacheKey(id));
            localStorage.removeItem(getCacheKey(id) + '_ts');
        }

        function cleanupOldImages() {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(CONFIG.IMAGE_CACHE_KEY + '_') && !k.endsWith('_ts'));
            if (keys.length <= CONFIG.MAX_IMAGE_CACHE) return;

            const sorted = keys.sort((a, b) => {
                const aTime = parseInt(localStorage.getItem(a + '_ts') || '0');
                const bTime = parseInt(localStorage.getItem(b + '_ts') || '0');
                return aTime - bTime;
            });

            const toDelete = sorted.slice(0, keys.length - CONFIG.MAX_IMAGE_CACHE);
            toDelete.forEach(key => {
                localStorage.removeItem(key);
                localStorage.removeItem(key + '_ts');
            });
        }

        function getCacheInfo() {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(CONFIG.IMAGE_CACHE_KEY + '_') && !k.endsWith('_ts'));
            let totalSize = 0;
            keys.forEach(k => totalSize += localStorage[k].length * 2);

            return {
                count: keys.length,
                totalSize: formatSize(totalSize),
                maxCache: CONFIG.MAX_IMAGE_CACHE
            };
        }

        function formatSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        return {
            saveImage,
            getImage,
            deleteImage,
            getCacheInfo,
            cleanupOldImages
        };
    })();

    // ==================== TASK DISTRIBUTOR ====================
    const TaskDistributor = (function() {
        const tasks = new Map();
        let taskId = 0;

        function createTask(type, data, priority = 'normal') {
            const id = ++taskId;
            const task = {
                id,
                type,
                data,
                priority,
                status: 'pending',
                createdAt: Date.now(),
                completedAt: null
            };
            tasks.set(id, task);
            return task;
        }

        function completeTask(id, result) {
            const task = tasks.get(id);
            if (task) {
                task.status = 'completed';
                task.completedAt = Date.now();
                task.result = result;
            }
        }

        function failTask(id, error) {
            const task = tasks.get(id);
            if (task) {
                task.status = 'failed';
                task.error = error;
            }
        }

        function getTasks(filter = {}) {
            let result = Array.from(tasks.values());
            if (filter.status) result = result.filter(t => t.status === filter.status);
            if (filter.type) result = result.filter(t => t.type === filter.type);
            return result;
        }

        function cleanupOldTasks() {
            const cutoff = Date.now() - 3600000; // 1 hour
            tasks.forEach((task, id) => {
                if (task.createdAt < cutoff) tasks.delete(id);
            });
        }

        // Auto cleanup every 10 minutes
        setInterval(cleanupOldTasks, 600000);

        return {
            createTask,
            completeTask,
            failTask,
            getTasks
        };
    })();

    // ==================== SYNC ENGINE ====================
    const SyncEngine = (function() {
        let syncInterval = null;
        let lastSync = 0;

        function start() {
            if (syncInterval) return;
            syncInterval = setInterval(() => {
                sync();
            }, CONFIG.SYNC_INTERVAL);
        }

        function stop() {
            if (syncInterval) {
                clearInterval(syncInterval);
                syncInterval = null;
            }
        }

        function sync() {
            lastSync = Date.now();

            // Sync chat history
            if (typeof LordChat !== 'undefined') {
                const messages = LordChat.getMessages();
                ChatPersistence.saveChatHistory(messages);
            }

            // Log memory
            MemoryManager.logMemory();

            emit('sync', { timestamp: lastSync });
        }

        function getLastSync() {
            return lastSync;
        }

        return {
            start,
            stop,
            sync,
            getLastSync
        };
    })();

    // ==================== IMAGE SENDER ====================
    const ImageSender = (function() {
        function sendImage(file, caption = '') {
            return new Promise((resolve, reject) => {
                const task = TaskDistributor.createTask('sendImage', { file, caption }, 'high');

                if (!file || !file.type.startsWith('image/')) {
                    TaskDistributor.failTask(task.id, 'Invalid file type');
                    reject(new Error('Invalid file type'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = e.target.result;

                    // Cache image
                    const cacheId = 'img_' + Date.now();
                    ImageCache.saveImage(cacheId, imageData);

                    // Send via LordChat if available
                    if (typeof LordChat !== 'undefined') {
                        LordChat.sendImage(imageData, caption);
                    }

                    // Save to self chat if available
                    if (typeof LoMyChat !== 'undefined') {
                        LoMyChat.send(caption, { type: 'image', image: imageData });
                    }

                    TaskDistributor.completeTask(task.id, { cacheId, size: imageData.length });
                    resolve({ cacheId, imageData, caption });
                };

                reader.onerror = () => {
                    TaskDistributor.failTask(task.id, 'Read failed');
                    reject(new Error('Failed to read image'));
                };

                reader.readAsDataURL(file);
            });
        }

        function sendImageFromUrl(url, caption = '') {
            return fetch(url)
                .then(r => r.blob())
                .then(blob => {
                    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                    return sendImage(file, caption);
                });
        }

        return {
            sendImage,
            sendImageFromUrl
        };
    })();

    // ==================== MAIN API ====================
    function init(options = {}) {
        // Initialize sub-modules
        if (typeof LordChat !== 'undefined' && options.username) {
            LordChat.init(options.username, options.avatar);
        }

        if (typeof LoMyChat !== 'undefined') {
            LoMyChat.init({ username: options.username || 'me', avatar: options.avatar });
        }

        // Start sync engine
        SyncEngine.start();

        // Initial memory log
        MemoryManager.logMemory();

        emit('ready', {
            version: CONFIG.VERSION,
            memory: MemoryManager.logMemory(),
            modules: {
                lordChat: typeof LordChat !== 'undefined',
                loMyChat: typeof LoMyChat !== 'undefined'
            }
        });

        return true;
    }

    function getStatus() {
        return {
            version: CONFIG.VERSION,
            memory: MemoryManager.logMemory(),
            imageCache: ImageCache.getCacheInfo(),
            tasks: TaskDistributor.getTasks().length,
            lastSync: SyncEngine.getLastSync(),
            modules: {
                lordChat: typeof LordChat !== 'undefined',
                loMyChat: typeof LoMyChat !== 'undefined'
            }
        };
    }

    function exportAll() {
        return {
            version: CONFIG.VERSION,
            exportedAt: new Date().toISOString(),
            chatHistory: ChatPersistence.exportChat(),
            memoryLog: MemoryManager.getMemoryLog(),
            imageCache: ImageCache.getCacheInfo()
        };
    }

    function clearAll() {
        ChatPersistence.clearChatHistory();

        // Clear image cache
        const keys = Object.keys(localStorage).filter(k => k.startsWith(CONFIG.IMAGE_CACHE_KEY));
        keys.forEach(k => localStorage.removeItem(k));

        // Clear my chat
        if (typeof LoMyChat !== 'undefined') {
            LoMyChat.clearStorage();
        }

        emit('cleared');
        return true;
    }

    // ==================== EVENT SYSTEM ====================
    const listeners = {};

    function on(event, callback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
        return () => off(event, callback);
    }

    function off(event, callback) {
        if (!listeners[event]) return;
        const idx = listeners[event].indexOf(callback);
        if (idx > -1) listeners[event].splice(idx, 1);
    }

    function emit(event, data) {
        if (!listeners[event]) return;
        listeners[event].forEach(cb => {
            try { cb(data); } catch (e) { console.error(e); }
        });
    }

    // ==================== EXPORTS ====================
    return {
        CONFIG,
        init,
        getStatus,
        exportAll,
        clearAll,
        // Sub-modules
        MemoryManager,
        ChatPersistence,
        ImageCache,
        TaskDistributor,
        SyncEngine,
        ImageSender,
        // Events
        on,
        off,
        emit
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoJs;
}
