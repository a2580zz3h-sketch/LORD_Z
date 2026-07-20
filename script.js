// ==================== DOM HELPERS ====================
const $ = id => document.getElementById(id);

// Elements
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
const imageBtn = $('image-btn');
const imageInput = $('image-input');
const contextMenu = $('context-menu');
const mobileToggle = $('mobile-toggle');
const sidebar = $('sidebar');

let selectedAvatar = 'https://h.uguu.se/UhGQiLUR.jpg';

// ==================== TOAST ====================
function showToast(text) {
    toastText.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ==================== RENDER MESSAGE ====================
function renderMessage(msg) {
    if (msg.type === 'system') {
        const div = document.createElement('div');
        div.className = 'system-message';
        div.textContent = msg.text;
        messagesContainer.appendChild(div);
        scrollToBottom();
        return;
    }

    const div = document.createElement('div');
    div.className = `message ${msg.type}`;
    div.dataset.msgId = msg.id;

    const isSent = msg.type === 'sent';
    const avatar = msg.fromAvatar || 'https://h.uguu.se/UhGQiLUR.jpg';

    let html = '';

    if (!isSent) {
        html += `<div class="message-header">`;
        html += `<img src="${avatar}" class="message-avatar" alt="" onerror="this.src='https://h.uguu.se/UhGQiLUR.jpg'">`;
        html += `<span class="message-username">@${escapeHtml((msg.fromName || 'unknown').toLowerCase())}</span>`;
        html += `</div>`;
    }

    if (msg.isImage && msg.image) {
        html += `<img src="${msg.image}" class="message-image" alt="image" onerror="this.style.display='none'">`;
        if (msg.caption) {
            html += `<div class="message-text">${escapeHtml(msg.caption)}</div>`;
        }
    } else {
        html += `<div class="message-text">${escapeHtml(msg.text || '')}</div>`;
    }

    html += `<span class="message-time">${msg.time || ''}</span>`;

    div.innerHTML = html;

    div.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, msg);
    });

    messagesContainer.appendChild(div);
    scrollToBottom();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== RENDER USERS ====================
function renderUsers(filter = '') {
    if (!usersList) return;
    usersList.innerHTML = '';

    const users = LordChat.searchUsers(filter);

    if (users.length === 0) {
        if (filter) {
            usersList.innerHTML = '<div class="no-users">لا يوجد مستخدمون بهذا الاسم</div>';
        } else {
            usersList.innerHTML = '<div class="no-users">لا يوجد مستخدمون متصلون</div>';
        }
        return;
    }

    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'user-item';
        div.dataset.userId = user.id;

        const statusText = user.status === 'online' ? 'متصل' : user.status === 'away' ? 'غير نشط' : 'غير متصل';

        div.innerHTML = `
            <div class="user-avatar-wrap">
                <img src="${user.avatar}" alt="${user.username}" class="user-avatar" onerror="this.src='https://h.uguu.se/UhGQiLUR.jpg'">
                <span class="status-dot ${user.status}"></span>
            </div>
            <div class="user-info">
                <div class="user-name">${escapeHtml(user.username)}</div>
                <div class="user-username">@${escapeHtml(user.username.toLowerCase())}</div>
            </div>
            <div class="user-time">${statusText}</div>
        `;

        div.addEventListener('click', () => {
            showToast(`@${user.username} - ${statusText}`);
        });

        usersList.appendChild(div);
    });
}

function updateOnlineCount() {
    const count = LordChat.getOnlineCount();
    onlineCountText.textContent = `${count.online} متصل`;
    onlineInChat.textContent = `${count.total} متصل`;
    chatHeaderName.textContent = `الشات العام (${count.total})`;
}

// ==================== CONTEXT MENU ====================
function showContextMenu(e, msg) {
    contextMenu.style.left = e.clientX + 'px';
    contextMenu.style.top = e.clientY + 'px';
    contextMenu.classList.add('active');

    $('ctx-copy').onclick = () => {
        const text = msg.isImage ? (msg.caption || '[صورة]') : msg.text;
        navigator.clipboard.writeText(text);
        showToast('تم نسخ الرسالة');
        contextMenu.classList.remove('active');
    };

    $('ctx-delete').onclick = () => {
        // Remove from DOM
        const el = document.querySelector(`[data-msg-id="${msg.id}"]`);
        if (el) el.remove();
        contextMenu.classList.remove('active');
    };

    $('ctx-invite').onclick = () => {
        showInviteModal();
        contextMenu.classList.remove('active');
    };
}

