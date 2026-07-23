// ربط الأحداث فور تحميل العناصر
window.addEventListener('DOMContentLoaded', () => {
    const videoUrl = document.getElementById('videoUrl');
    const loadBtn = document.getElementById('loadBtn');
    const loading = document.getElementById('loading');
    const videoSection = document.getElementById('videoSection');
    const videoPlayer = document.getElementById('videoPlayer');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMsg = document.getElementById('errorMsg');

    let currentDownloadUrl = '';

    // عند الضغط على Enter في مربع النص
    videoUrl.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') processVideo();
    });

    // عند الضغط على الزر
    loadBtn.addEventListener('click', processVideo);

    // عند الضغط على زر التحميل
    downloadBtn.addEventListener('click', () => {
        if (currentDownloadUrl) {
            window.open(currentDownloadUrl, '_blank');
        }
    });

    async function processVideo() {
        let rawUrl = videoUrl.value ? videoUrl.value.trim() : '';

        resetUI();

        if (!rawUrl) {
            showError('❌ يرجى وضع رابط الفيديو أولاً');
            return;
        }

        // إضافة https إذا لم تكن موجودة
        if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
            rawUrl = 'https://' + rawUrl;
        }

        loading.classList.remove('hidden');

        try {
            // 1. التحقق إذا كان الرابط هو YouTube
            const ytId = extractYouTubeId(rawUrl);
            if (ytId) {
                playYouTube(ytId);
                return;
            }

            // 2. التحقق إذا كان الرابط هو TikTok
            if (rawUrl.includes('tiktok.com')) {
                await playTikTok(rawUrl);
                return;
            }

            // 3. إذا كان رابط فيديو مباشر MP4
            playDirectVideo(rawUrl, rawUrl);

        } catch (err) {
            loading.classList.add('hidden');
            showError('❌ حدث خطأ أثناء تشغيل الفيديو. تأكد من صحة الرابط.');
            console.error(err);
        }
    }

    // استخراج ID يوتيوب بدقة من أي رابط (بما فيها روابط shorts و youtu.be)
    function extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2] && match[2].length === 11) {
            return match[2];
        }
        return null;
    }

    // تشغيل يوتيوب
    function playYouTube(id) {
        loading.classList.add('hidden');
        videoPlayer.classList.add('hidden');
        videoPlayer.src = '';

        youtubePlayer.classList.remove('hidden');
        youtubePlayer.src = `https://www.youtube.com/embed/${id}?autoplay=1`;

        currentDownloadUrl = `https://ssyoutube.com/watch?v=${id}`;
        videoSection.classList.remove('hidden');
    }

    // تشغيل تيك توك
    async function playTikTok(url) {
        try {
            const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
            const result = await response.json();

            if (result && result.data && result.data.play) {
                playDirectVideo(result.data.play, result.data.play);
            } else {
                throw new Error('لم يتم العثور على الفيديو');
            }
        } catch (e) {
            loading.classList.add('hidden');
            showError('❌ تعذر جلب فيديو تيك توك، جرب رابطاً آخر');
        }
    }

    // تشغيل الميديا المباشرة
    function playDirectVideo(playSrc, downloadSrc) {
        loading.classList.add('hidden');
        youtubePlayer.classList.add('hidden');
        youtubePlayer.src = '';

        videoPlayer.classList.remove('hidden');
        videoPlayer.src = playSrc;

        currentDownloadUrl = downloadSrc;
        videoSection.classList.remove('hidden');

        videoPlayer.play().catch(() => {});
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }

    function resetUI() {
        loading.classList.add('hidden');
        videoSection.classList.add('hidden');
        errorMsg.classList.add('hidden');
        videoPlayer.src = '';
        youtubePlayer.src = '';
        currentDownloadUrl = '';
    }
});
