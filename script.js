// ==================== STATE ====================
const state = {
    me: null,
    users: new Map(),
    activeChat: null,
    messages: new Map(),
    channel: null,
    peerId: crypto.randomUUID(),
    typingTimeout: null,
    selectedAvatar: 'https://h.uguu.se/UhGQiLUR.jpg'
};

// ==================== DOM HELPERS ====================
const $ = id => document.getElementById(id);

const loginScreen = $('login-screen');
const app = $('app');
const usernameInput = $('username-input');
const loginBtn = $('login-btn');
const avatarSelector = $('avatar-selector');
const usersList = $('users-list');
const messagesContainer = $('messages-container');
const messageInput = $('message-input');
const sendBtn = $('send-btn');
const chatHeader = $('chat-header');
const chatHeaderName = $('chat-header-name');
const chatHeaderAvatar = $('chat-header-avatar');
const chatInputArea = $('chat-input-area');
const emptyChat = $('empty-chat');
const userSearch = $('user-search');
const onlineCountText = $('online-count-text');
const myAvatar = $('my-avatar');
const myName = $('my-name');
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

// ==================== BROADCAST CHANNEL ====================
function initChannel() {
    state.channel = new BroadcastChannel('lord_chat_channel_v1');

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
                    avatar: state.me.avatar
                });
                break;
            case 'pong':
                handleUserJoin(data);
                break;
            case 'status':
                updateUserStatus(data.peerId, data.status);
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
    }, 10000);
}

function broadcast(data) {
    if (state.channel) {
        state.channel.postMessage(data);
    }
}

// ==================== USER MANAGEMENT ====================
function handleUserJoin(data) {
    if (data.peerId === state.peerId) return;

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
        renderUsersList();
    } else {
        existing.lastSeen = Date.now();
        existing.status = 'online';
        renderUsersList();
    }
    updateOnlineCount();
}

function handleUserLeave(data) {
    const user = state.users.get(data.peerId);
    if (user) {
        user.status = 'offline';
        user.lastSeen = Date.now();
        renderUsersList();
        updateOnlineCount();
    }
}

function updateUserStatus(peerId, status) {
    const user = state.users.get(peerId);
    if (user) {
        user.status = status;
        renderUsersList();
    }
}

function updateOnlineCount() {
    const online = Array.from(state.users.values()).filter(u => u.status === 'online').length;
    onlineCountText.textContent = `${online + 1} متصل`;
}

// Check for stale users
setInterval(() => {
    const now = Date.now();
    let changed = false;
    state.users.forEach((user, id) => {
        if (user.status === 'online' && now - user.lastSeen > 30000) {
            user.status = 'away';
            changed = true;
        }
        if (now - user.lastSeen > 120000) {
            user.status = 'offline';
            changed = true;
        }
    });
    if (changed) {
        renderUsersList();
        updateOnlineCount();
    }
}, 10000);

// ==================== MESSAGING ====================
function handleIncomingMessage(data) {
    if (!state.messages.has(data.from)) {
        state.messages.set(data.from, []);
    }

    const msg = {
        id: data.msgId || crypto.randomUUID(),
        text: data.text,
        from: data.from,
        fromName: data.fromName,
        fromAvatar: data.fromAvatar,
        time: data.time || new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'}),
        type: 'received'
    };

    state.messages.get(data.from).push(msg);

    if (state.activeChat === data.from) {
        renderMessage(msg);
        scrollToBottom();
    } else {
        const user = state.users.get(data.from);
        if (user) {
            showToast(`رسالة جديدة من ${user.username}`);
        }
        renderUsersList();
    }
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !state.activeChat) return;

    const msgId = crypto.randomUUID();
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

    if (!state.messages.has(state.activeChat)) {
        state.messages.set(state.activeChat, []);
    }
    state.messages.get(state.activeChat).push(msg);

    renderMessage(msg);
    scrollToBottom();
    messageInput.value = '';
    messageInput.style.height = 'auto';

    broadcast({
        type: 'message',
        peerId: state.peerId,
        msgId: msgId,
        text: text,
        from: state.peerId,
        fromName: state.me.username,
        fromAvatar: state.me.avatar,
        time: time,
        target: state.activeChat
    });
}

