const videoUrl = document.getElementById('videoUrl');
const loadBtn = document.getElementById('loadBtn');
const loading = document.getElementById('loading');
const videoSection = document.getElementById('videoSection');
const videoPlayer = document.getElementById('videoPlayer');
const youtubePlayer = document.getElementById('youtubePlayer');
const downloadBtn = document.getElementById('downloadBtn');
const errorMsg = document.getElementById('errorMsg');

// تشغيل عند الضغط على Enter
videoUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadVideo();
});

loadBtn.addEventListener('click', loadVideo);

async function loadVideo() {
    let url = videoUrl.value.trim();
    
    // تنظيف الرابط من أي شرطات زائدة في البداية
    url = url.replace(/^\/+/, '');

    hideAll();

    if (!url) {
        showError('❌ الرجاء إدخال رابط الفيديو');
        return;
    }

    // إضافة البروتوكول إذا كان مفقوداً
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    if (!isValidUrl(url)) {
        showError('❌ الرابط غير صالح، تأكد منه');
        return;
    }

    loading.classList.remove('hidden');

    try {
        // 1. التعامل مع روابط YouTube
        const youtubeId = getYouTubeId(url);
        if (youtubeId) {
            setupYouTubePlayer(youtubeId);
            return;
        }

        // 2. التعامل مع روابط TikTok
        if (url.includes('tiktok.com')) {
            const apiRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
            
            // التأكد من أن الرد أتى بفرصة JSON وليس HTML لمنع الخطأ
            const contentType = apiRes.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("تعذر جلب الفيديو من السيرفر. جرب رابطاً آخر.");
            }

            const data = await apiRes.json();

            if (data.code === 0 && data.data && data.data.play) {
                setupNativePlayer(data.data.play, data.data.play);
            } else {
                throw new Error(data.msg || 'تعذر استخراج الفيديو من TikTok');
            }
            return;
        }

        // 3. الفيديوهات المباشرة العادية (.mp4)
        setupNativePlayer(url, url);

    } catch (err) {
        loading.classList.add('hidden');
        showError(`❌ فشل تحميل الفيديو: ${err.message || 'تأكد من صحة الرابط'}`);
    }
}

// استخراج ID فيديو يوتيوب وتنظيفه من أي معلمات إضافية مثل ?si=...
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
        return match[2];
    }
    return null;
}

// إعداد مشغل الميديا العادي (MP4 / TikTok)
function setupNativePlayer(playSrc, downloadSrc) {
    loading.classList.add('hidden');
    
    youtubePlayer.classList.add('hidden');
    youtubePlayer.src = '';
    
    videoPlayer.classList.remove('hidden');
    videoPlayer.src = playSrc;

    downloadBtn.onclick = () => downloadVideo(downloadSrc);
    videoSection.classList.remove('hidden');

    videoPlayer.play().catch(() => {});
}

// إعداد مشغل YouTube المعدل مع نطاق nocookie
function setupYouTubePlayer(videoId) {
    loading.classList.add('hidden');

    videoPlayer.classList.add('hidden');
    videoPlayer.src = '';

    youtubePlayer.classList.remove('hidden');
    
    // استخدام نطاق youtube-nocookie لتجاوز أخطاء التقييد
    youtubePlayer.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

    // توجيه التحميل ليوتيوب
    downloadBtn.onclick = () => {
        window.open(`https://ssyoutube.com/watch?v=${videoId}`, '_blank');
    };

    videoSection.classList.remove('hidden');
}

// دالة تنزيل الفيديو
function downloadVideo(url) {
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
    youtubePlayer.src = '';
}
