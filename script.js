// ==================== STATE ====================
const state = {
    me: null,
    users: new Map(),       // peerId -> {id, username, avatar, status, lastSeen}
    takenUsernames: new Set(), // lowercase usernames that are taken
    messages: [],           // all public messages
    channel: null,
    peerId: generatePeerId(),
    typingUsers: new Set(),
    selectedAvatar: 'https://h.uguu.se/UhGQiLUR.jpg'
};

function generatePeerId() {
    return 'peer_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// ==================== DOM HELPERS ====================
const $ = id => document.getElementById(id);

const loginScreen = $('login-screen');
const app = $('app');
const usernameInput = $('username-input');
const usernameError = $('username-error');
const loginBtn = $('login-btn');
const avatarSelector = $('avatar-selector');
const usersList = $('users-list');
const messagesContainer = $('messages-container');
const messageInput = $('message-input');
const sendBtn = $('send-btn');
const chatHeaderName = $('chat-header-name');
const onlineInChat = $('online-in-chat');
const userSearch = $('user-search');
const onlineCountText = $('online-count-text');
const myAvatar = $('my-avatar');
const myName = $('my-name');
const myUsername = $('my-username');
const toast = $('toast');
const toastText = $('toast-text');
const inviteModal = $('invite-modal');
const inviteLinkInput = $('invite-link-input');
const copyLinkBtn = $('copy-link-btn');
const closeModal = $('close-modal');
const inviteBtnHeader = $('invite-btn-header');
const inviteBtnSidebar = $('invite-btn-sidebar');
const clearChatBtn = $('clear-chat-btn');
const contextMenu = $('context-menu');
const mobileToggle = $('mobile-toggle');
const sidebar = $('sidebar');

// ==================== VALIDATION ====================
function isValidUsername(username) {
    // Only English letters, numbers, underscores
    return /^[a-zA-Z0-9_]+$/.test(username);
}

function normalizeUsername(username) {
    return username.toLowerCase().trim();
}

function isUsernameTaken(username) {
    const normalized = normalizeUsername(username);
    if (state.takenUsernames.has(normalized)) return true;
    // Check local users
    for (const user of state.users.values()) {
        if (normalizeUsername(user.username) === normalized) return true;
    }
    return false;
}

// ==================== BROADCAST CHANNEL ====================
function initChannel() {
    state.channel = new BroadcastChannel('lord_chat_channel_v2');

    state.channel.onmessage = (event) => {
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
                broadcast({
                    type: 'pong',
                    peerId: state.peerId,
                    username: state.me.username,
                    avatar: state.me.avatar,
                    timestamp: Date.now()
                });
                break;
            case 'pong':
                handleUserJoin(data);
                break;
            case 'taken_usernames':
                // Update taken usernames from other tabs
                if (data.usernames) {
                    data.usernames.forEach(u => state.takenUsernames.add(u));
                }
                break;
            case 'request_usernames':
                // Send our username to new user
                broadcast({
                    type: 'taken_usernames',
                    peerId: state.peerId,
                    usernames: [normalizeUsername(state.me.username)]
                });
                break;
        }
    };

    // Announce presence
    broadcast({
        type: 'join',
        peerId: state.peerId,
        username: state.me.username,
        avatar: state.me.avatar,
        timestamp: Date.now()
    });

    // Request existing usernames
    broadcast({ type: 'request_usernames', peerId: state.peerId });

    // Ping existing users
    broadcast({ type: 'ping', peerId: state.peerId });

    // Periodic ping to keep alive
    setInterval(() => {
        broadcast({
            type: 'join',
            peerId: state.peerId,
            username: state.me.username,
            avatar: state.me.avatar,
            timestamp: Date.now()
        });
    }, 8000);
}

function broadcast(data) {
    if (state.channel) {
        state.channel.postMessage(data);
    }
}

// ==================== USER MANAGEMENT ====================
function handleUserJoin(data) {
    if (data.peerId === state.peerId) return;

    // Add username to taken set
    if (data.username) {
        state.takenUsernames.add(normalizeUsername(data.username));
    }

    const existing = state.users.get(data.peerId);
    if (!existing) {
        state.users.set(data.peerId, {
            id: data.peerId,
            username: data.username,
            avatar: data.avatar || 'https://h.uguu.se/UhGQiLUR.jpg',
            status: 'online',
            lastSeen: Date.now()
        });
        showToast(`${data.username} انضم إلى الشات`);
        addSystemMessage(`${data.username} انضم إلى الشات`);
    } else {
        existing.lastSeen = Date.now();
        existing.status = 'online';
    }

    renderUsersList();
    updateOnlineCount();
}

function handleUserLeave(data) {
    const user = state.users.get(data.peerId);
    if (user) {
        user.status = 'offline';
        user.lastSeen = Date.now();
        showToast(`${user.username} غادر الشات`);
        addSystemMessage(`${user.username} غادر الشات`);
        renderUsersList();
        updateOnlineCount();
    }
}