// ==================== INVITE MODAL ====================
function showInviteModal() {
    const link = LordChat.getInviteLink();
    inviteLinkInput.value = link;
    inviteModal.classList.add('active');
}

// ==================== EVENT LISTENERS ====================

// Avatar selection
avatarSelector.querySelectorAll('.avatar-option').forEach(img => {
    img.addEventListener('click', () => {
        avatarSelector.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('selected'));
        img.classList.add('selected');
        selectedAvatar = img.dataset.avatar;
        $('login-logo-preview').src = selectedAvatar;
    });
});

// Username input - auto clean non-English chars
usernameInput.addEventListener('input', () => {
    const val = usernameInput.value;
    usernameInput.classList.remove('error');
    usernameError.textContent = '';

    // Remove any non-allowed characters
    const cleaned = val.replace(/[^a-zA-Z0-9_]/g, '');
    if (val !== cleaned) {
        usernameInput.value = cleaned;
    }
});

// Login
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();

    // Validate
    const validation = LordChat.validateUsername(username);
    if (!validation.valid) {
        usernameInput.classList.add('error');
        usernameError.textContent = validation.errors[0];
        usernameInput.focus();
        return;
    }

    if (LordChat.isUsernameTaken(username)) {
        usernameInput.classList.add('error');
        usernameError.textContent = 'هذا الاسم مستخدم بالفعل، اختر اسمًا آخر';
        usernameInput.focus();
        return;
    }

    // Init main chat
    const result = LordChat.init(username, selectedAvatar);
    if (!result.success) {
        usernameInput.classList.add('error');
        usernameError.textContent = result.errors[0];
        usernameInput.focus();
        return;
    }

    // Init self chat
    LoMyChat.init({ username: username, avatar: selectedAvatar });

    // Init handler
    LoJs.init({ username: username, avatar: selectedAvatar });

    // Update UI
    myAvatar.src = selectedAvatar;
    myName.textContent = username;
    myUsername.textContent = '@' + username.toLowerCase();

    // Hide login
    loginScreen.classList.add('hidden');
    setTimeout(() => {
        loginScreen.style.display = 'none';
        app.classList.add('active');
    }, 600);

    showToast(`مرحباً @${username}!`);
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});

// Send message
sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (!text) return;

    const msg = LordChat.send(text);
    if (msg) {
        renderMessage(msg);
        messageInput.value = '';
        messageInput.style.height = 'auto';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
    }
});

messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    LordChat.setTyping(messageInput.value.length > 0);
});

// Search users
userSearch.addEventListener('input', (e) => {
    renderUsers(e.target.value);
});

// Invite buttons
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
        messagesContainer.innerHTML = '';
        LordChat.clearMessages();
        showToast('تم مسح المحادثة');
    }
});

// Image send
imageBtn.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        const imageData = ev.target.result;
        const msg = LordChat.sendImage(imageData, '');
        if (msg) {
            renderMessage(msg);
        }
        imageInput.value = '';
    };
    reader.readAsDataURL(file);
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

// ==================== LORD CHAT EVENTS ====================
LordChat.on('connected', (user) => {
    console.log('Connected as', user.username);
});

LordChat.on('message', (msg) => {
    renderMessage(msg);
});

LordChat.on('image', (msg) => {
    renderMessage(msg);
});

LordChat.on('userJoin', (user) => {
    showToast(`${user.username} انضم إلى الشات`);
    renderUsers(userSearch.value);
    updateOnlineCount();
});

LordChat.on('userLeave', (user) => {
    showToast(`${user.username} غادر الشات`);
    renderUsers(userSearch.value);
    updateOnlineCount();
});

LordChat.on('userUpdate', () => {
    renderUsers(userSearch.value);
    updateOnlineCount();
});

LordChat.on('usersChanged', () => {
    renderUsers(userSearch.value);
    updateOnlineCount();
});

LordChat.on('typing', (data) => {
    // Show typing indicator
    let indicator = document.querySelector('.typing-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(indicator);
        scrollToBottom();
    }

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (indicator && indicator.parentNode) {
            indicator.remove();
        }
    }, 4000);
});

// ==================== HANDLE JOIN FROM URL ====================
const urlParams = new URLSearchParams(window.location.search);
const joinUser = urlParams.get('join');
if (joinUser) {
    showToast(`رابط دعوة من @${joinUser}! سجل دخولك للانضمام`);
}

// Initial render
renderUsers();