function renderMessage(msg) {
    const div = document.createElement('div');
    div.className = `message ${msg.type}`;
    div.dataset.msgId = msg.id;
    div.innerHTML = `
        ${escapeHtml(msg.text)}
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

    const users = Array.from(state.users.values()).filter(u => 
        u.username.toLowerCase().includes(filter.toLowerCase())
    );

    if (users.length === 0 && filter) {
        usersList.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-dim);">لا يوجد مستخدمون</div>';
        return;
    }

    users.forEach(user => {
        const msgs = state.messages.get(user.id) || [];
        const unread = msgs.filter(m => m.type === 'received').length;
        const isActive = state.activeChat === user.id;

        const div = document.createElement('div');
        div.className = `user-item ${isActive ? 'active' : ''}`;
        div.dataset.userId = user.id;
        div.innerHTML = `
            <div class="user-avatar-wrap">
                <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
                <span class="status-dot ${user.status}"></span>
            </div>
            <div class="user-info">
                <div class="user-name">${escapeHtml(user.username)}</div>
                <div class="user-preview">${user.status === 'online' ? 'متصل الآن' : user.status === 'away' ? 'غير نشط' : 'غير متصل'}</div>
            </div>
            ${unread > 0 ? `<div class="unread-badge">${unread}</div>` : `<div class="user-time"></div>`}
        `;

        div.addEventListener('click', () => openChat(user.id));
        usersList.appendChild(div);
    });
}

function openChat(userId) {
    state.activeChat = userId;
    const user = state.users.get(userId);
    if (!user) return;

    chatHeader.style.display = 'flex';
    chatInputArea.style.display = 'flex';
    emptyChat.style.display = 'none';

    chatHeaderName.textContent = user.username;
    chatHeaderAvatar.src = user.avatar;

    messagesContainer.innerHTML = '';
    const msgs = state.messages.get(userId) || [];
    msgs.forEach(msg => renderMessage(msg));
    scrollToBottom();

    renderUsersList(userSearch.value);

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

function handleTyping(data) {
    if (data.peerId === state.peerId) return;
    if (state.activeChat !== data.peerId) return;

    const existing = messagesContainer.querySelector('.typing-indicator');
    if (existing) existing.remove();

    if (data.typing) {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(div);
        scrollToBottom();

        setTimeout(() => {
            if (div.parentNode) div.remove();
        }, 3000);
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
    const link = window.location.href.split('?')[0] + '?join=' + state.peerId;
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
        const msgs = state.messages.get(state.activeChat) || [];
        const idx = msgs.findIndex(m => m.id === msg.id);
        if (idx > -1) {
            msgs.splice(idx, 1);
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

// Login
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (!username) {
        showToast('أدخل اسمك أولاً');
        usernameInput.focus();
        return;
    }

    state.me = {
        username: username,
        avatar: state.selectedAvatar
    };

    myAvatar.src = state.me.avatar;
    myName.textContent = state.me.username;

    loginScreen.classList.add('hidden');
    setTimeout(() => {
        loginScreen.style.display = 'none';
        app.classList.add('active');
    }, 600);

    initChannel();
    showToast(`مرحباً ${username}!`);
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

    if (state.activeChat) {
        broadcast({
            type: 'typing',
            peerId: state.peerId,
            typing: true
        });

        clearTimeout(state.typingTimeout);
        state.typingTimeout = setTimeout(() => {
            broadcast({
                type: 'typing',
                peerId: state.peerId,
                typing: false
            });
        }, 2000);
    }
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
    showToast('تم نسخ الرابط!');
});

closeModal.addEventListener('click', () => {
    inviteModal.classList.remove('active');
});

inviteModal.addEventListener('click', (e) => {
    if (e.target === inviteModal) inviteModal.classList.remove('active');
});

// Clear chat
clearChatBtn.addEventListener('click', () => {
    if (state.activeChat && confirm('هل تريد مسح المحادثة؟')) {
        state.messages.set(state.activeChat, []);
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
const joinId = urlParams.get('join');
if (joinId) {
    showToast('تم فتح رابط الدعوة! سجل دخولك للانضمام');
}
