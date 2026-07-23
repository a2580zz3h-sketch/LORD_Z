/* ============ Azkar Data ============ */
const azkarDB = {
  afterPrayer: {
    icon: '🕌',
    title: 'أذكار بعد الصلاة',
    desc: 'ما يقال بعد كل صلاة مكتوبة',
    items: [
      { text: 'أَسْتَغْفِرُ اللَّهَ', count: 3, fadl: 'قال النبي ﷺ: «من استغفر الله بعد كل صلاة ثلاث مرات قال الله: قد غفرت لك»' },
      { text: 'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', count: 1, fadl: 'يقال بعد السلام من الصلاة المكتوبة' },
      { text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 1, fadl: 'من قالها بعد صلاة المغرب والفجر مائة مرة كانت له عدة رقاب من ولد إسماعيل' },
      { text: 'سُبْحَانَ اللَّهِ', count: 33, fadl: 'يقال بعد كل صلاة مكتوبة ثلاثًا وثلاثين مرة' },
      { text: 'الْحَمْدُ لِلَّهِ', count: 33, fadl: 'يقال بعد كل صلاة مكتوبة ثلاثًا وثلاثين مرة' },
      { text: 'اللَّهُ أَكْبَرُ', count: 33, fadl: 'يقال بعد كل صلاة مكتوبة ثلاثًا وثلاثين مرة' },
      { text: 'لَا إِلَهَ إِلَّا اللَّهُ', count: 1, fadl: 'تُختم بها التسبيحات بعد الصلاة' },
      { title: 'آيَةُ الْكُرْسِيّ', text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', count: 1, fadl: 'من قرأها بعد كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا الموت، ومن قرأها حين يمسي كان في حفظ الله حتى يصبح، ومن قرأها حين يصبح كان في حفظ الله حتى يمسي' },
      { text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', count: 3, fadl: 'قال النبي ﷺ: «قل هو الله أحد تعدل ثلث القرآن»' },
      { text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', count: 3, fadl: 'قال النبي ﷺ: «قل هو الله أحد والمعوذتين حين تمسي وحين تصبح ثلاث مرات تكفيك من كل شيء»' },
      { text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ', count: 3, fadl: 'قال النبي ﷺ: «قل هو الله أحد والمعوذتين حين تمسي وحين تصبح ثلاث مرات تكفيك من كل شيء»' }
    ]
  },
  morning: {
    icon: '🌅',
    title: 'أذكار الصباح',
    desc: 'ما يقال بين طلوع الشمس وزوالها',
    items: [
      { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 1, fadl: 'من قالها حين يصبح كان له أجر صدقة' },
      { text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ', count: 1, fadl: 'من قالها أصبح في حفظ الله' },
      { text: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ', count: 1, fadl: 'من قالها أصبح شاكرًا' },
      { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا', count: 1, fadl: 'دعاء النبي ﷺ في الصباح' },
      { text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', count: 3, fadl: 'الاستعاذة من الشيطان' },
      { text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ', count: 3, fadl: 'من قالها ثلاث مرات حين يصبح وثلاث حين يمسي لم يضره شيء' },
      { text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا', count: 3, fadl: 'من قالها حين يصبح وحين يمسي كان حقًا على الله أن يرضيه' },
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ', count: 3, fadl: 'من قالها ثلاث مرات غفرت له ذنوبه ولو كانت مثل زبد البحر' }
    ]
  },
  evening: {
    icon: '🌙',
    title: 'أذكار المساء',
    desc: 'ما يقال بين العصر والمغرب',
    items: [
      { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 1, fadl: 'من قالها حين يمسي كان له أجر صدقة' },
      { text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ', count: 1, fadl: 'من قالها أمسى في حفظ الله' },
      { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ، فَتْحَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا، وَهُدَاهَا', count: 1, fadl: 'دعاء المساء المستجاب' },
      { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3, fadl: 'من قالها حين يمسي لم يضره سمٌّ ولا سحر' },
      { text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ', count: 3, fadl: 'من قالها ثلاث مرات حين يمسي لم يضره شيء' },
      { text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا', count: 3, fadl: 'من قالها حين يمسي كان حقًا على الله أن يرضيه' },
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100, fadl: 'من قالها مئة مرة غفرت له ذنوبه ولو كانت مثل زبد البحر' },
      { text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 10, fadl: 'من قالها عشر مرات كتب له عشر حسنات ومحا عنه عشر سيئات' }
    ]
  },
  sleep: {
    icon: '🛌',
    title: 'أذكار النوم',
    desc: 'ما يقال قبل النوم',
    items: [
      { text: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا', count: 1, fadl: 'دعاء النبي ﷺ عند النوم' },
      { text: 'سُبْحَانَ اللَّهِ', count: 33, fadl: 'التسبيح قبل النوم' },
      { text: 'الْحَمْدُ لِلَّهِ', count: 33, fadl: 'التحميد قبل النوم' },
      { text: 'اللَّهُ أَكْبَرُ', count: 34, fadl: 'التكبير قبل النوم، مجموعها 100' },
      { text: 'بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', count: 1, fadl: 'من قالها استيقظ من نومه فليستغفر' },
      { text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ', count: 1, fadl: 'من قالها أعطاه الله ما يشاء' },
      { text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', count: 3, fadl: 'دعاء النبي ﷺ قبل النوم' },
      { text: 'اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا', count: 1, fadl: 'دعاء النبي ﷺ عند النوم' }
    ]
  }
};

/* ============ State ============ */
let currentCat = 'afterPrayer';
let counts = {}; // { catIndex: currentCount }
let surahs = [];
let currentView = 'azkar'; // 'azkar', 'quranList', 'quranAyat'

/* ============ DOM Elements ============ */
const tabs = document.getElementById('tabs');
const catIcon = document.getElementById('catIcon');
const catTitle = document.getElementById('catTitle');
const catDesc = document.getElementById('catDesc');
const azkarList = document.getElementById('azkarList');
const progressFill = document.getElementById('progressFill');
const resetCatBtn = document.getElementById('resetCatBtn');
const azkarView = document.getElementById('azkarView');
const quranView = document.getElementById('quranView');
const ayatView = document.getElementById('ayatView');
const surahList = document.getElementById('surahList');
const quranLoading = document.getElementById('quranLoading');
const ayatLoading = document.getElementById('ayatLoading');
const surahTitle = document.getElementById('surahTitle');
const surahTitleMeta = document.getElementById('surahTitleMeta');
const ayatText = document.getElementById('ayatText');

/* ============ View Switching ============ */
function showView(view) {
  currentView = view;
  azkarView.hidden = true;
  quranView.hidden = true;
  ayatView.hidden = true;
  if (listenView) listenView.hidden = true;

  if (view === 'azkar') {
    azkarView.hidden = false;
    tabs.style.display = 'flex';
    document.querySelector('.quran-cta').style.display = 'flex';
  } else if (view === 'quranList') {
    quranView.hidden = false;
    tabs.style.display = 'none';
    document.querySelector('.quran-cta').style.display = 'none';
    if (surahs.length === 0) loadSurahs();
  } else if (view === 'quranAyat') {
    ayatView.hidden = false;
    tabs.style.display = 'none';
    document.querySelector('.quran-cta').style.display = 'none';
  } else if (view === 'listen') {
    listenView.hidden = false;
    tabs.style.display = 'none';
    document.querySelector('.quran-cta').style.display = 'none';
    if (listenSurahList.children.length === 0) loadListenSurahs();
  }
}

/* ============ Render Azkar ============ */
function renderAzkar(cat) {
  currentCat = cat;
  const data = azkarDB[cat];

  catIcon.textContent = data.icon;
  catTitle.textContent = data.title;
  catDesc.textContent = data.desc;

  azkarList.innerHTML = '';

  data.items.forEach((item, idx) => {
    const key = cat + '_' + idx;
    const current = counts[key] || 0;
    const isDone = current >= item.count;

    const li = document.createElement('li');
    li.className = 'zikr-card' + (isDone ? ' done' : '');
    li.innerHTML = `
      <span class="zikr-index">${idx + 1}</span>
      ${item.title ? `<h3 class="zikr-title">${item.title}</h3>` : ''}
      <p class="zikr-text">${item.text}</p>
      ${item.fadl ? `<p class="zikr-fadl">${item.fadl}</p>` : ''}
      <div class="zikr-footer">
        <button class="count-btn" data-key="${key}" data-count="${item.count}" ${isDone ? 'disabled' : ''}>
          <span>${isDone ? '✓ تم' : 'تسبيح'}</span>
          <span class="count-badge">${current} / ${item.count}</span>
        </button>

      </div>
    `;
    azkarList.appendChild(li);
  });

  updateProgress();
  attachCountHandlers();
}

function updateProgress() {
  const data = azkarDB[currentCat];
  let total = 0;
  let done = 0;
  data.items.forEach((item, idx) => {
    total += item.count;
    done += Math.min(counts[currentCat + '_' + idx] || 0, item.count);
  });
  const pct = total > 0 ? (done / total) * 100 : 0;
  progressFill.style.width = pct + '%';
}

function attachCountHandlers() {
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const max = parseInt(btn.dataset.count, 10);
      const current = (counts[key] || 0) + 1;
      counts[key] = current;
      renderAzkar(currentCat);
    });
  });
}

/* ============ Tabs ============ */
tabs.addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAzkar(btn.dataset.cat);
});

/* ============ Reset Category ============ */
resetCatBtn.addEventListener('click', () => {
  const data = azkarDB[currentCat];
  data.items.forEach((_, idx) => {
    delete counts[currentCat + '_' + idx];
  });
  renderAzkar(currentCat);
});

/* ============ Quran in Main Area ============ */
const openQuran = document.getElementById('openQuran');
const backToAzkar = document.getElementById('backToAzkar');
const backToSurahList = document.getElementById('backToSurahList');

openQuran.addEventListener('click', () => {
  showView('quranList');
});

backToAzkar.addEventListener('click', () => {
  showView('azkar');
});

backToSurahList.addEventListener('click', () => {
  showView('quranList');
});

async function loadSurahs() {
  quranLoading.hidden = false;
  surahList.innerHTML = '';
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    const json = await res.json();
    surahs = json.data;
    renderSurahList();
  } catch (err) {
    surahList.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--ink-soft);">تعذر تحميل السور. تأكد من الاتصال بالإنترنت.<br><button onclick="loadSurahs()" style="margin-top:16px;background:var(--teal);color:var(--parchment);border:none;padding:10px 26px;border-radius:999px;font-weight:700;cursor:pointer;font-family:var(--font-body);">إعادة المحاولة</button></div>';
  } finally {
    quranLoading.hidden = true;
  }
}

function renderSurahList() {
  surahList.innerHTML = '';
  surahs.forEach(s => {
    const li = document.createElement('li');
    li.className = 'surah-item';
    li.innerHTML = `
      <span class="surah-num">${s.number}</span>
      <div class="surah-info">
        <div class="surah-name-ar">${s.name}</div>
        <div class="surah-meta">${s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · ${s.numberOfAyahs} آية</div>
      </div>
    `;
    li.addEventListener('click', () => loadAyat(s.number));
    surahList.appendChild(li);
  });
}

async function loadAyat(surahNum) {
  showView('quranAyat');
  ayatLoading.hidden = false;
  ayatText.innerHTML = '';
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}`);
    const json = await res.json();
    const data = json.data;
    surahTitle.textContent = data.name;
    surahTitleMeta.textContent = `${data.revelationType === 'Meccan' ? 'سورة مكية' : 'سورة مدنية'} · ${data.numberOfAyahs} آية`;

    let html = '';
    if (data.number !== 9) {
      html += '<span class="bismillah">صل على سيدنا محمد ﷺ</span>';
    }
    data.ayahs.forEach(a => {
      html += `${a.text} <span class="ayah-num">${a.numberInSurah}</span> `;
    });
    ayatText.innerHTML = html;
  } catch (err) {
    ayatText.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--ink-soft);">تعذر تحميل الآيات. تأكد من الاتصال بالإنترنت.</div>';
  } finally {
    ayatLoading.hidden = true;
  }
}


/* ============ Listen (Audio) View ============ */
const listenView = document.getElementById('listenView');
const listenSurahList = document.getElementById('listenSurahList');
const listenLoading = document.getElementById('listenLoading');
const audioPlayerBar = document.getElementById('audioPlayerBar');
const quranAudio = document.getElementById('quranAudio');
const playerSurahName = document.getElementById('playerSurahName');
const closePlayer = document.getElementById('closePlayer');
const openListen = document.getElementById('openListen');
const backToAzkarFromListen = document.getElementById('backToAzkarFromListen');

const RECITER = {
  name: 'المنشاوي',
  server: 'server10',
  folder: 'minsh'
};

let currentPlayingSurah = null;

openListen.addEventListener('click', () => {
  showView('listen');
});

backToAzkarFromListen.addEventListener('click', () => {
  showView('azkar');
});

closePlayer.addEventListener('click', () => {
  quranAudio.pause();
  quranAudio.src = '';
  audioPlayerBar.hidden = true;
  currentPlayingSurah = null;
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.textContent = '▶';
    btn.classList.remove('playing');
  });
});

function getAudioUrl(surahNum) {
  const padded = String(surahNum).padStart(3, '0');
  return `https://${RECITER.server}.mp3quran.net/${RECITER.folder}/${padded}.mp3`;
}

function playSurahAudio(surahNum, surahName, btn) {
  const url = getAudioUrl(surahNum);

  document.querySelectorAll('.play-btn').forEach(b => {
    b.textContent = '▶';
    b.classList.remove('playing');
  });

  if (currentPlayingSurah === surahNum && !quranAudio.paused) {
    quranAudio.pause();
    audioPlayerBar.hidden = true;
    currentPlayingSurah = null;
    return;
  }

  quranAudio.src = url;
  quranAudio.play().catch(err => {
    console.error('Audio play failed:', err);
  });

  playerSurahName.textContent = surahName;
  audioPlayerBar.hidden = false;
  currentPlayingSurah = surahNum;

  btn.textContent = '⏸';
  btn.classList.add('playing');
}

async function loadListenSurahs() {
  listenLoading.hidden = false;
  listenSurahList.innerHTML = '';
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    const json = await res.json();
    const surahs = json.data;

    listenSurahList.innerHTML = '';
    surahs.forEach(s => {
      const li = document.createElement('li');
      li.className = 'surah-item';
      li.innerHTML = `
        <span class="surah-num">${s.number}</span>
        <div class="surah-info">
          <div class="surah-name-ar">${s.name}</div>
          <div class="surah-meta">${s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · ${s.numberOfAyahs} آية</div>
        </div>
        <div class="surah-actions">
          <button class="play-btn" data-num="${s.number}" data-name="${s.name}" title="استماع">▶</button>
          <a class="download-btn" href="${getAudioUrl(s.number)}" download="${s.name}.mp3" title="تحميل السورة">⬇</a>
        </div>
      `;

      const playBtn = li.querySelector('.play-btn');
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        playSurahAudio(s.number, s.name, playBtn);
      });

      listenSurahList.appendChild(li);
    });
  } catch (err) {
    listenSurahList.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--ink-soft);">تعذر تحميل السور. تأكد من الاتصال بالإنترنت.<br><button onclick="loadListenSurahs()" style="margin-top:16px;background:var(--teal);color:var(--parchment);border:none;padding:10px 26px;border-radius:999px;font-weight:700;cursor:pointer;font-family:var(--font-body);">إعادة المحاولة</button></div>';
  } finally {
    listenLoading.hidden = true;
  }
}


/* ============ Developer Modal ============ */
const openDevModal = document.getElementById('openDevModal');
const closeDevModal = document.getElementById('closeDevModal');
const devModalOverlay = document.getElementById('devModalOverlay');

openDevModal.addEventListener('click', () => {
  devModalOverlay.classList.add('open');
});

closeDevModal.addEventListener('click', () => {
  devModalOverlay.classList.remove('open');
});

devModalOverlay.addEventListener('click', (e) => {
  if (e.target === devModalOverlay) {
    devModalOverlay.classList.remove('open');
  }
});

/* ============ Tasbih Drawer ============ */
const tasbihFab = document.getElementById('openTasbih');
const tasbihOverlay = document.getElementById('tasbihOverlay');
const closeTasbih = document.getElementById('closeTasbih');
const dhikrSelect = document.getElementById('dhikrSelect');
const currentDhikrText = document.getElementById('currentDhikrText');
const counterNumber = document.getElementById('counterNumber');
const counterRound = document.getElementById('counterRound');
const ringFg = document.getElementById('ringFg');
const counterMinus = document.getElementById('counterMinus');
const counterReset = document.getElementById('counterReset');
const dragBead = document.getElementById('dragBead');
const beadsTrack = document.getElementById('beadsTrack');

let tasbihCount = 0;
let tasbihRound = 1;
let currentDhikr = 'سُبْحَانَ اللَّهِ';
const ROUND_TARGET = 33;

function updateTasbihUI() {
  counterNumber.textContent = tasbihCount;
  counterRound.textContent = 'الدورة: ' + tasbihRound;
  const offset = 326.7 - (tasbihCount / ROUND_TARGET) * 326.7;
  ringFg.style.strokeDashoffset = Math.max(0, offset);
}

tasbihFab.addEventListener('click', () => {
  tasbihOverlay.classList.add('open');
});

closeTasbih.addEventListener('click', () => {
  tasbihOverlay.classList.remove('open');
});

dhikrSelect.addEventListener('click', e => {
  const chip = e.target.closest('.dhikr-chip');
  if (!chip) return;
  document.querySelectorAll('.dhikr-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentDhikr = chip.dataset.text;
  currentDhikrText.textContent = currentDhikr;
});

function incrementTasbih() {
  tasbihCount++;
  if (tasbihCount > ROUND_TARGET) {
    tasbihCount = 1;
    tasbihRound++;
  }
  updateTasbihUI();
}

counterMinus.addEventListener('click', () => {
  if (tasbihCount > 0) {
    tasbihCount--;
    updateTasbihUI();
  }
});

counterReset.addEventListener('click', () => {
  tasbihCount = 0;
  tasbihRound = 1;
  updateTasbihUI();
});

/* Drag bead interaction */
let isDragging = false;
let startY = 0;
let startTop = 16;

dragBead.addEventListener('pointerdown', e => {
  isDragging = true;
  startY = e.clientY;
  startTop = parseFloat(getComputedStyle(dragBead).top) || 16;
  dragBead.setPointerCapture(e.pointerId);
  dragBead.style.transition = 'none';
});

dragBead.addEventListener('pointermove', e => {
  if (!isDragging) return;
  const delta = e.clientY - startY;
  const trackHeight = beadsTrack.clientHeight;
  const beadHeight = dragBead.clientHeight;
  const maxTop = trackHeight - beadHeight - 14;
  let newTop = startTop + delta;
  newTop = Math.max(16, Math.min(newTop, maxTop));
  dragBead.style.top = newTop + 'px';
});

function snapBeadBack() {
  dragBead.style.transition = 'top .35s cubic-bezier(.34,1.56,.64,1)';
  dragBead.style.top = '16px';
}

dragBead.addEventListener('pointerup', e => {
  if (!isDragging) {
    incrementTasbih();
    return;
  }
  isDragging = false;
  const trackHeight = beadsTrack.clientHeight;
  const currentTop = parseFloat(getComputedStyle(dragBead).top) || 16;
  const threshold = trackHeight * 0.55;

  if (currentTop > threshold) {
    incrementTasbih();
  }
  snapBeadBack();
});

dragBead.addEventListener('click', () => {
  if (!isDragging) incrementTasbih();
});

/* ============ Init ============ */
renderAzkar('afterPrayer');
updateTasbihUI();
