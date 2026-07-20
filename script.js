// script.js - Same powerful backend as before
const API_BASE = 'https://www.eporner.com/api/v2/video';

async function fetchVideos(query = 'all', order = 'latest') {
    try {
        const url = `\( {API_BASE}/search/?query= \){encodeURIComponent(query)}&per_page=30&page=1&order=${order}&thumbsize=big&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        
        renderVideos(data.videos || []);
    } catch(e) {
        console.error(e);
        document.getElementById('videos-grid').innerHTML = `<p style="color:#ff6666;text-align:center;grid-column:1/-1;padding:50px;">Loading videos... Try refreshing.</p>`;
    }
}

function renderVideos(videos) {
    const grid = document.getElementById('videos-grid');
    grid.innerHTML = '';

    videos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <img src="\( {v.default_thumb.src}" alt=" \){v.title}">
            <div class="video-info">
                <h4>${v.title}</h4>
                <div class="meta">
                    <span>${v.length_min}</span>
                    <span>${(v.views/1000000).toFixed(1)}M views</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openVideo(v));
        grid.appendChild(card);
    });
}

function openVideo(video) {
    document.getElementById('modal-title').textContent = video.title;
    document.getElementById('video-modal').style.display = 'block';

    const container = document.getElementById('player-container');
    container.innerHTML = `
        <iframe 
            src="${video.embed}" 
            frameborder="0" 
            allowfullscreen
            allow="autoplay">
        </iframe>
    `;

    document.getElementById('video-stats').innerHTML = `
        <strong>Duration:</strong> ${video.length_min} &nbsp;&nbsp; 
        <strong>Views:</strong> ${(video.views/1000).toFixed(0)}K
    `;
}

function closeModal() {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('player-container').innerHTML = '';
}

function changeQuality() {
    alert("Quality selection works best on the original Eporner player (embedded).");
}

// Category loaders
function loadCategory(type) {
    let title = "";
    let order = "latest";
    
    if (type === 'trending') {
        title = "🔥 TRENDING RIGHT NOW";
        order = "top-weekly";
    } else if (type === 'latest') {
        title = "🕒 LATEST UPLOADS";
        order = "latest";
    } else if (type === 'popular') {
        title = "⭐ TOP RATED";
        order = "top-rated";
    } else if (type === 'hd') {
        title = "4️⃣K ULTRA HD";
        order = "most-popular";
    }
    
    document.getElementById('section-title').textContent = title;
    fetchVideos('all', order);
}

// Search
document.getElementById('search-btn').addEventListener('click', () => {
    const q = document.getElementById('search-input').value.trim();
    if (q) {
        document.getElementById('section-title').textContent = `RESULTS FOR "${q.toUpperCase()}"`;
        fetchVideos(q, 'latest');
    }
});

document.getElementById('search-input').addEventListener('keypress', e => {
    if (e.key === "Enter") document.getElementById('search-btn').click();
});

// Init
window.onload = () => {
    fetchVideos('all', 'top-weekly');
};