function updateOnlineCount() {
    const online = Array.from(state.users.values()).filter(u => u.status === 'online').length;
    const total = state.users.size + 1; // +1 for me
    onlineCountText.textContent = `${online + 1} متصل`;
    onlineInChat.textContent = `${total} متصل`;
    chatHeaderName.textContent = `الشات العام (${total})`;
}

// Check for stale users
setInterval(() => {
    const now = Date.now();
    let changed = false;
    state.users.forEach((user, id) => {
        if (user.status === 'online' && now - user.lastSeen > 25000) {
            user.status = 'away';
            changed = true;
        }
        if (now - user.lastSeen > 90000) {
            user.status = 'offline';
            changed = true;
        }
    });
    if (changed) {
        renderUsersList();
        updateOnlineCount();
    }
}, 5000);

// ==================== MESSAGING ====================
function handleIncomingMessage(data) {
    if (data.peerId === state.peerId) return;

    const msg = {
        id: data.msgId || generatePeerId(),
        text: data.text,
        from: data.peerId,
        fromName: data.fromName,
        fromAvatar: data.fromAvatar,
        time: data.time || new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'}),
        type: 'received'
    };

    state.messages.push(msg);
    renderMessage(msg);
    scrollToBottom();
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const msgId = generatePeerId();
    const time = new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'});

    const msg = {
        id: msgId,
        text: text,
        from: state.peerId,
        fromName: state.me.username,
        fromAvatar: state.me.avatar,
        time: time,
        type: 'sent'
    };

    state.messages.push(msg);
    renderMessage(msg);
    scrollToBottom();
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Broadcast to ALL users (public chat)
    broadcast({
        type: 'message',
        peerId: state.peerId,
        msgId: msgId,
        text: text,
        fromName: state.me.username,
        fromAvatar: state.me.avatar,
        time: time
    });
}

function addSystemMessage(text) {
    const msg = {
        id: generatePeerId(),
        text: text,
        type: 'system',
        time: new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})
    };
    state.messages.push(msg);
    renderMessage(msg);
    scrollToBottom();
}

function renderMessage(msg) {
    if (msg.type === 'system') {
        const div = document.createElement('div');
        div.className = 'system-message';
        div.textContent = msg.text;
        messagesContainer.appendChild(div);
        return;
    }

    const div = document.createElement('div');
    div.className = `message ${msg.type}`;
    div.dataset.msgId = msg.id;

    const isSent = msg.type === 'sent';

    div.innerHTML = `
        ${!isSent ? `<div class="message-header">
            <img src="${msg.fromAvatar || 'https://h.uguu.se/UhGQiLUR.jpg'}" class="message-avatar" alt="">
            <span class="message-username">${escapeHtml(msg.fromName || 'Unknown')}</span>
        </div>` : ''}
        <div class="message-text">${escapeHtml(msg.text)}</div>
        <span class="message-time">${msg.time}</span>
    `;

    div.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, msg);
    });

    messagesContainer.appendChild(div);
}

function renderUsersList(filter = '') {
    usersList.innerHTML = '';

    const filterLower = filter.toLowerCase().trim();
    const users = Array.from(state.users.values()).filter(u => {
        if (!filterLower) return true;
        return u.username.toLowerCase().includes(filterLower);
    });

    // Sort: online first, then by username
    users.sort((a, b) => {
        if (a.status === 'online' && b.status !== 'online') return -1;
        if (b.status === 'online' && a.status !== 'online') return 1;
        return a.username.localeCompare(b.username);
    });

    if (users.length === 0 && filterLower) {
        usersList.innerHTML = '<div class="no-users">لا يوجد مستخدمون بهذا الاسم</div>';
        return;
    }

    if (users.length === 0) {
        usersList.innerHTML = '<div class="no-users">لا يوجد مستخدمون متصلون</div>';
        return;
    }

    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'user-item';
        div.dataset.userId = user.id;
        div.innerHTML = `
            <div class="user-avatar-wrap">
                <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
                <span class="status-dot ${user.status}"></span>
            </div>
            <div class="user-info">
                <div class="user-name">${escapeHtml(user.username)}</div>
                <div class="user-username">@${escapeHtml(user.username.toLowerCase())}</div>
            </div>
            <div class="user-time">${user.status === 'online' ? 'متصل' : user.status === 'away' ? 'غير نشط' : 'غير متصل'}</div>
        `;

        div.addEventListener('click', () => {
            // In public chat, clicking a user just shows their info
            showToast(`@${user.username} - ${user.status === 'online' ? 'متصل' : 'غير متصل'}`);
        });

        usersList.appendChild(div);
    });
}

function handleTyping(data) {
    if (data.peerId === state.peerId) return;

    // Remove existing typing indicator for this user
    const existing = document.querySelector(`[data-typing-peer="${data.peerId}"]`);
    if (existing) existing.remove();

    if (data.typing) {
        const user = state.users.get(data.peerId);
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.dataset.typingPeer = data.peerId;
        div.innerHTML = `
            <span></span><span></span><span></span>
            <span style="margin-right:8px;font-size:0.75rem;color:var(--text-dim);">${user ? user.username : 'Someone'} يكتب...</span>
        `;
        messagesContainer.appendChild(div);
        scrollToBottom();

        setTimeout(() => {
            if (div.parentNode) div.remove();
        }, 4000);
    }
}

