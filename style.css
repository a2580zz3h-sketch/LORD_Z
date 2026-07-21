/* ============ Design Tokens ============ */
:root{
  --night:#000000;
  --night-2:#0A0A0A;
  --night-3:#111417;
  --teal:#114B3F;
  --gold:#C9A24B;
  --gold-light:#E4C87A;
  --gold-glow: rgba(201,162,75,.35);
  --parchment:#F6EFDD;
  --parchment-2:#FBF7EC;
  --ink:#1E2A22;
  --ink-soft:#4B5A50;
  --line:#D8C79A;
  --done:#7FA98B;
  --shadow: 0 10px 30px rgba(0,0,0,.45);
  --radius: 18px;
  --font-display:'Amiri', serif;
  --font-body:'Tajawal', sans-serif;
}

*{box-sizing:border-box; margin:0; padding:0;}

html{scroll-behavior:smooth;}

body{
  font-family:var(--font-body);
  background:
    radial-gradient(circle at 12% -8%, rgba(201,162,75,.16), transparent 42%),
    radial-gradient(circle at 100% 12%, rgba(201,162,75,.10), transparent 45%),
    radial-gradient(circle at 50% 105%, rgba(17,75,63,.30), transparent 55%),
    var(--night);
  color:var(--ink);
  min-height:100vh;
  overflow-x:hidden;
}

