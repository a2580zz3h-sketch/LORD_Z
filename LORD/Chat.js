/**
 * LORD/Chat.js
 * Core Chat Engine - All chat commands and operations
 * Version: 2.0
 */

const LordChat = (function() {
    'use strict';

    // ==================== CONFIG ====================
    const CONFIG = {
        CHANNEL_NAME: 'lord_chat_v3',
        MAX_MESSAGE_LENGTH: 2000,
        MAX_USERNAME_LENGTH: 20,
        MIN_USERNAME_LENGTH: 3,
        TYPING_TIMEOUT: 3000,
        PING_INTERVAL: 5000,
        STALE_THRESHOLD: 20000,
        OFFLINE_THRESHOLD: 60000,
        ALLOWED_CHARS: /^[a-zA-Z0-9_]+$/,
        AVATAR_DEFAULT: 'https://h.uguu.se/UhGQiLUR.jpg'
    };

    // ==================== STATE ====================
    let state = {
        me: null,
        users: new Map(),
        takenUsernames: new Set(),
        messages: [],
        myMessages: [], // Self chat messages
        channel: null,
        peerId: null,
        typingUsers: new Map(),
        isConnected: false,
        lastPing: Date.now()
    };

    // ==================== UTILITIES ====================
    function generateId() {
        return 'lc_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    function normalizeUsername(username) {
        return username.toLowerCase().trim();
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

    // ==================== VALIDATION ====================
    function validateUsername(username) {
        const errors = [];
        const trimmed = username.trim();

        if (!trimmed) {
            errors.push('Username is required');
            return { valid: false, errors, normalized: '' };
        }

        if (trimmed.length < CONFIG.MIN_USERNAME_LENGTH) {
            errors.push(`Username must be at least ${CONFIG.MIN_USERNAME_LENGTH} characters`);
        }

        if (trimmed.length > CONFIG.MAX_USERNAME_LENGTH) {
            errors.push(`Username must be at most ${CONFIG.MAX_USERNAME_LENGTH} characters`);
        }

        if (!CONFIG.ALLOWED_CHARS.test(trimmed)) {
            errors.push('Username can only contain English letters, numbers, and underscores');
        }

        const normalized = normalizeUsername(trimmed);

        return {
            valid: errors.length === 0,
            errors,
            normalized,
            original: trimmed
        };
    }

    function isUsernameTaken(username) {
        const normalized = normalizeUsername(username);
        if (state.takenUsernames.has(normalized)) return true;
        for (const user of state.users.values()) {
            if (normalizeUsername(user.username) === normalized) return true;
        }
        return false;
    }

    // ==================== BROADCAST CHANNEL ====================
    function initChannel() {
        try {
            state.channel = new BroadcastChannel(CONFIG.CHANNEL_NAME);
            state.isConnected = true;

            state.channel.onmessage = handleChannelMessage;

            // Announce join
            broadcast({
                type: 'join',
                peerId: state.peerId,
                username: state.me.username,
                avatar: state.me.avatar,
                timestamp: Date.now()
            });

            // Request existing users
            broadcast({ type: 'ping', peerId: state.peerId });

            // Start keep-alive
            startKeepAlive();

            return true;
        } catch (e) {
            console.error('Failed to initialize channel:', e);
            return false;
        }
    }

    function broadcast(data) {
        if (state.channel && state.isConnected) {
            try {
                state.channel.postMessage(data);
            } catch (e) {
                console.error('Broadcast failed:', e);
            }
        }
    }

    function handleChannelMessage(event) {
        const data = event.data;
        if (!data || data.peerId === state.peerId) return;

        switch(data.type) {
            case 'join':
                handleUserJoin(data);
                break;
            case 'leave':
                handleUserLeave(data);
                break;
            case 'message':
                handleIncomingMessage(data);
                break;
            case 'typing':
                handleTyping(data);
                break;
            case 'ping':
                handlePing(data);
                break;
            case 'pong':
                handlePong(data);
                break;
            case 'request_usernames':
                sendUsernameList(data.peerId);
                break;
            case 'username_list':
                updateTakenUsernames(data.usernames);
                break;
            case 'image':
                handleIncomingImage(data);
                break;
        }
    }

    // ==================== USER MANAGEMENT ====================
    function handleUserJoin(data) {
        if (!data.username) return;

        state.takenUsernames.add(normalizeUsername(data.username));

        const existing = state.users.get(data.peerId);
        if (!existing) {
            const user = {
                id: data.peerId,
                username: data.username,
                avatar: data.avatar || CONFIG.AVATAR_DEFAULT,
                status: 'online',
                lastSeen: Date.now(),
                joinTime: Date.now()
            };
            state.users.set(data.peerId, user);
            emit('userJoin', user);
        } else {
            existing.lastSeen = Date.now();
            existing.status = 'online';
            emit('userUpdate', existing);
        }
    }

    function handleUserLeave(data) {
        const user = state.users.get(data.peerId);
        if (user) {
            user.status = 'offline';
            user.lastSeen = Date.now();
            emit('userLeave', user);
        }
    }

    function handlePing(data) {
        broadcast({
            type: 'pong',
            peerId: state.peerId,
            username: state.me.username,
            avatar: state.me.avatar,
            timestamp: Date.now()
        });
    }

    function handlePong(data) {
        handleUserJoin(data);
    }

    function sendUsernameList(requesterId) {
        broadcast({
            type: 'username_list',
            peerId: state.peerId,
            target: requesterId,
            usernames: Array.from(state.takenUsernames)
        });
    }

    function updateTakenUsernames(usernames) {
        if (Array.isArray(usernames)) {
            usernames.forEach(u => state.takenUsernames.add(u));
        }
    }

    function startKeepAlive() {
        setInterval(() => {
            if (!state.me) return;
            broadcast({
                type: 'join',
                peerId: state.peerId,
                username: state.me.username,
                avatar: state.me.avatar,
                timestamp: Date.now()
            });
        }, CONFIG.PING_INTERVAL);

        // Check stale users
        setInterval(() => {
            const now = Date.now();
            let changed = false;
            state.users.forEach((user, id) => {
                if (user.status === 'online' && now - user.lastSeen > CONFIG.STALE_THRESHOLD) {
                    user.status = 'away';
                    changed = true;
                    emit('userUpdate', user);
                }
                if (user.status !== 'offline' && now - user.lastSeen > CONFIG.OFFLINE_THRESHOLD) {
                    user.status = 'offline';
                    changed = true;
                    emit('userUpdate', user);
                }
            });
            if (changed) {
                emit('usersChanged', getUsersList());
            }
        }, 5000);
    }

    // ==================== MESSAGING ====================
    function handleIncomingMessage(data) {
        const msg = {
            id: data.msgId || generateId(),
            text: data.text,
            from: data.peerId,
            fromName: data.fromName,
            fromAvatar: data.fromAvatar || CONFIG.AVATAR_DEFAULT,
            time: data.time || formatTime(),
            date: data.date || formatDate(),
            type: 'received',
            timestamp: Date.now()
        };

        state.messages.push(msg);
        emit('message', msg);
    }

    function handleIncomingImage(data) {
        const msg = {
            id: data.msgId || generateId(),
            image: data.image,
            caption: data.caption || '',
            from: data.peerId,
            fromName: data.fromName,
            fromAvatar: data.fromAvatar || CONFIG.AVATAR_DEFAULT,
            time: data.time || formatTime(),
            date: data.date || formatDate(),
            type: 'received',
            isImage: true,
            timestamp: Date.now()
        };

        state.messages.push(msg);
        emit('image', msg);
    }

    function handleTyping(data) {
        if (data.typing) {
            state.typingUsers.set(data.peerId, Date.now());
            const user = state.users.get(data.peerId);
            emit('typing', { peerId: data.peerId, username: user ? user.username : 'Unknown' });
        } else {
            state.typingUsers.delete(data.peerId);
            emit('typingStop', { peerId: data.peerId });
        }

        // Auto-clear typing after timeout
        setTimeout(() => {
            const lastTyped = state.typingUsers.get(data.peerId);
            if (lastTyped && Date.now() - lastTyped > CONFIG.TYPING_TIMEOUT) {
                state.typingUsers.delete(data.peerId);
                emit('typingStop', { peerId: data.peerId });
            }
        }, CONFIG.TYPING_TIMEOUT + 500);
    }

    // ==================== PUBLIC API ====================
    function init(username, avatar) {
        const validation = validateUsername(username);
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        if (isUsernameTaken(username)) {
            return { success: false, errors: ['Username is already taken'] };
        }

        state.peerId = generateId();
        state.me = {
            username: validation.original,
            avatar: avatar || CONFIG.AVATAR_DEFAULT
        };
        state.takenUsernames.add(validation.normalized);

        const success = initChannel();
        if (success) {
            emit('connected', state.me);
        }

        return { success, user: state.me };
    }

    function send(text) {
        if (!state.me || !text.trim()) return false;
        if (text.length > CONFIG.MAX_MESSAGE_LENGTH) return false;

        const msg = {
            id: generateId(),
            text: text.trim(),
            from: state.peerId,
            fromName: state.me.username,
            fromAvatar: state.me.avatar,
            time: formatTime(),
            date: formatDate(),
            type: 'sent',
            timestamp: Date.now()
        };

        state.messages.push(msg);

        broadcast({
            type: 'message',
            peerId: state.peerId,
            msgId: msg.id,
            text: msg.text,
            fromName: msg.fromName,
            fromAvatar: msg.fromAvatar,
            time: msg.time,
            date: msg.date
        });

        emit('messageSent', msg);
        return msg;
    }

    function sendImage(imageData, caption = '') {
        if (!state.me || !imageData) return false;

        const msg = {
            id: generateId(),
            image: imageData,
            caption: caption.trim(),
            from: state.peerId,
            fromName: state.me.username,
            fromAvatar: state.me.avatar,
            time: formatTime(),
            date: formatDate(),
            type: 'sent',
            isImage: true,
            timestamp: Date.now()
        };

        state.messages.push(msg);

        broadcast({
            type: 'image',
            peerId: state.peerId,
            msgId: msg.id,
            image: imageData,
            caption: msg.caption,
            fromName: msg.fromName,
            fromAvatar: msg.fromAvatar,
            time: msg.time,
            date: msg.date
        });

        emit('imageSent', msg);
        return msg;
    }

    function setTyping(isTyping) {
        broadcast({
            type: 'typing',
            peerId: state.peerId,
            typing: isTyping
        });
    }

    function getUsersList() {
        return Array.from(state.users.values()).sort((a, b) => {
            if (a.status === 'online' && b.status !== 'online') return -1;
            if (b.status === 'online' && a.status !== 'online') return 1;
            return a.username.localeCompare(b.username);
        });
    }

    function searchUsers(query) {
        const lower = query.toLowerCase().trim();
        if (!lower) return getUsersList();
        return getUsersList().filter(u => 
            u.username.toLowerCase().includes(lower)
        );
    }

    function getOnlineCount() {
        const online = Array.from(state.users.values()).filter(u => u.status === 'online').length;
        return {
            online: online + 1, // +1 for me
            total: state.users.size + 1,
            away: Array.from(state.users.values()).filter(u => u.status === 'away').length
        };
    }

    function getMessages() {
        return [...state.messages];
    }

    function clearMessages() {
        state.messages = [];
        emit('messagesCleared');
    }

    function getInviteLink() {
        const base = window.location.href.split('?')[0].split('#')[0];
        return base + '?join=' + encodeURIComponent(state.me.username);
    }

    function leave() {
        broadcast({
            type: 'leave',
            peerId: state.peerId,
            username: state.me?.username
        });
        if (state.channel) {
            state.channel.close();
        }
        state.isConnected = false;
        emit('disconnected');
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
        setTyping,
        getUsersList,
        searchUsers,
        getOnlineCount,
        getMessages,
        clearMessages,
        getInviteLink,
        leave,
        validateUsername,
        isUsernameTaken,
        normalizeUsername,
        escapeHtml,
        formatTime,
        formatDate,
        on,
        off,
        emit,
        // Internal access for other modules
        _state: () => state
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LordChat;
}
