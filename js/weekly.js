/* ---------- the weekly card ----------
   A grown-up shares her week as a picture: an SVG drawn at 1080×1350 (4:5, what messengers show whole) onto a
   canvas and saved as a PNG. Fredoka goes into the SVG itself (an SVG drawn as an image loads nothing). The PNG
   is made when the preview opens, not on the tap: iOS lets a page share only straight after a tap, with
   nothing awaited in between. Where there is no sharing of files, it downloads. */
import { mascotSvg } from './mascots.js';
import { t } from './i18n.js';

const W = 1080, H = 1350, esc = v => String(v).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
let FONT = null;   // Fredoka as a data: URL, read once
async function fredoka(){
  if(FONT) return FONT;
  try {
    const b = new Uint8Array(await (await fetch('fonts/fredoka-latin.woff2')).arrayBuffer());
    let s = '';
    for(let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
    FONT = 'data:font/woff2;base64,' + btoa(s);
  } catch(e){ FONT = ''; }   // offline before it was ever cached: the numbers fall back to the system font
  return FONT;
}

// The mascot is coloured and posed by the page's .cat rules (app.css); an SVG drawn as an image sees none of the
// page's CSS, so the card carries a copy of them
// (and the light palette its colours name — the card is light whatever the page's theme)
const PALETTE = ['--fur', '--fur-light', '--fur-dark', '--rose', '--eye', '--ant', '--pear', '--apple', '--lemon', '--grape'];
const catCss = () => { try {
  // a style rule kept whole (it has cssRules too, for nesting); @media and the like opened up
  const flat = rs => [...rs].flatMap(r => r.selectorText !== undefined ? [r] : r.cssRules ? flat(r.cssRules) : []);
  const rules = [...document.styleSheets].flatMap(s => flat(s.cssRules));
  const light = rules.find(r => r.selectorText === ':root' && r.style.getPropertyValue('--fur'));
  return (light ? '.cat{' + PALETTE.map(v => v + ':' + light.style.getPropertyValue(v)).join(';') + '}' : '') +
    rules.filter(r => r.selectorText && /(^|,\s*)\.cat\b/.test(r.selectorText)).map(r => r.cssText).join('');
} catch(e){ return ''; } };
// d: weekData() from app.js; withName: the grown-up's choice
export function weeklySvg(d, withName, font = ''){
  const ui = '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', num = 'Fredoka, ' + ui;
  const txt = (x, y, size, s, o = {}) => '<text x="' + x + '" y="' + y + '" font-size="' + size + '" font-family="' + (o.num ? num : ui) + '" font-weight="' +
    (o.w || 600) + '" fill="' + (o.fill || '#0F171F') + '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') + '>' + esc(s) + '</text>';
  // the mascot: its own <svg>, placed and sized inside the card
  const cat = mascotSvg(d.mascot, 'happy').replace('<svg ', '<svg x="790" y="60" width="230" height="215" ');
  const stat = (x, n, label) => txt(x, 860, 84, n, { num: true, w: 500 }) + txt(x, 912, 34, label, { fill: '#555F69' });
  const days = d.days.map((x, k) => { const cx = 120 + k * 140;
    return '<circle cx="' + cx + '" cy="1030" r="40" fill="' + (x.played ? '#006AC0' : 'rgba(15,23,31,.08)') + '"/>' +
      (x.played ? '<path d="M' + (cx - 16) + ' 1031 l11 11 l21 -23" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : '') +
      txt(cx, 1110, 32, x.label, { anchor: 'middle', fill: '#555F69' }); }).join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
    '<style>' + (font ? '@font-face{font-family:Fredoka;src:url(' + font + ') format("woff2");font-weight:300 700}' : '') +
    catCss() + '.cat [class*="only-"],.cat .talkmouth,.cat .arm,.cat .fx{display:none}.cat .only-happy{display:inline}.cat *{animation:none!important}</style>' +   // its happy face, standing still
    '<rect width="' + W + '" height="' + H + '" fill="#F0F4F7"/>' +
    '<rect x="40" y="40" width="' + (W - 80) + '" height="' + (H - 80) + '" rx="64" fill="#FFFFFF"/>' + cat +
    txt(100, 190, 66, withName && d.name ? t('weekOf', d.name) : t('weekPlain'), { w: 700 }) +
    txt(100, 258, 38, d.range, { fill: '#555F69', w: 500 }) +
    (d.pct === null ? '' : txt(96, 560, 230, d.pct + '%', { num: true, w: 500, fill: '#00569F' }) + txt(104, 630, 42, t('firstTryShort'), { fill: '#555F69' })) +
    stat(100, d.rounds, t('roundsWord', d.rounds)) + stat(430, d.fresh, t('newLevelsWord', d.fresh)) + stat(760, d.tasks, t('tasksWord', d.tasks)) +
    days +
    (d.best ? txt(100, 1200, 32, t('bestWeak', d.best, d.weak), { fill: '#555F69', w: 500 }) : '') +
    '<rect x="100" y="1232" width="56" height="56" rx="16" fill="#006AC0"/>' + txt(128, 1272, 30, '10', { num: true, anchor: 'middle', fill: '#fff' }) +
    txt(176, 1272, 34, t('appName'), { w: 700 }) +
    '</svg>';
}

export async function weeklyPng(d, withName){
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(weeklySvg(d, withName, await fredoka()));
  await img.decode();
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  c.getContext('2d').drawImage(img, 0, 0);
  return new Promise((ok, no) => c.toBlob(b => b ? ok(b) : no(new Error('no PNG')), 'image/png'));
}

// The tap: the share sheet with the picture where the device can, else a download
export function shareWeekly(blob, name){
  const file = new File([blob], name, { type: 'image/png' });
  if(navigator.canShare && navigator.canShare({ files: [file] })) return navigator.share({ files: [file] }).catch(() => {});   // closed without sharing: nothing to do
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}