/* خلفية زخرفية إسلامية هندسية على أسود تمام */
.pattern-overlay{
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:
    repeating-linear-gradient(60deg, rgba(201,162,75,.06) 0 1px, transparent 1px 46px),
    repeating-linear-gradient(120deg, rgba(201,162,75,.06) 0 1px, transparent 1px 46px),
    repeating-linear-gradient(0deg, rgba(201,162,75,.045) 0 1px, transparent 1px 46px);
  -webkit-mask-image: radial-gradient(circle at 50% 0%, #000 55%, transparent 100%);
  mask-image: radial-gradient(circle at 50% 0%, #000 55%, transparent 100%);
  opacity:.9;
}

/* ============ Header ============ */
.site-header{
  position:relative; z-index:1;
  text-align:center;
  padding:56px 20px 32px;
  color:var(--parchment);
}

.arch{
  width:110px; height:130px;
  margin:0 auto 18px;
  background:linear-gradient(180deg, var(--gold-light), var(--gold));
  border-radius:55px 55px 8px 8px;
  display:flex; align-items:flex-start; justify-content:center;
  padding:8px;
  box-shadow:0 12px 26px rgba(0,0,0,.35);
}
.arch-inner{
  width:100%; height:100%;
  background:radial-gradient(circle at 50% 30%, var(--night-3), var(--night) 75%);
  border-radius:48px 48px 4px 4px;
  display:flex; align-items:center; justify-content:center;
}
.crescent{
  font-size:2.6rem;
  color:var(--gold-light);
  text-shadow:0 0 18px rgba(228,200,122,.6);
}

.site-title{
  font-family:var(--font-display);
  font-weight:700;
  font-size:clamp(2.1rem, 5vw, 3rem);
  letter-spacing:.5px;
  color:var(--parchment);
}
.site-sub{
  margin-top:8px;
  font-size:.95rem;
  color:var(--gold-light);
  font-weight:300;
}

/* ============ Tabs ============ */
.tabs{
  position:relative; z-index:1;
  display:flex; justify-content:center; flex-wrap:wrap;
  gap:10px;
  padding:0 16px 20px;
}
.tab-btn{
  font-family:var(--font-body);
  font-weight:700;
  font-size:.95rem;
  padding:11px 22px;
  border-radius:999px;
  border:1.5px solid var(--gold);
  background:transparent;
  color:var(--gold-light);
  cursor:pointer;
  transition:all .25s ease;
}
.tab-btn:hover{background:rgba(201,162,75,.15);}
.tab-btn.active{
  background:var(--gold);
  color:var(--night);
  box-shadow:0 6px 16px rgba(201,162,75,.35);
}

/* ============ زر القرآن الكريم ============ */
.quran-cta{
  position:relative; z-index:1;
  display:flex; justify-content:center;
  padding:0 16px 26px;
}

.btn-17,
.btn-17 *,
.btn-17 :after,
.btn-17 :before,
.btn-17:after,
.btn-17:before{
  border:0 solid;
  box-sizing:border-box;
}
.btn-17{
  -webkit-tap-highlight-color:transparent;
  -webkit-appearance:button;
  background-color:var(--night-2);
  background-image:none;
  color:var(--gold-light);
  cursor:pointer;
  font-family:var(--font-body);
  font-size:100%;
  font-weight:900;
  line-height:1.5;
  margin:0;
  -webkit-mask-image:-webkit-radial-gradient(#000, #fff);
  padding:0;
  text-transform:none;
}
.btn-17:disabled{cursor:default;}
.btn-17:-moz-focusring{outline:auto;}
.btn-17 svg{display:block; vertical-align:middle;}
.btn-17 [hidden]{display:none;}
.btn-17{
  border-radius:99rem;
  border-width:2px;
  border-color:var(--gold);
  padding:.85rem 3.2rem;
  z-index:0;
  box-shadow:0 0 0 0 var(--gold-glow), 0 10px 26px rgba(0,0,0,.55);
  transition:box-shadow .3s ease, transform .15s ease;
}
.btn-17:hover{box-shadow:0 0 26px 2px var(--gold-glow), 0 10px 26px rgba(0,0,0,.55);}
.btn-17:active{transform:scale(.97);}
.btn-17,
.btn-17 .text-container{
  overflow:hidden;
  position:relative;
}
.btn-17 .text-container{
  display:block;
  mix-blend-mode:difference;
}
.btn-17 .text{
  display:flex; align-items:center; gap:8px;
  position:relative;
  font-family:var(--font-display);
  font-size:1.15rem;
  font-weight:700;
}
.btn-17:hover .text{
  animation:move-up-alternate .3s forwards;
}
@keyframes move-up-alternate{
  0%{transform:translateY(0);}
  50%{transform:translateY(80%);}
  51%{transform:translateY(-80%);}
  to{transform:translateY(0);}
}
.btn-17:after,
.btn-17:before{
  --skew:.2;
  background:var(--gold-light);
  content:"";
  display:block;
  height:102%;
  left:calc(-50% - 50% * var(--skew));
  pointer-events:none;
  position:absolute;
  top:-104%;
  transform:skew(calc(150deg * var(--skew))) translateY(var(--progress, 0));
  transition:transform .2s ease;
  width:100%;
}
.btn-17:after{
  --progress:0%;
  left:calc(50% + 50% * var(--skew));
  top:102%;
  z-index:-1;
}
.btn-17:hover:before{--progress:100%;}
.btn-17:hover:after{--progress:-102%;}

/* ============ Main content ============ */
#app{
  position:relative; z-index:1;
  max-width:760px;
  margin:0 auto;
  background:var(--parchment);
  border-radius:28px 28px 0 0;
  padding:28px 20px 60px;
  min-height:60vh;
  box-shadow:0 -10px 40px rgba(0,0,0,.25);
}

.cat-header{
  display:flex; align-items:center; gap:14px;
  border-bottom:2px dashed var(--line);
  padding-bottom:18px;
  margin-bottom:18px;
}
.cat-icon{font-size:2.2rem;}
.cat-header h2{
  font-family:var(--font-display);
  font-size:1.5rem;
  color:var(--teal);
}
.cat-desc{
  font-size:.85rem;
  color:var(--ink-soft);
  margin-top:2px;
}
.reset-cat-btn{
  margin-inline-start:auto;
  border:1px solid var(--line);
  background:var(--parchment-2);
  color:var(--ink-soft);
  border-radius:10px;
  padding:8px 12px;
  font-family:var(--font-body);
  font-size:.8rem;
  cursor:pointer;
  white-space:nowrap;
}
.reset-cat-btn:hover{background:#fff; border-color:var(--gold);}

.progress-track{
  height:6px; border-radius:999px;
  background:#E7DCBB;
  overflow:hidden;
  margin-bottom:22px;
}
.progress-fill{
  height:100%; width:0%;
  background:linear-gradient(90deg, var(--teal), var(--gold));
  transition:width .4s ease;
}

/* ============ Azkar list ============ */
.azkar-list{list-style:none; display:flex; flex-direction:column; gap:16px;}

.zikr-card{
  background:var(--parchment-2);
  border:1px solid var(--line);
  border-radius:var(--radius);
  padding:18px 20px;
  position:relative;
  transition:transform .2s ease, box-shadow .2s ease;
}
.zikr-card.done{
  border-color:var(--done);
  background:linear-gradient(180deg, #EFF7F1, var(--parchment-2));
}
.zikr-card:hover{box-shadow:var(--shadow);}

.zikr-index{
  position:absolute; top:-10px; right:16px;
  background:var(--teal);
  color:var(--parchment);
  font-size:.7rem;
  font-weight:700;
  padding:3px 10px;
  border-radius:999px;
}

.zikr-text{
  font-family:var(--font-display);
  font-size:1.18rem;
  line-height:2.15;
  color:var(--ink);
}

.zikr-fadl{
  margin-top:10px;
  font-size:.82rem;
  color:var(--ink-soft);
  border-right:3px solid var(--gold);
  padding-right:10px;
  line-height:1.9;
}

.zikr-footer{
  display:flex; align-items:center; justify-content:space-between;
  margin-top:14px;
  gap:12px;
}

.count-btn{
  display:flex; align-items:center; gap:8px;
  border:none;
  background:var(--teal);
  color:var(--parchment);
  font-family:var(--font-body);
  font-weight:700;
  font-size:.95rem;
  padding:10px 20px;
  border-radius:999px;
  cursor:pointer;
  transition:transform .12s ease, background .2s ease;
}
.count-btn:active{transform:scale(.94);}
.zikr-card.done .count-btn{background:var(--done);}

.count-badge{
  background:rgba(0,0,0,.15);
  border-radius:999px;
  padding:2px 10px;
  font-size:.85rem;
}

.mini-beads{display:flex; gap:4px;}
.mini-bead{
  width:9px; height:9px; border-radius:50%;
  background:#DCCFA2;
  transition:background .2s ease, transform .2s ease;
}
.mini-bead.on{background:var(--gold); transform:scale(1.15);}

/* ============ Floating tasbih button ============ */
.tasbih-fab{
  position:fixed; bottom:22px; left:22px; z-index:20;
  display:flex; flex-direction:column; align-items:center; gap:2px;
  background:linear-gradient(160deg, var(--gold-light), var(--gold));
  color:var(--night);
  border:none;
  width:74px; height:74px;
  border-radius:50%;
  box-shadow:0 10px 24px rgba(0,0,0,.35);
  cursor:pointer;
  font-family:var(--font-body);
}
.fab-beads{font-size:1.5rem; line-height:1;}
.fab-label{font-size:.62rem; font-weight:700;}
.tasbih-fab:hover{transform:translateY(-3px);}

/* ============ Tasbih side drawer (full screen height) ============ */
.tasbih-drawer{
  position:fixed; inset:0; z-index:50;
  background:var(--parchment);
  display:flex; flex-direction:column;
  transform:translateX(105%);
  transition:transform .38s cubic-bezier(.34,1,.64,1);
  padding:18px 18px 22px;
}
[dir="rtl"] .tasbih-drawer{transform:translateX(105%);}
.tasbih-drawer.open{transform:translateX(0);}

.close-modal{
  position:absolute; top:16px; left:16px; z-index:2;
  width:36px; height:36px; border-radius:50%;
  border:none; background:var(--teal); color:var(--parchment);
  cursor:pointer; font-size:1rem;
}

.drawer-top{text-align:center; flex-shrink:0; padding-top:6px;}
.drawer-top h3{
  font-family:var(--font-display);
  color:var(--teal);
  font-size:1.3rem;
  margin-bottom:10px;
}

.dhikr-select{
  display:flex; flex-wrap:wrap; gap:6px; justify-content:center;
  margin-bottom:8px;
}
.dhikr-chip{
  font-family:var(--font-body);
  font-size:.72rem;
  padding:6px 12px;
  border-radius:999px;
  border:1px solid var(--line);
  background:#fff;
  color:var(--ink-soft);
  cursor:pointer;
}
.dhikr-chip.active{background:var(--gold); border-color:var(--gold); color:var(--night); font-weight:700;}

.current-dhikr{
  font-family:var(--font-display);
  font-size:1.15rem;
  color:var(--ink);
  margin-bottom:10px;
}

.counter-ring{position:relative; width:96px; height:96px; margin:0 auto;}
.ring-svg{width:100%; height:100%; transform:rotate(-90deg);}
.ring-bg{fill:none; stroke:#E7DCBB; stroke-width:9;}
.ring-fg{
  fill:none; stroke:var(--gold); stroke-width:9; stroke-linecap:round;
  stroke-dasharray:326.7; stroke-dashoffset:326.7;
  transition:stroke-dashoffset .3s ease;
}
.counter-number{
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  font-family:var(--font-display);
  font-size:2rem; font-weight:700; color:var(--teal);
}
.counter-round{font-size:.72rem; color:var(--gold); font-weight:700; margin-top:4px;}

.counter-actions{display:flex; gap:8px; justify-content:center; margin-top:8px;}
.counter-actions button{
  width:34px; height:34px; border-radius:50%;
  border:1px solid var(--line); background:#fff; color:var(--ink);
  cursor:pointer; font-size:1rem;
}
.counter-actions button:hover{border-color:var(--gold);}

/* المسار الممتد على طول الشاشة — يشد زي ستارة */
.beads-track{
  position:relative;
  flex:1;
  min-height:0;
  margin:16px auto 0;
  width:min(90px, 22vw);
  background:linear-gradient(180deg, var(--teal), var(--night));
  border-radius:40px;
  overflow:hidden;
  touch-action:none;
  box-shadow:inset 0 0 18px rgba(0,0,0,.4);
}
.beads-string{
  position:absolute; left:50%; top:0; bottom:0;
  width:3px; transform:translateX(-50%);
  background:repeating-linear-gradient(180deg, var(--gold) 0 8px, transparent 8px 16px);
  opacity:.5;
}
.bead-tassel{
  position:absolute; bottom:14px; left:50%; transform:translateX(-50%);
  width:18px; height:18px; border-radius:50%;
  background:var(--gold);
  box-shadow:0 0 8px rgba(201,162,75,.7);
}
.drag-bead{
  position:absolute; left:50%; top:16px;
  transform:translateX(-50%);
  width:52px; height:52px; border-radius:50%;
  background:radial-gradient(circle at 32% 28%, var(--gold-light), var(--gold) 60%, #8a6a24 100%);
  box-shadow:0 8px 18px rgba(0,0,0,.45);
  cursor:grab;
  transition:top .35s cubic-bezier(.34,1.56,.64,1);
}
.drag-bead:active{cursor:grabbing; transition:none;}
.drag-bead.snap-back{transition:top .35s cubic-bezier(.34,1.56,.64,1);}

.drag-hint{
  text-align:center; font-size:.72rem; color:var(--ink-soft);
  margin-top:14px; flex-shrink:0;
}

/* ============ مؤشر التحميل (نبضة ذهبية) ============ */
.loading{
  display:flex; align-items:center; justify-content:center;
  padding:56px 0;
}
.loading svg polyline{
  fill:none;
  stroke-width:3;
  stroke-linecap:round;
  stroke-linejoin:round;
}
.loading svg polyline#back{
  fill:none;
  stroke:rgba(201,162,75,.18);
}
.loading svg polyline#front{
  fill:none;
  stroke:var(--gold-light);
  stroke-dasharray:48,144;
  stroke-dashoffset:192;
  animation:dash_682 2s linear infinite;
  animation-delay:0s;
}
.loading svg polyline#front2{
  fill:none;
  stroke:var(--gold);
  stroke-dasharray:48,144;
  stroke-dashoffset:192;
  animation:dash_682 2s linear infinite;
  animation-delay:1s;
}
@keyframes dash_682{
  72.5%{opacity:0;}
  to{stroke-dashoffset:0;}
}
.loading-label{
  text-align:center;
  color:var(--gold-light);
  font-size:.85rem;
  margin-top:-10px;
  padding-bottom:30px;
}

/* ============ درج القرآن الكريم ============ */
.quran-drawer{
  position:fixed; inset:0; z-index:55;
  background:var(--night);
  background-image:
    radial-gradient(circle at 15% -5%, rgba(201,162,75,.12), transparent 42%),
    radial-gradient(circle at 100% 100%, rgba(17,75,63,.30), transparent 48%);
  display:flex; flex-direction:column;
  transform:translateX(105%);
  transition:transform .38s cubic-bezier(.34,1,.64,1);
  padding:18px 18px 10px;
}
.quran-drawer.open{transform:translateX(0);}

.quran-top{
  text-align:center; flex-shrink:0;
  padding:6px 0 16px;
  border-bottom:1px solid rgba(201,162,75,.22);
  margin-bottom:14px;
  position:relative;
}
.quran-top h3{
  font-family:var(--font-display);
  color:var(--gold-light);
  font-size:1.55rem;
  text-shadow:0 0 18px rgba(228,200,122,.35);
}
.quran-sub{
  color:var(--parchment);
  opacity:.65;
  font-size:.82rem;
  margin-top:6px;
}

.quran-body{
  flex:1; min-height:0;
  overflow-y:auto;
  padding:4px 2px 26px;
  scrollbar-width:thin;
  scrollbar-color:var(--gold) transparent;
}

.surah-list{list-style:none; display:flex; flex-direction:column; gap:9px;}
.surah-item{
  display:flex; align-items:center;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(201,162,75,.22);
  border-radius:16px;
  padding:12px 16px;
  cursor:pointer;
  transition:background .2s ease, border-color .2s ease, transform .15s ease;
}
.surah-item:hover{background:rgba(201,162,75,.1); border-color:var(--gold); transform:translateY(-1px);}
.surah-num{
  width:34px; height:34px; border-radius:50%;
  border:1px solid var(--gold);
  color:var(--gold-light);
  display:flex; align-items:center; justify-content:center;
  font-size:.78rem; font-weight:700; flex-shrink:0;
}
.surah-info{flex:1; padding:0 12px; text-align:right;}
.surah-name-ar{font-family:var(--font-display); color:var(--parchment); font-size:1.2rem;}
.surah-meta{color:var(--gold); font-size:.72rem; margin-top:3px;}

.ayat-view{padding-bottom:10px;}
.back-to-list{
  background:none; border:1px solid var(--gold); color:var(--gold-light);
  border-radius:999px; padding:8px 18px; font-family:var(--font-body);
  font-size:.8rem; font-weight:700; cursor:pointer; margin-bottom:16px;
  transition:background .2s ease;
}
.back-to-list:hover{background:rgba(201,162,75,.12);}

#surahTitle{
  font-family:var(--font-display);
  color:var(--gold-light);
  text-align:center;
  font-size:1.7rem;
  text-shadow:0 0 18px rgba(228,200,122,.35);
}
.surah-title-meta{
  text-align:center; color:var(--gold);
  font-size:.78rem; margin-top:4px; margin-bottom:20px;
}

.bismillah{
  display:block; text-align:center;
  color:var(--gold-light);
  font-family:var(--font-display);
  font-size:1.55rem;
  margin-bottom:18px;
}

.ayat-text{
  font-family:var(--font-display);
  font-size:1.4rem;
  line-height:2.7;
  color:var(--parchment);
  text-align:justify;
  background:rgba(255,255,255,.025);
  border:1px solid rgba(201,162,75,.18);
  border-radius:20px;
  padding:24px 20px;
}
.ayah-num{
  display:inline-flex; align-items:center; justify-content:center;
  min-width:26px; height:26px; padding:0 2px;
  border:1px solid var(--gold);
  border-radius:50%;
  color:var(--gold-light);
  font-family:var(--font-body);
  font-size:.65rem;
  margin:0 6px;
  vertical-align:middle;
}

.quran-error{
  text-align:center;
  color:var(--parchment);
  padding:60px 20px;
  font-size:.95rem;
}
.retry-btn{
  margin-top:16px;
  background:var(--gold);
  color:#000;
  border:none;
  padding:10px 26px;
  border-radius:999px;
  font-weight:700;
  cursor:pointer;
  font-family:var(--font-body);
}
.retry-btn:hover{background:var(--gold-light);}

/* ============ Footer ============ */
.site-footer{
  position:relative; z-index:1;
  text-align:center;
  padding:26px 20px 40px;
  color:var(--gold-light);
  font-family:var(--font-display);
  font-size:1rem;
  max-width:620px;
  margin:0 auto;
  line-height:2;
}

/* ============ Responsive ============ */
@media (max-width:480px){
  .beads-track{width:min(70px, 20vw);}
  .drag-bead{width:44px; height:44px;}
  .ayat-text{font-size:1.2rem; line-height:2.4; padding:18px 14px;}
  .btn-17{padding:.75rem 2.2rem;}
  .loading svg{width:180px; height:60px;}
}

/* ============ Accessibility ============ */
button:focus-visible, .tab-btn:focus-visible{
  outline:3px solid var(--gold-light);
  outline-offset:2px;
}
@media (prefers-reduced-motion: reduce){
  *{animation-duration:.01ms !important; transition-duration:.01ms !important;}
}
