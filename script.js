document.addEventListener('DOMContentLoaded', () => {
    const videoUrl = document.getElementById('videoUrl');
    const loadBtn = document.getElementById('loadBtn');
    const loading = document.getElementById('loading');
    const videoSection = document.getElementById('videoSection');
    const videoPlayer = document.getElementById('videoPlayer');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMsg = document.getElementById('errorMsg');

    let currentDownloadUrl = '';

    // التشغيل عند الضغط على زر Enter
    videoUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadVideo();
    });

    // التشغيل عند الضغط على زر "عرض الفيديو"
    loadBtn.addEventListener('click', loadVideo);

    // حدث زر التنزيل
    downloadBtn.addEventListener('click', () => {
        if (currentDownloadUrl) {
            window.open(currentDownloadUrl, '_blank');
        }
    });

    async function loadVideo() {
        let url = videoUrl.value.trim();
        
        // تنظيف الرابط من أي شرطات مائلة في البداية
        url = url.replace(/^\/+/, '');

        hideAll();

        if (!url) {
            showError('❌ الرجاء إدخال رابط الفيديو');
            return;
        }

        // إضافة البرتوكول إذا كان مفقوداً
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        loading.classList.remove('hidden');

        try {
            // 1. التعامل مع روابط يوتيوب
            const youtubeId = getYouTubeId(url);
            if (youtubeId) {
                setupYouTubePlayer(youtubeId);
                return;
            }

            // 2. التعامل مع روابط تيك توك
            if (url.includes('tiktok.com')) {
                const apiRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
                const data = await apiRes.json();

                if (data.code === 0 && data.data && data.data.play) {
                    setupNativePlayer(data.data.play, data.data.play);
                } else {
                    throw new Error('تعذر استخراج الفيديو من TikTok، تأكد من صحة الرابط');
                }
                return;
            }

            // 3. الفيديوهات المباشرة العادية (.mp4)
            setupNativePlayer(url, url);

        } catch (err) {
            loading.classList.add('hidden');
            showError(`❌ فشل تحميل الفيديو: ${err.message || 'تأكد من الاتصال بالإنترنت'}`);
        }
    }

    // استخراج ID يوتيوب وتنظيفه من أي زيادات
    function getYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2] && match[2].length === 11) ? match[2] : null;
    }

    // تشغيل فيديو تيك توك أو MP4
    function setupNativePlayer(playSrc, downloadSrc) {
        loading.classList.add('hidden');
        
        youtubePlayer.classList.add('hidden');
        youtubePlayer.src = '';
        
        videoPlayer.classList.remove('hidden');
        videoPlayer.src = playSrc;

        currentDownloadUrl = downloadSrc;
        videoSection.classList.remove('hidden');

        videoPlayer.play().catch(() => {});
    }

    // تشغيل فيديو يوتيوب
    function setupYouTubePlayer(videoId) {
        loading.classList.add('hidden');

        videoPlayer.classList.add('hidden');
        videoPlayer.src = '';

        youtubePlayer.classList.remove('hidden');
        youtubePlayer.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

        currentDownloadUrl = `https://ssyoutube.com/watch?v=${videoId}`;
        videoSection.classList.remove('hidden');
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
        currentDownloadUrl = '';
    }
});
