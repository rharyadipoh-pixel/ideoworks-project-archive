// GamifyLP — Landing Page Generator v4
// Full color system: scale derivation, gradient hero, depth throughout

// ─── COLOR UTILITIES ────────────────────────────────────────
function hexToRgb(hex) {
  var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : {r:230,g:51,b:41};
}
function rgbToHex(r,g,b) {
  return '#'+[r,g,b].map(function(v){
    return Math.min(255,Math.max(0,Math.round(v))).toString(16).padStart(2,'0');
  }).join('');
}
function mixHex(hex1, hex2, ratio) {
  var a = hexToRgb(hex1), b = hexToRgb(hex2);
  return rgbToHex(a.r+(b.r-a.r)*ratio, a.g+(b.g-a.g)*ratio, a.b+(b.b-a.b)*ratio);
}
function getLuminance(hex) {
  var c = hexToRgb(hex);
  var toLinear = function(v){ v=v/255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4); };
  return 0.2126*toLinear(c.r)+0.7152*toLinear(c.g)+0.0722*toLinear(c.b);
}
function deriveScale(hex) {
  var rgb = hexToRgb(hex);
  return {
    base:      hex,
    tint:      mixHex(hex,'#ffffff',0.32),
    lighter:   mixHex(hex,'#ffffff',0.88),
    shade:     mixHex(hex,'#000000',0.22),
    deep:      mixHex(hex,'#000000',0.42),
    textColor: getLuminance(hex)>0.35 ? '#1a1a1a' : '#ffffff',
    r:rgb.r, g:rgb.g, b:rgb.b,
    rgb:rgb.r+','+rgb.g+','+rgb.b
  };
}

