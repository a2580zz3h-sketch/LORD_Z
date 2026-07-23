window.addEventListener('DOMContentLoaded', () => {
  const videoUrlInput = document.getElementById('videoUrl');
  const loadBtn = document.getElementById('loadBtn');
  const videoSection = document.getElementById('videoSection');
  const youtubePlayer = document.getElementById('youtubePlayer');
  const videoPlayer = document.getElementById('videoPlayer');
  const downloadBtn = document.getElementById('downloadBtn');
  const errorMsg = document.getElementById('errorMsg');
  const platformBtns = document.querySelectorAll('.platform-btn');

  let currentPlatform = 'auto';
  let singleDownloadUrl = ''; // رابط التحميل الوحيد المعتمد

  // اختيار المنصة
  platformBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      platformBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPlatform = btn.dataset.platform;
    });
  });

  loadBtn.addEventListener('click', processVideo);
  videoUrlInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') processVideo();
  });

  // تنفيذ طريقة التحميل الواحدة المباشرة
  downloadBtn.addEventListener('click', () => {
    if (singleDownloadUrl) {
      window.open(singleDownloadUrl, '_blank');
    } else {
      showError('❌ لا يوجد رابط للتحميل حالياً');
    }
  });

  async function processVideo() {
    let url = videoUrlInput.value ? videoUrlInput.value.trim() : '';
    resetUI();

    if (!url) {
      showError('❌ يرجى إدخال رابط الفيديو أولاً');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    const isTikTok = url.includes('tiktok.com');

    try {
      // 1. يوتيوب
      if ((currentPlatform === 'youtube' || currentPlatform === 'auto') && isYouTube) {
        const ytId = extractYouTubeId(url);
        if (ytId) {
          youtubePlayer.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
          youtubePlayer.classList.remove('hidden');
          singleDownloadUrl = `https://ssyoutube.com/watch?v=${ytId}`; // طريقة التحميل الموحدة
          videoSection.classList.remove('hidden');
          return;
        }
      }

      // 2. تيك توك
      if ((currentPlatform === 'tiktok' || currentPlatform === 'auto') && isTikTok) {
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result && result.data && result.data.play) {
          playDirectVideo(result.data.play, result.data.play);
          return;
        } else {
          throw new Error('تعذر جلب فيديو تيك توك');
        }
      }

      // 3. الفيديو المباشر
      playDirectVideo(url, url);

    } catch (err) {
      showError('❌ تعذر تشغيل الفيديو. تأكد من صحة الرابط.');
    }
  }

  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
  }

  function playDirectVideo(playSrc, downloadSrc) {
    videoPlayer.src = playSrc;
    videoPlayer.classList.remove('hidden');
    singleDownloadUrl = downloadSrc; // تعيين رابط التحميل الموحد
    videoSection.classList.remove('hidden');
    videoPlayer.play().catch(() => {});
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
  }

  function resetUI() {
    errorMsg.classList.add('hidden');
    videoSection.classList.add('hidden');
    youtubePlayer.classList.add('hidden');
    videoPlayer.classList.add('hidden');
    youtubePlayer.src = '';
    videoPlayer.src = '';
    singleDownloadUrl = '';
  }
});
