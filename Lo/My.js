/**
 * Lo/My.js
 * Self Chat / Saved Messages Module
 * Like "Saved Messages" in WhatsApp - chat with yourself
 * Version: 2.0
 */

const LoMyChat = (function() {
    'use strict';

    // ==================== CONFIG ====================
    const CONFIG = {
        STORAGE_KEY: 'lo_my_chat_v2',
        MAX_MESSAGES: 10000,
        MAX_MESSAGE_LENGTH: 5000,
        MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    };

    // ==================== STATE ====================
    let state = {
        messages: [],
        user: null,
        isInitialized: false,
        draft: ''
    };

    // ==================== STORAGE ====================
    function saveToStorage() {
        try {
            const data = {
                messages: state.messages.slice(-CONFIG.MAX_MESSAGES),
                user: state.user,
                lastSave: Date.now()
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            // Try to clear old messages and save again
            if (e.name === 'QuotaExceededError') {
                state.messages = state.messages.slice(-Math.floor(CONFIG.MAX_MESSAGES / 2));
                return saveToStorage();
            }
            return false;
        }
    }

    function loadFromStorage() {
        try {
            const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (!raw) return false;

            const data = JSON.parse(raw);
            if (data.messages && Array.isArray(data.messages)) {
                state.messages = data.messages;
            }
            if (data.user) {
                state.user = data.user;
            }
            return true;
        } catch (e) {
            console.error('Load failed:', e);
            return false;
        }
    }

    function clearStorage() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        state.messages = [];
        emit('cleared');
    }

    // ==================== UTILITIES ====================
    function generateId() {
        return 'my_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime(date = new Date()) {
        return date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    function formatDate(date = new Date()) {
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ==================== IMAGE HANDLING ====================
    function compressImage(file, maxWidth = 1200, quality = 0.8) {
        return new Promise((resolve, reject) => {
            if (!CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
                reject(new Error('Invalid image type'));
                return;
            }

            if (file.size > CONFIG.MAX_IMAGE_SIZE) {
                reject(new Error('Image too large (max 5MB)'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressed = canvas.toDataURL('image/jpeg', quality);
                    resolve({
                        data: compressed,
                        width: width,
                        height: height,
                        originalName: file.name,
                        originalSize: formatFileSize(file.size)
                    });
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // ==================== MESSAGE OPERATIONS ====================
    function createMessage(text, options = {}) {
        const now = new Date();
        return {
            id: generateId(),
            text: text.trim(),
            type: options.type || 'text',
            image: options.image || null,
            caption: options.caption || '',
            file: options.file || null,
            time: formatTime(now),
            date: formatDate(now),
            timestamp: now.getTime(),
            edited: false,
            pinned: false,
            starred: false
        };
    }

    function send(text, options = {}) {
        if (!text.trim() && !options.image) return null;
        if (text.length > CONFIG.MAX_MESSAGE_LENGTH) return null;

        const msg = createMessage(text, options);
        state.messages.push(msg);

        // Auto-save
        saveToStorage();

        emit('message', msg);
        return msg;
    }

    function sendImage(imageData, caption = '') {
        return send(caption, { type: 'image', image: imageData });
    }

    function editMessage(msgId, newText) {
        const msg = state.messages.find(m => m.id === msgId);
        if (!msg) return false;

        msg.text = newText.trim();
        msg.edited = true;
        msg.editTime = formatTime();

        saveToStorage();
        emit('messageEdited', msg);
        return true;
    }

    function deleteMessage(msgId) {
        const idx = state.messages.findIndex(m => m.id === msgId);
        if (idx === -1) return false;

        const msg = state.messages[idx];
        state.messages.splice(idx, 1);

        saveToStorage();
        emit('messageDeleted', msg);
        return true;
    }

    function pinMessage(msgId) {
        const msg = state.messages.find(m => m.id === msgId);
        if (!msg) return false;

        msg.pinned = !msg.pinned;
        saveToStorage();
        emit('messagePinned', msg);
        return true;
    }

    function starMessage(msgId) {
        const msg = state.messages.find(m => m.id === msgId);
        if (!msg) return false;

        msg.starred = !msg.starred;
        saveToStorage();
        emit('messageStarred', msg);
        return true;
    }

    // ==================== SEARCH & FILTER ====================
    function search(query) {
        const lower = query.toLowerCase().trim();
        if (!lower) return getMessages();

        return state.messages.filter(m => {
            if (m.text && m.text.toLowerCase().includes(lower)) return true;
            if (m.caption && m.caption.toLowerCase().includes(lower)) return true;
            if (m.date && m.date.toLowerCase().includes(lower)) return true;
            return false;
        });
    }

    function getMessages(options = {}) {
        let msgs = [...state.messages];

        if (options.pinnedOnly) {
            msgs = msgs.filter(m => m.pinned);
        }
        if (options.starredOnly) {
            msgs = msgs.filter(m => m.starred);
        }
        if (options.type) {
            msgs = msgs.filter(m => m.type === options.type);
        }
        if (options.limit) {
            msgs = msgs.slice(-options.limit);
        }

        return msgs;
    }

    function getPinnedMessages() {
        return state.messages.filter(m => m.pinned);
    }

    function getStarredMessages() {
        return state.messages.filter(m => m.starred);
    }

    function getMessageCount() {
        return state.messages.length;
    }

    function getStorageSize() {
        const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (!raw) return '0 B';
        return formatFileSize(new Blob([raw]).size);
    }

    // ==================== DRAFT ====================
    function setDraft(text) {
        state.draft = text;
        localStorage.setItem(CONFIG.STORAGE_KEY + '_draft', text);
    }

    function getDraft() {
        if (state.draft) return state.draft;
        return localStorage.getItem(CONFIG.STORAGE_KEY + '_draft') || '';
    }

    function clearDraft() {
        state.draft = '';
        localStorage.removeItem(CONFIG.STORAGE_KEY + '_draft');
    }

    // ==================== INIT ====================
    function init(user) {
        state.user = user || { username: 'me', avatar: '' };
        loadFromStorage();
        state.isInitialized = true;
        emit('ready', { messageCount: state.messages.length });
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
        send,
        sendImage,
        editMessage,
        deleteMessage,
        pinMessage,
        starMessage,
        search,
        getMessages,
        getPinnedMessages,
        getStarredMessages,
        getMessageCount,
        getStorageSize,
        setDraft,
        getDraft,
        clearDraft,
        compressImage,
        clearStorage,
        saveToStorage,
        loadFromStorage,
        formatTime,
        formatDate,
        formatFileSize,
        escapeHtml,
        on,
        off,
        emit
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoMyChat;
}