// ==================== UI HELPERS ====================
function showToast(text) {
    toastText.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showInviteModal() {
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const link = baseUrl + '?join=' + encodeURIComponent(state.me.username);
    inviteLinkInput.value = link;
    inviteModal.classList.add('active');
}

function showContextMenu(e, msg) {
    contextMenu.style.left = e.clientX + 'px';
    contextMenu.style.top = e.clientY + 'px';
    contextMenu.classList.add('active');

    $('ctx-copy').onclick = () => {
        navigator.clipboard.writeText(msg.text);
        showToast('تم نسخ الرسالة');
        contextMenu.classList.remove('active');
    };

    $('ctx-delete').onclick = () => {
        const idx = state.messages.findIndex(m => m.id === msg.id);
        if (idx > -1) {
            state.messages.splice(idx, 1);
            document.querySelector(`[data-msg-id="${msg.id}"]`)?.remove();
        }
        contextMenu.classList.remove('active');
    };

    $('ctx-invite').onclick = () => {
        showInviteModal();
        contextMenu.classList.remove('active');
    };
}

// ==================== EVENT LISTENERS ====================

// Avatar selection
avatarSelector.querySelectorAll('.avatar-option').forEach(img => {
    img.addEventListener('click', () => {
        avatarSelector.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('selected'));
        img.classList.add('selected');
        state.selectedAvatar = img.dataset.avatar;
        $('login-logo-preview').src = state.selectedAvatar;
    });
});

// Username input validation
usernameInput.addEventListener('input', () => {
    const val = usernameInput.value;
    usernameInput.classList.remove('error');
    usernameError.textContent = '';

    // Auto-convert to valid chars
    const cleaned = val.replace(/[^a-zA-Z0-9_]/g, '');
    if (val !== cleaned) {
        usernameInput.value = cleaned;
    }
});

// Login
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();

    // Validation
    if (!username) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'أدخل اسم المستخدم';
        usernameInput.focus();
        return;
    }

    if (username.length < 3) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'الاسم يجب أن يكون 3 أحرف على الأقل';
        usernameInput.focus();
        return;
    }

    if (username.length > 20) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'الاسم يجب أن يكون 20 حرفاً كحد أقصى';
        usernameInput.focus();
        return;
    }

    if (!isValidUsername(username)) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'اسم المستخدم يجب أن يكون بالإنجليزية فقط (أحرف، أرقام، _)';
        usernameInput.focus();
        return;
    }

    if (isUsernameTaken(username)) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'هذا الاسم مستخدم بالفعل، اختر اسمًا آخر';
        usernameInput.focus();
        return;
    }

    // Success
    state.me = {
        username: username,
        avatar: state.selectedAvatar
    };

    state.takenUsernames.add(normalizeUsername(username));

    myAvatar.src = state.me.avatar;
    myName.textContent = state.me.username;
    myUsername.textContent = '@' + state.me.username.toLowerCase();

    loginScreen.classList.add('hidden');
    setTimeout(() => {
        loginScreen.style.display = 'none';
        app.classList.add('active');
    }, 600);

    initChannel();
    showToast(`مرحباً @${username}!`);
    addSystemMessage(`أنت انضممت إلى الشات باسم @${username}`);
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});

// Send message
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';

    broadcast({
        type: 'typing',
        peerId: state.peerId,
        typing: messageInput.value.length > 0
    });
});

// Search
userSearch.addEventListener('input', (e) => {
    renderUsersList(e.target.value);
});

// Invite
inviteBtnHeader.addEventListener('click', showInviteModal);
inviteBtnSidebar.addEventListener('click', showInviteModal);

copyLinkBtn.addEventListener('click', () => {
    inviteLinkInput.select();
    document.execCommand('copy');
    showToast('تم نسخ رابط الدعوة!');
});

closeModal.addEventListener('click', () => {
    inviteModal.classList.remove('active');
});

inviteModal.addEventListener('click', (e) => {
    if (e.target === inviteModal) inviteModal.classList.remove('active');
});

// Clear chat
clearChatBtn.addEventListener('click', () => {
    if (confirm('هل تريد مسح كل المحادثة؟')) {
        state.messages = [];
        messagesContainer.innerHTML = '';
        showToast('تم مسح المحادثة');
    }
});

// Mobile toggle
mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close context menu
document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.classList.remove('active');
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    broadcast({
        type: 'leave',
        peerId: state.peerId,
        username: state.me?.username
    });
});

// Handle join from URL
const urlParams = new URLSearchParams(window.location.search);
const joinUser = urlParams.get('join');
if (joinUser) {
    showToast(`رابط دعوة من @${joinUser}! سجل دخولك للانضمام`);
}

// Initial render
renderUsersList();