// ─── UTILITIES ──────────────────────────────────────────────
function escapeHtml(s) {
  if (s==null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ─── STRINGS ────────────────────────────────────────────────
var STRINGS = {
  id:{
    heroBadge:'Tes Gratis', heroMeta:'{n} pertanyaan · ~2 menit · 100% gratis',
    socialProofLine:'{n} orang sudah mengambil assessment ini',
    qCounter:'Pertanyaan {cur} dari {total}',
    gateHeadline:'Hampir Selesai!', gateSub:'Hasilmu siap. Masukkan datamu untuk melihat skor.',
    gateReveal:'Lihat Skorku →', gatePrivacy:'🔒 Datamu aman. Kami tidak mengirim spam.',
    shareBtn:'📤 Bagikan Hasilku',
    shareText:'Saya adalah {identity} menurut {brand} — kamu tipe apa? 🎯',
    scoreLbl:'skor', offerKicker:'Hadiah Untukmu', waCta:'Chat di WhatsApp',
    attribution:'Dibuat dengan GamifyLP · Ideoworks',
    fieldLabels:{name:'Nama Lengkap',email:'Alamat Email',phone:'Nomor Telepon',whatsapp:'No. WhatsApp',company:'Nama Perusahaan'},
    fieldPh:{name:'Nama kamu',email:'email@kamu.com',phone:'+62 8xx xxxx xxxx',whatsapp:'+62 8xx xxxx xxxx',company:'Perusahaan kamu'},
    psTitle:'Sebelum Mulai', psSub:'Jawab beberapa pertanyaan singkat agar pengalamanmu lebih personal.',
    psNext:'Lanjut →', psOf:'dari',
    dqTitle:'Terima kasih sudah mampir!',
    dqMsg:'Sepertinya ini belum pas untukmu saat ini — tapi kami tetap menghargai ketertarikanmu.',
    dqBtn:'Lihat Info Lainnya',
    ctdLabel:'Penawaran berakhir dalam', ctdExpired:'Penawaran sudah berakhir',
    retakeBtn:'↩ Ulangi Tes',
  },
  en:{
    heroBadge:'Free Assessment', heroMeta:'{n} questions · ~2 min · 100% free',
    socialProofLine:'{n} people have taken this assessment',
    qCounter:'Question {cur} of {total}',
    gateHeadline:'Almost There!', gateSub:'Your result is ready. Enter your details to unlock your score.',
    gateReveal:'Reveal My Score →', gatePrivacy:'🔒 No spam. We respect your privacy.',
    shareBtn:'📤 Share My Result',
    shareText:'I\'m a {identity} according to {brand} — what are you? 🎯',
    scoreLbl:'score', offerKicker:'Your Reward', waCta:'Chat on WhatsApp',
    attribution:'Made with GamifyLP · Ideoworks',
    fieldLabels:{name:'Full Name',email:'Email Address',phone:'Phone Number',whatsapp:'WhatsApp Number',company:'Company'},
    fieldPh:{name:'Your name',email:'your@email.com',phone:'+62 8xx xxxx xxxx',whatsapp:'+62 8xx xxxx xxxx',company:'Your company'},
    psTitle:'Before We Begin', psSub:'Answer a few quick questions to personalise your experience.',
    psNext:'Continue →', psOf:'of',
    dqTitle:'Thanks for stopping by!',
    dqMsg:"It looks like this isn\'t the perfect fit right now — we still appreciate your interest.",
    dqBtn:'See Other Options',
    ctdLabel:'Offer expires in', ctdExpired:'This offer has expired',
    retakeBtn:'↩ Retake',
  }
};

var OFFER_EMOJIS = {voucher:'🎫',trial:'🆓',consult:'📞',guide:'📄',exclusive:'🔑',recommend:'💡'};

// ─── MAIN GENERATOR ─────────────────────────────────────────
function generateLandingPage(config) {
  var lang  = config.language || 'id';
  var s     = STRINGS[lang]  || STRINGS.id;
  var brand = config.brand   || {};
  var hook  = config.hook    || {};
  var quiz  = config.quiz    || {};
  var res   = config.results || {};
  var offer = config.offer   || {};
  var ps    = config.prescreen || {};
  var trk   = config.tracking  || {};
  var urg   = config.urgency   || {};
  var spCfg = config.socialProof || {};
  var wh    = config.webhook   || {};

  // ── Color System ──────────────────────────────────────────
  var primary   = brand.primaryColor   || '#E63329';
  var secondary = brand.secondaryColor || '#1a1a2e';
  var sc        = deriveScale(primary);

  var brandName   = escapeHtml(brand.name || 'Brand');
  var logoUrl     = escapeHtml(brand.logoUrl || '');
  var headline    = escapeHtml(hook.headline || "What\'s Your Score?");
  var subhead     = escapeHtml(hook.subheadline || 'Take this quick test and find out.');
  var heroProof   = escapeHtml(hook.socialProof || '');
  var startBtn    = escapeHtml(hook.startButtonText || 'Mulai →');
  var questions   = quiz.questions || [];
  var qCount      = questions.length;

  var waRaw       = String(res.whatsappNumber||'').replace(/\D/g,'');
  var showAttr    = res.showAttribution !== false;
  var lFields     = res.leadFields || ['name','email'];
  var heroMeta    = s.heroMeta.replace('{n}', qCount);
  var spCount     = String(spCfg.count||'').trim();
  var spLine      = spCount ? s.socialProofLine.replace('{n}', escapeHtml(spCount)) : '';

  var psEnabled   = !!ps.enabled && (ps.questions||[]).length > 0;
  var psQs        = ps.questions || [];
  var psRedirect  = ps.redirectUrl || '#';

  var metaPx      = trk.metaPixel   || '';
  var gtmId       = trk.gtmId       || '';
  var tiktokPx    = trk.tiktokPixel || '';

  var urgEnabled  = !!urg.enabled;
  var urgHours    = parseInt(urg.hours)||24;
  var webhookUrl  = wh.url || '';

  var offerLow  = (offer.low  && offer.low.type)  ? offer.low  : null;
  var offerMid  = (offer.mid  && offer.mid.type)  ? offer.mid  : null;
  var offerHigh = (offer.high && offer.high.type) ? offer.high : null;
  var hasOffer  = !!(offerLow || offerMid || offerHigh);

  var low  = res.low  || {};
  var mid  = res.mid  || {};
  var high = res.high || {};

  var thLow  = (res.thresholdLow  != null && res.thresholdLow  !== '') ? parseInt(res.thresholdLow)  : 40;
  var thHigh = (res.thresholdHigh != null && res.thresholdHigh !== '') ? parseInt(res.thresholdHigh) : 75;

  var rtCfg = {
    low:  {badge:low.badge||'', title:low.title||'', description:low.description||'', ctaText:low.ctaText||'', ctaUrl:low.ctaUrl||res.ctaUrl||'#', offer:offerLow},
    mid:  {badge:mid.badge||'', title:mid.title||'', description:mid.description||'', ctaText:mid.ctaText||'', ctaUrl:mid.ctaUrl||res.ctaUrl||'#', offer:offerMid},
    high: {badge:high.badge||'',title:high.title||'',description:high.description||'',ctaText:high.ctaText||'',ctaUrl:high.ctaUrl||res.ctaUrl||'#', offer:offerHigh},
    hasOffer:hasOffer, offerEmojis:OFFER_EMOJIS, offerKicker:s.offerKicker,
    urgency:urgEnabled, urgHours:urgHours, ctdLabel:s.ctdLabel, ctdExpired:s.ctdExpired,
    webhookUrl:webhookUrl, shareText:s.shareText,
    thLow:thLow, thHigh:thHigh,
  };

  // ── Hero Gradient ─────────────────────────────────────────
  var heroGrad = config.heroGradient || 'diagonal';
  var heroBg =
    heroGrad === 'diagonal'  ? 'linear-gradient(135deg,'+sc.deep+' 0%,'+sc.base+' 100%)' :
    heroGrad === 'spotlight' ? 'radial-gradient(ellipse at 25% 30%,'+sc.tint+' 0%,'+sc.base+' 52%,'+sc.shade+' 100%)' :
    sc.base;

  // ── Pixel Tags ────────────────────────────────────────────
  var headPixels = '';
  if (gtmId) headPixels +=
    '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});'+
    'var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";'+
    'j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;'+
    'f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","'+escapeHtml(gtmId)+'");<\/script>\n';
  if (metaPx) headPixels +=
    '<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?'+
    'n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;'+
    'n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;'+
    't.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}'+
    '(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");'+
    'fbq("init","'+escapeHtml(metaPx)+'");fbq("track","PageView");<\/script>\n'+
    '<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id='+escapeHtml(metaPx)+'&ev=PageView&noscript=1"></noscript>\n';
  if (tiktokPx) headPixels +=
    '<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];'+
    'ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],'+
    'ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};'+
    'for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);'+
    'ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";'+
    'ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};'+
    'var o=document.createElement("script");o.type="text/javascript",o.async=!0,'+
    'o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];'+
    'a.parentNode.insertBefore(o,a)};ttq.load("'+escapeHtml(tiktokPx)+'");ttq.page();}(window,document,"ttq");<\/script>\n';

  var bodyGtm = gtmId ?
    '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id='+escapeHtml(gtmId)+
    '" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n' : '';

  var initScreen = psEnabled ? 'prescreen' : 'hero';

  // ── SVG Arc Gradient ──────────────────────────────────────
  var arcGradDef =
    '<defs>'+
    '<linearGradient id="ag" x1="14" y1="14" x2="126" y2="126" gradientUnits="userSpaceOnUse">'+
    '<stop offset="0%" stop-color="'+sc.tint+'"/>'+
    '<stop offset="100%" stop-color="'+sc.base+'"/>'+
    '</linearGradient>'+
    '</defs>';

  // ── CSS Variables ─────────────────────────────────────────
  var cssVars =
    '--p:'+sc.base+';'+
    '--p-tint:'+sc.tint+';'+
    '--p-lighter:'+sc.lighter+';'+
    '--p-shade:'+sc.shade+';'+
    '--p-deep:'+sc.deep+';'+
    '--p-text:'+sc.textColor+';'+
    '--s:'+secondary+';'+
    '--pr:'+sc.rgb+';';

  /* ── FULL HTML ──────────────────────────────────────────── */
  return '<!DOCTYPE html>\n<html lang="'+lang+'">\n<head>\n'+
'<meta charset="UTF-8">\n'+
'<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">\n'+
'<title>'+brandName+'</title>\n'+
headPixels+
'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">\n'+
'<style>\n'+
'*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n'+
'html,body{height:100%;font-family:\'Inter\',-apple-system,sans-serif;background:#f5f5f5;color:#1a1a1a;-webkit-font-smoothing:antialiased}\n'+
':root{'+cssVars+'}\n'+
'.screen{display:none;min-height:100vh;flex-direction:column;animation:fadeIn .4s ease}\n'+
'.screen.active{display:flex}\n'+
'@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}\n'+
'@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}\n'+
'@keyframes popIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}\n'+
'@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}\n'+

/* PRESCREEN */
'#screen-prescreen{background:'+heroBg+';justify-content:center;align-items:center;position:relative;overflow:hidden;padding:40px 24px}\n'+
'#screen-prescreen::before{content:"";position:absolute;top:-35%;right:-10%;width:420px;height:420px;background:rgba(255,255,255,.06);border-radius:50%;pointer-events:none}\n'+
'#screen-prescreen::after{content:"";position:absolute;bottom:-25%;left:-8%;width:300px;height:300px;background:rgba(255,255,255,.04);border-radius:50%;pointer-events:none}\n'+
'.ps-inner{position:relative;z-index:1;max-width:440px;width:100%;text-align:center}\n'+
'.ps-logo{margin-bottom:24px}\n'+
'.ps-logo img{height:34px;object-fit:contain;filter:brightness(0) invert(1)}\n'+
'.ps-logo-text{color:rgba(255,255,255,.9);font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase}\n'+
'.ps-badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(8px);color:#fff;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 14px;border-radius:100px;margin-bottom:20px}\n'+
'.ps-sub{font-size:14px;color:rgba(255,255,255,.75);line-height:1.6;margin-bottom:28px}\n'+
'.ps-progress{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:24px}\n'+
'.ps-dots{display:flex;gap:5px}\n'+
'.ps-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.25);transition:all .3s}\n'+
'.ps-dot.active{background:#fff;width:20px;border-radius:4px}\n'+
'.ps-q{font-size:22px;font-weight:900;color:#fff;line-height:1.25;margin-bottom:24px;letter-spacing:-.4px}\n'+
'.ps-opts{display:flex;flex-direction:column;gap:10px}\n'+
'.ps-opt{background:rgba(255,255,255,.95);color:var(--p-deep);border:none;border-radius:14px;padding:16px 20px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;text-align:left;transition:all .2s;box-shadow:0 4px 16px rgba(0,0,0,.12);backdrop-filter:blur(8px)}\n'+
'.ps-opt:hover{background:#fff;transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.18)}\n'+
'.ps-opt:active{transform:translateY(0)}\n'+

/* DISQUALIFY */
'#screen-disqualify{background:#f5f5f5;justify-content:center;align-items:center;padding:32px 20px}\n'+
'.dq-card{background:#fff;border-radius:20px;padding:44px 32px;max-width:400px;width:100%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.08)}\n'+
'.dq-icon{font-size:52px;margin-bottom:16px}\n'+
'.dq-title{font-size:22px;font-weight:900;color:#1a1a1a;margin-bottom:10px;letter-spacing:-.3px}\n'+
'.dq-msg{font-size:14px;color:#888;line-height:1.75;margin-bottom:28px}\n'+
'.btn-dq{display:inline-block;padding:14px 28px;background:#1a1a1a;color:#fff;font-size:14px;font-weight:700;border:none;border-radius:12px;cursor:pointer;font-family:inherit;text-decoration:none;transition:opacity .2s}\n'+
'.btn-dq:hover{opacity:.85}\n'+

/* HERO */
'#screen-hero{background:'+heroBg+';justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden}\n'+
'#screen-hero::before{content:"";position:absolute;top:-40%;right:-15%;width:520px;height:520px;background:rgba(255,255,255,.06);border-radius:50%;pointer-events:none}\n'+
'#screen-hero::after{content:"";position:absolute;bottom:-30%;left:-12%;width:380px;height:380px;background:rgba(255,255,255,.04);border-radius:50%;pointer-events:none}\n'+
'.hero-inner{position:relative;z-index:1;padding:56px 32px;max-width:480px;margin:0 auto;width:100%}\n'+
'.hero-logo{margin-bottom:30px}\n'+
'.hero-logo img{height:40px;object-fit:contain;filter:brightness(0) invert(1)}\n'+
'.hero-logo-text{color:rgba(255,255,255,.9);font-size:13px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase}\n'+
'.hero-badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(8px);color:#fff;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:6px 16px;border-radius:100px;margin-bottom:24px}\n'+
'.hero-headline{font-size:40px;font-weight:900;color:#fff;line-height:1.1;margin-bottom:16px;letter-spacing:-.8px;text-shadow:0 2px 20px rgba(0,0,0,.15)}\n'+
'.hero-sub{font-size:16px;color:rgba(255,255,255,.82);line-height:1.65;margin-bottom:12px}\n'+
'.hero-proof{font-size:12px;color:rgba(255,255,255,.55);margin-bottom:10px;font-style:italic}\n'+
'.hero-sp{font-size:12px;color:rgba(255,255,255,.55);margin-bottom:38px;display:flex;align-items:center;justify-content:center;gap:6px}\n'+
'.hero-sp::before{content:"";width:28px;height:1px;background:rgba(255,255,255,.25)}\n'+
'.hero-sp::after{content:"";width:28px;height:1px;background:rgba(255,255,255,.25)}\n'+
'.btn-start{display:block;width:100%;padding:19px 32px;background:#fff;color:var(--p-deep);font-size:16px;font-weight:800;border:none;border-radius:16px;cursor:pointer;box-shadow:0 8px 32px rgba(0,0,0,.18),0 0 0 1px rgba(255,255,255,.1);transition:transform .2s,box-shadow .2s;font-family:inherit;letter-spacing:-.2px}\n'+
'.btn-start:hover{transform:translateY(-3px);box-shadow:0 14px 48px rgba(0,0,0,.25),0 0 0 1px rgba(255,255,255,.15)}\n'+
'.btn-start:active{transform:translateY(-1px)}\n'+
'.hero-meta{margin-top:18px;font-size:11px;color:rgba(255,255,255,.38);letter-spacing:.3px}\n'+

/* QUIZ */
'#screen-quiz{background:#f5f5f5;flex-direction:column}\n'+
'.quiz-topbar{background:#fff;padding:14px 20px 0;border-bottom:1px solid #f0f0f0;position:sticky;top:0;z-index:10}\n'+
'.quiz-brand-row{display:flex;align-items:center;gap:8px;margin-bottom:10px}\n'+
'.quiz-dot{width:8px;height:8px;background:var(--p);border-radius:50%;flex-shrink:0}\n'+
'.quiz-brand-name{font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1.5px}\n'+
'.progress-track{height:5px;background:#f0f0f0;border-radius:3px;overflow:hidden}\n'+
'.progress-fill{height:100%;background:linear-gradient(90deg,var(--p-shade),var(--p),var(--p-tint));background-size:200% auto;border-radius:3px;transition:width .5s cubic-bezier(.4,0,.2,1)}\n'+
'.quiz-body{flex:1;padding:28px 20px;max-width:480px;margin:0 auto;width:100%}\n'+
'.q-counter{font-size:11px;font-weight:700;color:var(--p);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:10px}\n'+
'.q-text{font-size:22px;font-weight:800;color:#1a1a1a;line-height:1.3;margin-bottom:28px;letter-spacing:-.3px}\n'+
'.options{display:flex;flex-direction:column;gap:10px}\n'+
'.opt{display:flex;align-items:center;gap:14px;padding:16px 18px;background:#fff;border:2px solid #e8e8e8;border-radius:14px;cursor:pointer;text-align:left;width:100%;font-family:inherit;transition:all .18s;box-shadow:0 1px 4px rgba(0,0,0,.04)}\n'+
'.opt:hover:not(:disabled){border-color:var(--p);background:var(--p-lighter);transform:translateX(3px);box-shadow:0 3px 12px rgba(var(--pr),.12)}\n'+
'.opt.selected{border-color:var(--p);background:linear-gradient(135deg,var(--p),var(--p-shade));box-shadow:0 4px 20px rgba(var(--pr),.3)}\n'+
'.opt:disabled{cursor:default}\n'+
'.opt-letter{width:32px;height:32px;border-radius:50%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#888;flex-shrink:0;transition:all .18s}\n'+
'.opt.selected .opt-letter{background:rgba(255,255,255,.2);color:#fff}\n'+
'.opt:hover:not(:disabled) .opt-letter{background:var(--p);color:#fff}\n'+
'.opt-text{font-size:14px;font-weight:500;color:#1a1a1a;line-height:1.4;transition:color .18s}\n'+
'.opt.selected .opt-text{color:#fff;font-weight:600}\n'+
'.opt:hover:not(:disabled) .opt-text{color:var(--p-shade)}\n'+

/* GATE */
'#screen-gate{background:#f5f5f5;justify-content:center;align-items:center;padding:32px 20px}\n'+
'.gate-card{background:#fff;border-radius:20px;overflow:hidden;max-width:420px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,.08)}\n'+
'.gate-card-top{background:'+heroBg+';padding:28px;text-align:center}\n'+
'.gate-icon{font-size:36px;margin-bottom:4px}\n'+
'.gate-headline{font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;letter-spacing:-.3px}\n'+
'.gate-sub{font-size:13px;color:rgba(255,255,255,.75);line-height:1.5}\n'+
'.gate-body{padding:28px}\n'+
'.f-field{margin-bottom:13px}\n'+
'.f-field label{display:block;font-size:11px;font-weight:700;color:#888;margin-bottom:6px;text-transform:uppercase;letter-spacing:.8px}\n'+
'.f-field input{width:100%;padding:13px 15px;border:2px solid #e8e8e8;border-radius:12px;font-size:15px;font-family:inherit;color:#1a1a1a;outline:none;transition:border-color .2s,box-shadow .2s}\n'+
'.f-field input:focus{border-color:var(--p);box-shadow:0 0 0 3px rgba(var(--pr),.12)}\n'+
'.btn-reveal{display:block;width:100%;padding:16px;background:linear-gradient(135deg,var(--p),var(--p-shade));color:#fff;font-size:16px;font-weight:700;border:none;border-radius:12px;cursor:pointer;margin-top:20px;font-family:inherit;transition:all .2s;box-shadow:0 4px 20px rgba(var(--pr),.3)}\n'+
'.btn-reveal:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(var(--pr),.4)}\n'+
'.gate-privacy{font-size:11px;color:#ccc;text-align:center;margin-top:14px}\n'+

/* RESULT */
'#screen-result{background:#f5f5f5;justify-content:center;align-items:center;padding:32px 20px 60px}\n'+
'.result-wrap{max-width:420px;width:100%}\n'+
'.result-card{background:#fff;border-radius:20px;overflow:hidden;width:100%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.08)}\n'+
'.result-card-top{background:'+heroBg+';padding:28px 28px 20px}\n'+
'.res-brand{font-size:10px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px}\n'+
'.score-wrap{position:relative;width:130px;height:130px;margin:0 auto 16px}\n'+
'.score-wrap svg{transform:rotate(-90deg);filter:drop-shadow(0 0 10px rgba(var(--pr),.35))}\n'+
'.score-num{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}\n'+
'.score-num span.big{display:block;font-size:40px;font-weight:900;color:#fff;letter-spacing:-1px;animation:popIn .5s ease .3s both;text-shadow:0 2px 12px rgba(0,0,0,.2)}\n'+
'.score-num span.lbl{display:block;font-size:10px;color:rgba(255,255,255,.6);font-weight:600;margin-top:-4px;text-transform:uppercase;letter-spacing:.5px}\n'+
'.res-badge-wrap{margin-bottom:4px}\n'+
'.res-badge{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.3);color:#fff;font-size:11px;font-weight:800;padding:5px 16px;border-radius:100px;text-transform:uppercase;letter-spacing:1px;backdrop-filter:blur(8px)}\n'+
'.result-card-body{padding:24px 28px 28px}\n'+
'.res-title{font-size:24px;font-weight:900;color:#1a1a1a;margin-bottom:10px;letter-spacing:-.4px}\n'+
'.res-msg{font-size:14px;color:#777;line-height:1.75;margin-bottom:22px}\n'+

/* COUNTDOWN */
'.countdown-wrap{background:var(--p-lighter);border:1.5px solid rgba(var(--pr),.2);border-radius:14px;padding:14px 18px;margin-bottom:20px;display:none;text-align:center}\n'+
'.countdown-wrap.active{display:block;animation:fadeIn .4s ease}\n'+
'.ctd-label{font-size:10px;font-weight:700;color:var(--p-shade);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}\n'+
'.ctd-timer{font-size:28px;font-weight:900;color:var(--p-deep);letter-spacing:-.5px;font-variant-numeric:tabular-nums}\n'+

/* OFFER */
'.offer-block{display:none;background:var(--p-lighter);border-left:3px solid var(--p);border-right:1px solid rgba(var(--pr),.12);border-top:1px solid rgba(var(--pr),.12);border-bottom:1px solid rgba(var(--pr),.12);border-radius:0 12px 12px 0;padding:16px 18px;margin-bottom:20px;text-align:left}\n'+
'.offer-block.visible{display:block;animation:fadeIn .5s ease}\n'+
'.offer-top{display:flex;align-items:center;gap:12px;margin-bottom:8px}\n'+
'.offer-emoji{font-size:28px;line-height:1;flex-shrink:0}\n'+
'.offer-kicker{font-size:10px;font-weight:700;color:var(--p-shade);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px}\n'+
'.offer-name{font-size:15px;font-weight:800;color:#1a1a1a;line-height:1.3}\n'+
'.offer-detail{font-size:13px;color:#555;line-height:1.65}\n'+

/* CTA BUTTONS */
'.btn-cta{display:block;width:100%;padding:17px;background:linear-gradient(135deg,var(--p),var(--p-shade));color:#fff;font-size:15px;font-weight:700;border:none;border-radius:14px;cursor:pointer;font-family:inherit;text-decoration:none;transition:all .2s;margin-bottom:10px;box-shadow:0 4px 20px rgba(var(--pr),.28);letter-spacing:-.1px}\n'+
'.btn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(var(--pr),.38)}\n'+
'.btn-wa{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:15px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;font-size:15px;font-weight:700;border:none;border-radius:14px;cursor:pointer;font-family:inherit;text-decoration:none;transition:all .2s;margin-bottom:10px;box-shadow:0 4px 20px rgba(37,211,102,.25)}\n'+
'.btn-wa:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(37,211,102,.35)}\n'+
'.btn-share{display:block;width:100%;padding:13px;background:transparent;color:#bbb;font-size:13px;font-weight:600;border:1.5px solid #ebebeb;border-radius:12px;cursor:pointer;font-family:inherit;transition:all .2s}\n'+
'.btn-share:hover{border-color:var(--p);color:var(--p);background:var(--p-lighter)}\n'+
'.btn-retake{display:block;width:100%;padding:11px;background:transparent;color:#ccc;font-size:12px;font-weight:600;border:1.5px solid #f0f0f0;border-radius:12px;cursor:pointer;font-family:inherit;transition:all .2s;margin-top:8px}\n'+
'.btn-retake:hover{border-color:#ccc;color:#666}\n'+

/* ATTRIBUTION */
'.attrib{text-align:center;margin-top:20px;font-size:11px;color:#ccc}\n'+
'.attrib a{color:#bbb;text-decoration:none;font-weight:600}\n'+
'.attrib a:hover{color:#999}\n'+
'</style>\n</head>\n<body>\n'+
bodyGtm+

/* ── PRESCREEN ── */
(psEnabled ?
'<div id="screen-prescreen" class="screen'+(initScreen==='prescreen'?' active':'')+'">\n'+
'  <div class="ps-inner">\n'+
'    <div class="ps-logo">'+
      (logoUrl ? '<img src="'+logoUrl+'" alt="'+brandName+'" onerror="this.style.display=\'none\'">' : '<span class="ps-logo-text">'+brandName+'</span>')+
'    </div>\n'+
'    <div class="ps-badge">'+escapeHtml(s.psTitle)+'</div>\n'+
'    <p class="ps-sub">'+escapeHtml(s.psSub)+'</p>\n'+
'    <div class="ps-progress"><div class="ps-dots" id="ps-dots"></div></div>\n'+
'    <div id="ps-q" class="ps-q"></div>\n'+
'    <div id="ps-opts" class="ps-opts"></div>\n'+
'  </div>\n'+
'</div>\n'
: '')+

/* ── DISQUALIFY ── */
(psEnabled ?
'<div id="screen-disqualify" class="screen">\n'+
'  <div class="dq-card">\n'+
'    <div class="dq-icon">🙏</div>\n'+
'    <h2 class="dq-title">'+escapeHtml(s.dqTitle)+'</h2>\n'+
'    <p class="dq-msg">'+escapeHtml(s.dqMsg)+'</p>\n'+
(psRedirect&&psRedirect!=='#' ? '    <a href="'+escapeHtml(psRedirect)+'" class="btn-dq" target="_blank">'+escapeHtml(s.dqBtn)+'</a>\n' : '')+
'  </div>\n'+
'</div>\n'
: '')+

/* ── HERO ── */
'<div id="screen-hero" class="screen'+(initScreen==='hero'?' active':'')+'">\n'+
'  <div class="hero-inner">\n'+
'    <div class="hero-logo">'+
      (logoUrl ? '<img src="'+logoUrl+'" alt="'+brandName+'" onerror="this.style.display=\'none\'">' : '<span class="hero-logo-text">'+brandName+'</span>')+
'    </div>\n'+
'    <div class="hero-badge">'+escapeHtml(s.heroBadge)+'</div>\n'+
'    <h1 class="hero-headline">'+headline+'</h1>\n'+
'    <p class="hero-sub">'+subhead+'</p>\n'+
(heroProof ? '    <p class="hero-proof">'+heroProof+'</p>\n' : '')+
(spLine ? '    <p class="hero-sp">'+escapeHtml(spLine)+'</p>\n' : '')+
'    <button class="btn-start" onclick="startQuiz()">'+startBtn+'</button>\n'+
'    <p class="hero-meta">'+escapeHtml(heroMeta)+'</p>\n'+
'  </div>\n'+
'</div>\n'+

/* ── QUIZ ── */
'<div id="screen-quiz" class="screen">\n'+
'  <div class="quiz-topbar">\n'+
'    <div class="quiz-brand-row"><div class="quiz-dot"></div><span class="quiz-brand-name">'+brandName+'</span></div>\n'+
'    <div class="progress-track"><div class="progress-fill" id="prog" style="width:0%"></div></div>\n'+
'  </div>\n'+
'  <div class="quiz-body">\n'+
'    <div id="q-counter" class="q-counter"></div>\n'+
'    <div id="q-text" class="q-text"></div>\n'+
'    <div id="q-opts" class="options"></div>\n'+
'  </div>\n'+
'</div>\n'+

/* ── GATE ── */
'<div id="screen-gate" class="screen">\n'+
'  <div class="gate-card">\n'+
'    <div class="gate-card-top">\n'+
'      <div class="gate-icon">🏆</div>\n'+
'      <h2 class="gate-headline">'+escapeHtml(s.gateHeadline)+'</h2>\n'+
'      <p class="gate-sub">'+escapeHtml(s.gateSub)+'</p>\n'+
'    </div>\n'+
'    <div class="gate-body">\n'+
'      <form id="lead-form" onsubmit="submitLead(event)">\n'+
'        <div id="lead-fields"></div>\n'+
'        <button type="submit" class="btn-reveal">'+escapeHtml(s.gateReveal)+'</button>\n'+
'      </form>\n'+
'      <p class="gate-privacy">'+escapeHtml(s.gatePrivacy)+'</p>\n'+
'    </div>\n'+
'  </div>\n'+
'</div>\n'+

/* ── RESULT ── */
'<div id="screen-result" class="screen">\n'+
'  <div class="result-wrap">\n'+
'    <div class="result-card">\n'+
'      <div class="result-card-top">\n'+
'        <div class="res-brand">'+brandName+'</div>\n'+
'        <div class="score-wrap">\n'+
'          <svg width="130" height="130" viewBox="0 0 140 140">\n'+
            arcGradDef+'\n'+
'            <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="10"/>\n'+
'            <circle id="score-arc" cx="70" cy="70" r="56" fill="none" stroke="url(#ag)" stroke-width="10" stroke-linecap="round" stroke-dasharray="0 352"/>\n'+
'          </svg>\n'+
'          <div class="score-num"><span class="big" id="score-val">0</span><span class="lbl">'+escapeHtml(s.scoreLbl)+'</span></div>\n'+
'        </div>\n'+
'        <div class="res-badge-wrap"><span id="res-badge" class="res-badge"></span></div>\n'+
'      </div>\n'+
'      <div class="result-card-body">\n'+
'        <h2 id="res-title" class="res-title"></h2>\n'+
'        <p id="res-msg" class="res-msg"></p>\n'+
(urgEnabled ?
'        <div class="countdown-wrap" id="ctd-wrap">\n'+
'          <div class="ctd-label">'+escapeHtml(s.ctdLabel)+'</div>\n'+
'          <div class="ctd-timer" id="ctd-val">—</div>\n'+
'        </div>\n' : '')+
'        <div id="offer-block" class="offer-block">\n'+
'          <div class="offer-top">\n'+
'            <div class="offer-emoji" id="offer-emoji"></div>\n'+
'            <div><div class="offer-kicker">'+escapeHtml(s.offerKicker)+'</div><div class="offer-name" id="offer-name"></div></div>\n'+
'          </div>\n'+
'          <div class="offer-detail" id="offer-detail"></div>\n'+
'        </div>\n'+
'        <a id="res-cta" href="#" class="btn-cta" target="_blank"></a>\n'+
(waRaw ? '        <a href="https://wa.me/'+waRaw+'" class="btn-wa" target="_blank">💬 '+escapeHtml(s.waCta)+'</a>\n' : '')+
'        <button class="btn-share" onclick="shareResult()">'+escapeHtml(s.shareBtn)+'</button>\n'+
'        <button class="btn-retake" onclick="retakeQuiz()">'+escapeHtml(s.retakeBtn)+'</button>\n'+
'      </div>\n'+
'    </div>\n'+
(showAttr ? '    <p class="attrib"><a href="https://ideoworks.id" target="_blank">'+escapeHtml(s.attribution)+'</a></p>\n' : '')+
'  </div>\n'+
'</div>\n'+

/* ── RUNTIME JS ── */
'<script>\n'+
'var Q='+JSON.stringify(questions)+';\n'+
'var cfg='+JSON.stringify(rtCfg)+';\n'+
'var lf='+JSON.stringify(lFields)+';\n'+
'var fl='+JSON.stringify(s.fieldLabels)+';\n'+
'var fp='+JSON.stringify(s.fieldPh)+';\n'+
'var qTpl='+JSON.stringify(s.qCounter)+';\n'+
'var psQ='+JSON.stringify(psQs)+';\n'+
'var psRedir='+JSON.stringify(psRedirect)+';\n'+
'var BN='+JSON.stringify(brand.name||'Brand')+';\n'+
'var st={q:0,ans:[],log:[],psLog:[],lead:{},pct:0,ident:""};\n'+
'var psIdx=0;\n'+

'function show(id){document.querySelectorAll(".screen").forEach(function(el){el.classList.remove("active")});var s=document.getElementById("screen-"+id);if(s)s.classList.add("active");window.scrollTo(0,0);}\n'+

(psEnabled ?
'function renderPs(){\n'+
'  var q=psQ[psIdx];\n'+
'  var d=document.getElementById("ps-dots");\n'+
'  if(d)d.innerHTML=psQ.map(function(_,i){return\'<div class="ps-dot\'+(i===psIdx?\' active\':\'\')+\'"></div>\';}).join("");\n'+
'  document.getElementById("ps-q").textContent=q.text;\n'+
'  document.getElementById("ps-opts").innerHTML=q.options.map(function(o,i){\n'+
'    return\'<button class="ps-opt" onclick="pickPs(\'+i+\',\'+(o.disqualify?"true":"false")+\')">\'+ esc(o.text)+\'</button>\';\n'+
'  }).join("");\n'+
'}\n'+
'function pickPs(i,dq){\n'+
'  st.psLog.push({q:psQ[psIdx].text,a:psQ[psIdx].options[i].text,dq:dq});\n'+
'  if(dq){show("disqualify");return;}\n'+
'  psIdx++;if(psIdx<psQ.length){renderPs();}else{show("hero");}\n'+
'}\n'+
'if(psQ.length)renderPs();\n'
: '')+

'function startQuiz(){st.q=0;st.ans=[];st.log=[];show("quiz");renderQ();}\n'+

'function renderQ(){\n'+
'  var q=Q[st.q],tot=Q.length;\n'+
'  document.getElementById("prog").style.width=(st.q/tot*100)+"%";\n'+
'  document.getElementById("q-counter").textContent=qTpl.replace("{cur}",st.q+1).replace("{total}",tot);\n'+
'  var qt=document.getElementById("q-text");\n'+
'  qt.style.animation="none";qt.offsetHeight;qt.style.animation="slideIn .3s ease";\n'+
'  qt.textContent=q.text;\n'+
'  var L=["A","B","C","D","E","F"];\n'+
'  var g=document.getElementById("q-opts");\n'+
'  g.style.animation="none";g.offsetHeight;g.style.animation="slideIn .3s ease .08s both";\n'+
'  g.innerHTML=q.options.map(function(o,i){\n'+
'    return\'<button class="opt" onclick="pick(\'+i+\',\'+o.points+\')"><div class="opt-letter">\'+L[i]+\'</div><span class="opt-text">\'+esc(o.text)+\'</span></button>\';\n'+
'  }).join("");\n'+
'}\n'+

'function pick(i,pts){\n'+
'  var btns=document.querySelectorAll(".opt");\n'+
'  btns.forEach(function(b){b.disabled=true});\n'+
'  btns[i].classList.add("selected");\n'+
'  st.ans.push(pts);\n'+
'  st.log.push({q:Q[st.q].text,a:Q[st.q].options[i].text,pts:pts});\n'+
'  setTimeout(function(){st.q++;if(st.q<Q.length){renderQ();}else{goGate();}},600);\n'+
'}\n'+

'function goGate(){\n'+
'  var types={name:"text",email:"email",phone:"tel",whatsapp:"tel",company:"text"};\n'+
'  document.getElementById("lead-fields").innerHTML=lf.map(function(f){\n'+
'    return\'<div class="f-field"><label>\'+esc(fl[f]||f)+\'</label>\'+\n'+
'      \'<input type="\'+( types[f]||"text")+\'" name="\'+f+\'" placeholder="\'+escA(fp[f]||"")+\'" required></div>\';\n'+
'  }).join("");\n'+
'  show("gate");\n'+
'}\n'+

'function submitLead(e){\n'+
'  e.preventDefault();\n'+
'  document.getElementById("lead-form").querySelectorAll("input").forEach(function(el){st.lead[el.name]=el.value;});\n'+
'  var wmax=Q.reduce(function(s,q){return s+Math.max.apply(null,q.options.map(function(o){return o.points;}))*(q.weight||1);},0);\n'+
'  var wsum=st.ans.reduce(function(s,pts,i){return s+pts*(Q[i].weight||1);},0);\n'+
'  st.pct=wmax>0?Math.round(wsum/wmax*100):0;\n'+
'  if(typeof fbq!=="undefined")fbq("track","Lead");\n'+
'  if(typeof ttq!=="undefined")ttq.track("SubmitForm");\n'+
'  show("result");revealResult();\n'+
'}\n'+

'function revealResult(){\n'+
'  var tKey=st.pct<=(cfg.thLow||40)?"low":st.pct<=(cfg.thHigh||75)?"mid":"high";\n'+
'  var t=cfg[tKey];\n'+
'  var nm=st.lead.name||"";\n'+
'  document.getElementById("res-badge").textContent=t.badge||"";\n'+
'  document.getElementById("res-title").textContent=(t.title||"").replace(/\\{name\\}/gi,nm);\n'+
'  document.getElementById("res-msg").textContent=(t.description||"").replace(/\\{name\\}/gi,nm);\n'+
'  var cta=document.getElementById("res-cta");\n'+
'  cta.textContent=t.ctaText||"Learn More";\n'+
'  cta.href=t.ctaUrl||"#";\n'+
'  st.ident=t.badge||t.title||"";\n'+
'  if(cfg.hasOffer&&t.offer){\n'+
'    document.getElementById("offer-emoji").textContent=(cfg.offerEmojis&&cfg.offerEmojis[t.offer.type])||"🎁";\n'+
'    document.getElementById("offer-name").textContent=t.offer.label||"";\n'+
'    document.getElementById("offer-detail").textContent=t.offer.detail||"";\n'+
'    document.getElementById("offer-block").classList.add("visible");\n'+
'  }\n'+
(urgEnabled ? '  var cw=document.getElementById("ctd-wrap");if(cw)cw.classList.add("active");initCountdown(cfg.urgHours,cfg.ctdLabel,cfg.ctdExpired);\n' : '')+
'  if(cfg.webhookUrl)sendWebhook(cfg.webhookUrl);\n'+
'  setTimeout(function(){\n'+
'    var circ=2*Math.PI*56;\n'+
'    var arc=document.getElementById("score-arc");\n'+
'    arc.style.transition="stroke-dasharray 1.8s cubic-bezier(.2,.8,.3,1)";\n'+
'    arc.setAttribute("stroke-dasharray",(st.pct/100*circ)+" "+circ);\n'+
'    var cur=0,tgt=st.pct;\n'+
'    var iv=setInterval(function(){cur=Math.min(cur+Math.ceil(tgt/45),tgt);document.getElementById("score-val").textContent=cur;if(cur>=tgt)clearInterval(iv);},38);\n'+
'  },200);\n'+
'}\n'+

(urgEnabled ?
'function initCountdown(hrs,lbl,exp){\n'+
'  var key="glp_"+encodeURIComponent(BN);\n'+
'  var stored=localStorage.getItem(key);\n'+
'  var expTime=stored?parseInt(stored):Date.now()+hrs*3600000;\n'+
'  if(!stored)localStorage.setItem(key,expTime);\n'+
'  var el=document.getElementById("ctd-val");\n'+
'  if(!el)return;\n'+
'  (function tick(){\n'+
'    var rem=expTime-Date.now();\n'+
'    if(rem<=0){el.textContent=exp;return;}\n'+
'    var h=Math.floor(rem/3600000),m=Math.floor((rem%3600000)/60000),sec=Math.floor((rem%60000)/1000);\n'+
'    el.textContent=(h>0?h+":":"")+(h>0?String(m).padStart(2,"0"):m)+":"+String(sec).padStart(2,"0");\n'+
'    setTimeout(tick,1000);\n'+
'  })();\n'+
'}\n' : '')+

'function sendWebhook(url){\n'+
'  try{fetch(url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({brand:BN,ts:new Date().toISOString(),score:st.pct,tier:st.pct<=40?"low":st.pct<=75?"mid":"high",identity:st.ident,lead:st.lead,answers:st.log,prescreen:st.psLog})});}catch(e){}\n'+
'}\n'+

'function shareResult(){\n'+
'  var txt=(cfg.shareText||"{identity} — {brand}").replace("{identity}",st.ident).replace("{pct}",st.pct).replace("{brand}",BN);\n'+
'  if(navigator.share){navigator.share({title:BN,text:txt,url:location.href});}\n'+
'  else if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){alert("Copied!");});}\n'+
'  else{prompt("Copy:",txt);}\n'+
'}\n'+
'function retakeQuiz(){\n'+
'  st.q=0;st.ans=[];st.log=[];st.lead={};st.pct=0;st.ident="";\n'+
'  var ob=document.getElementById("offer-block");if(ob)ob.classList.remove("visible");\n'+
'  var arc=document.getElementById("score-arc");if(arc)arc.setAttribute("stroke-dasharray","0 352");\n'+
'  document.getElementById("score-val").textContent="0";\n'+
'  show("hero");\n'+
'}\n'+

'function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML;}\n'+
'function escA(s){return String(s||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/\'/g,"&#39;");}\n'+
'<\/script>\n</body>\n</html>';
}
