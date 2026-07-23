const videoUrl = document.getElementById('videoUrl');
const loadBtn = document.getElementById('loadBtn');
const loading = document.getElementById('loading');
const videoSection = document.getElementById('videoSection');
const videoPlayer = document.getElementById('videoPlayer');
const downloadBtn = document.getElementById('downloadBtn');
const errorMsg = document.getElementById('errorMsg');

// Press Enter to trigger search
videoUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadVideo();
});

loadBtn.addEventListener('click', loadVideo);

async function loadVideo() {
    let url = videoUrl.value.trim();
    
    // Clean up URL if there are leading slashes or bad input
    url = url.replace(/^\/+/, '');

    hideAll();

    if (!url) {
        showError('❌ الرجاء إدخال رابط الفيديو');
        return;
    }

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    if (!isValidUrl(url)) {
        showError('❌ الرابط غير صالح، تأكد منه');
        return;
    }

    // Show loading UI
    loading.classList.remove('hidden');

    try {
        // Handle direct video links (.mp4)
        if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
            setupPlayer(url, url);
            return;
        }

        // Handle TikTok links using TikWm API
        if (url.includes('tiktok.com')) {
            const apiRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
            const data = await apiRes.json();

            if (data.code === 0 && data.data && data.data.play) {
                // play is direct video stream
                const directVideoUrl = data.data.play; 
                setupPlayer(directVideoUrl, directVideoUrl);
            } else {
                throw new Error(data.msg || 'تعذر استخراج الفيديو من TikTok');
            }
            return;
        }

        // Fallback for general video links
        setupPlayer(url, url);

    } catch (err) {
        loading.classList.add('hidden');
        showError(`❌ فشل تحميل الفيديو: ${err.message || 'تأكد من صحة الرابط وسرعة الاتصال'}`);
    }
}

function setupPlayer(playSrc, downloadSrc) {
    loading.classList.add('hidden');

    // Set video source
    videoPlayer.src = playSrc;
    
    // Clear previous error listener dynamically
    videoPlayer.onerror = null;

    // Set download button action
    downloadBtn.onclick = () => downloadVideo(downloadSrc);

    // Show video section
    videoSection.classList.remove('hidden');

    // Try playing
    videoPlayer.play().catch(() => {
        // Autoplay policy prevented playback, user can tap play button manually
    });
}

function downloadVideo(url) {
    // Direct open / trigger download via tab to avoid CORS blocks
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = `video_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
}

function hideAll() {
    loading.classList.add('hidden');
    videoSection.classList.add('hidden');
    errorMsg.classList.add('hidden');
    videoPlayer.src = '';
}
