// The mascots. Every animal shares one face - eyes, brows, mouths and sparks sit in the
// same place on all of them - so the moods in app.css (idle, happy, sad, nod, tilt,
// wiggle, dance, party) move any of them. An animal is only its fur: tail, body, paws,
// ears and head, plus the colours the shared face borrows (--eye for the iris,
// --fur-dark for the mouth and brows). Drawn after the design canvas's mascot sheet.
const MASCOTS = {
  cat: {
    view:'0 0 240 224', vars:'',
    tail:'<path d="M170,204 C212,208 226,178 212,156 C204,143 187,142 180,154" stroke="var(--fur)" stroke-width="15" stroke-linecap="round" fill="none"/>',
    body:'<path d="M120,120 C158,120 175,158 178,190 C180,207 168,209 120,209 C72,209 60,207 62,190 C65,158 82,120 120,120 Z" fill="var(--fur)"/>' +
         '<path d="M120,132 C138,140 144,162 144,186 C144,202 136,208 120,210 C104,208 96,202 96,186 C96,162 102,140 120,132 Z" fill="var(--fur-light)" opacity=".72"/>',
    pawL:'<ellipse cx="100" cy="203" rx="19" ry="9" fill="var(--fur-light)"/><path d="M93,201 v6 M100,200 v7 M107,201 v6" stroke="var(--fur-dark)" stroke-width="2" stroke-linecap="round" opacity=".42"/>',
    pawR:'<ellipse cx="140" cy="203" rx="19" ry="9" fill="var(--fur-light)"/><path d="M133,201 v6 M140,200 v7 M147,201 v6" stroke="var(--fur-dark)" stroke-width="2" stroke-linecap="round" opacity=".42"/>',
    earL:'<path d="M80,60 L64,14 L114,40 Z" fill="var(--fur)"/><path d="M84,55 L76,28 L104,43 Z" fill="var(--rose)" opacity=".8"/>',
    earR:'<path d="M160,60 L176,14 L126,40 Z" fill="var(--fur)"/><path d="M156,55 L164,28 L136,43 Z" fill="var(--rose)" opacity=".8"/>',
    head:'<ellipse cx="120" cy="88" rx="63" ry="54" fill="var(--fur)"/>' +
         '<path d="M100,44 q7,13 4,25 M120,40 q0,14 0,24 M140,44 q-7,13 -4,25" stroke="var(--fur-dark)" stroke-width="5" stroke-linecap="round" opacity=".38" fill="none"/>' +
         '<ellipse cx="120" cy="107" rx="28" ry="21" fill="var(--fur-light)"/>',
    nose:'<path d="M120,112 l-9,-7 h18 Z" fill="var(--rose)"/>',
    whiskers:'<path d="M104,110 C84,105 68,104 52,107 M104,116 C84,117 66,120 50,125 M136,110 C156,105 172,104 188,107 M136,116 C156,117 174,120 190,125" stroke="var(--fur-light)" stroke-width="2.2" stroke-linecap="round" fill="none"/>'
  },
  fox: {
    view:'0 -32 240 256', vars:'--eye:#4E8F6E;--fur-dark:#3E2A1E',
    tail:'<path d="M168,200 C216,206 234,168 216,140 C206,126 188,128 180,142" stroke="#E07B39" stroke-width="22" stroke-linecap="round" fill="none"/>' +
         '<path d="M222,152 C228,168 222,186 208,198" stroke="#FBF1E6" stroke-width="12" stroke-linecap="round" fill="none"/>',
    body:'<path d="M120,120 C160,120 178,158 180,190 C182,207 168,209 120,209 C72,209 58,207 60,190 C62,158 80,120 120,120 Z" fill="#E07B39"/>' +
         '<path d="M120,134 C140,142 146,164 146,188 C146,202 136,208 120,210 C104,208 94,202 94,188 C94,164 100,142 120,134 Z" fill="#FBF1E6"/>',
    pawL:'<ellipse cx="98" cy="203" rx="20" ry="9" fill="#3E2A1E"/>',
    pawR:'<ellipse cx="142" cy="203" rx="20" ry="9" fill="#3E2A1E"/>',
    earL:'<path d="M84,64 L56,-4 L124,42 Z" fill="#E07B39"/><path d="M62,10 L56,-4 L76,10 Z" fill="#3E2A1E"/><path d="M88,56 L72,20 L110,46 Z" fill="#F6D9C4"/>',
    earR:'<path d="M156,64 L184,-4 L116,42 Z" fill="#E07B39"/><path d="M178,10 L184,-4 L164,10 Z" fill="#3E2A1E"/><path d="M152,56 L168,20 L130,46 Z" fill="#F6D9C4"/>',
    head:'<ellipse cx="120" cy="88" rx="68" ry="58" fill="#E07B39"/>' +
         '<path d="M54,84 C40,104 46,132 70,136 C60,122 60,104 68,92 Z" fill="#FBF1E6"/><path d="M186,84 C200,104 194,132 170,136 C180,122 180,104 172,92 Z" fill="#FBF1E6"/>' +
         '<ellipse cx="120" cy="112" rx="34" ry="24" fill="#FBF1E6"/>' +
         '<path d="M112,44 q8,-10 16,0 q-8,14 -16,0 Z" fill="#F6D9C4" opacity=".7"/>' +
         '<circle cx="72" cy="108" r="9" fill="#F09A8C" opacity=".5"/><circle cx="168" cy="108" r="9" fill="#F09A8C" opacity=".5"/>',
    nose:'<path d="M120,116 l-9,-7 h18 Z" fill="#2A1E18"/><circle cx="117" cy="111" r="1.6" fill="#fff" opacity=".8"/>',
    whiskers:''
  },
  owl: {
    view:'0 -32 240 256', vars:'--eye:#E8A33D;--fur-dark:#4A3A2A',
    tail:'',
    body:'<path d="M120,112 C170,112 188,158 188,194 C188,212 160,214 120,214 C80,214 52,212 52,194 C52,158 70,112 120,112 Z" fill="#8B6B4E"/>' +
         '<ellipse cx="120" cy="178" rx="38" ry="32" fill="#D9C3A5"/>' +
         '<path d="M100,160 q10,10 20,0 M120,160 q10,10 20,0 M90,178 q10,10 20,0 M110,178 q10,10 20,0 M130,178 q10,10 20,0 M100,196 q10,10 20,0 M120,196 q10,10 20,0" stroke="#B89B78" stroke-width="3" fill="none" stroke-linecap="round"/>' +
         '<path d="M54,150 C34,172 40,202 62,208 C58,182 66,160 80,140 Z" fill="#6E533B"/><path d="M186,150 C206,172 200,202 178,208 C182,182 174,160 160,140 Z" fill="#6E533B"/>' +
         '<path d="M48,180 q8,8 16,0 M46,194 q8,8 16,0 M176,180 q8,8 16,0 M178,194 q8,8 16,0" stroke="#8B6B4E" stroke-width="3" fill="none" stroke-linecap="round"/>',
    pawL:'<path d="M98,210 l-7,10 M103,210 v11 M108,210 l7,10" stroke="#E8A33D" stroke-width="4.5" stroke-linecap="round"/>',
    pawR:'<path d="M132,210 l-7,10 M137,210 v11 M142,210 l7,10" stroke="#E8A33D" stroke-width="4.5" stroke-linecap="round"/>',
    earL:'<path d="M72,52 L52,4 L100,36 Z" fill="#8B6B4E"/>',
    earR:'<path d="M168,52 L188,4 L140,36 Z" fill="#8B6B4E"/>',
    head:'<ellipse cx="120" cy="88" rx="72" ry="60" fill="#8B6B4E"/>' +
         '<path d="M120,124 C96,124 62,110 62,82 C62,62 80,50 97,54 C106,56 114,62 120,70 C126,62 134,56 143,54 C160,50 178,62 178,82 C178,110 144,124 120,124 Z" fill="#D9C3A5"/>' +
         '<path d="M70,60 q20,-14 40,-2 M170,60 q-20,-14 -40,-2" stroke="#6E533B" stroke-width="6" stroke-linecap="round" fill="none"/>' +
         '<circle cx="72" cy="108" r="9" fill="#C98A6A" opacity=".5"/><circle cx="168" cy="108" r="9" fill="#C98A6A" opacity=".5"/>' +
         '<circle cx="97" cy="85" r="23" fill="#fff"/><circle cx="143" cy="85" r="23" fill="#fff"/>',
    nose:'<path d="M120,98 l-10,3 l10,17 l10,-17 Z" fill="#E8A33D"/>',
    whiskers:''
  },
  bun: {
    view:'0 -32 240 256', vars:'--eye:#4F87B3;--fur-dark:#5A6275',
    tail:'<circle cx="178" cy="190" r="16" fill="#E6EAF1"/><circle cx="184" cy="184" r="7" fill="#F4F6F9"/>',
    body:'<path d="M120,124 C160,124 178,160 180,190 C182,207 166,209 120,209 C74,209 58,207 60,190 C62,160 80,124 120,124 Z" fill="#B9C1D2"/>' +
         '<ellipse cx="120" cy="182" rx="28" ry="24" fill="#E6EAF1"/>',
    pawL:'<ellipse cx="98" cy="203" rx="20" ry="9" fill="#E6EAF1"/><path d="M92,201 v6 M98,200 v7 M104,201 v6" stroke="#B9C1D2" stroke-width="2" stroke-linecap="round"/>',
    pawR:'<ellipse cx="142" cy="203" rx="20" ry="9" fill="#E6EAF1"/><path d="M136,201 v6 M142,200 v7 M148,201 v6" stroke="#B9C1D2" stroke-width="2" stroke-linecap="round"/>',
    earL:'<ellipse cx="92" cy="22" rx="17" ry="50" transform="rotate(-12 92 22)" fill="#B9C1D2"/><ellipse cx="92" cy="26" rx="8" ry="36" transform="rotate(-12 92 22)" fill="#E9B7BD"/>',
    earR:'<ellipse cx="148" cy="22" rx="17" ry="50" transform="rotate(12 148 22)" fill="#B9C1D2"/><ellipse cx="148" cy="26" rx="8" ry="36" transform="rotate(12 148 22)" fill="#E9B7BD"/>',
    head:'<ellipse cx="120" cy="92" rx="62" ry="54" fill="#B9C1D2"/>' +
         '<path d="M60,96 C48,110 52,130 70,132 C62,120 64,106 70,98 Z" fill="#E6EAF1"/><path d="M180,96 C192,110 188,130 170,132 C178,120 176,106 170,98 Z" fill="#E6EAF1"/>' +
         '<ellipse cx="120" cy="112" rx="24" ry="17" fill="#E6EAF1"/>' +
         '<circle cx="72" cy="108" r="9" fill="#E9B7BD" opacity=".5"/><circle cx="168" cy="108" r="9" fill="#E9B7BD" opacity=".5"/>',
    nose:'<path d="M120,112 l-7,-5 h14 Z" fill="#D98A93"/>',
    whiskers:'<path d="M96,112 C84,110 74,110 64,112 M96,117 C84,118 74,120 64,124 M144,112 C156,110 166,110 176,112 M144,117 C156,118 166,120 176,124" stroke="#8D95A8" stroke-width="2" stroke-linecap="round" fill="none"/>'
  }
};
// The face every animal shares, and the moods it shows (see .only-* in app.css).
const FACE =
  '<g class="eyes-open only-idle"><ellipse cx="97" cy="85" rx="14" ry="16" fill="var(--eye)"/><ellipse cx="143" cy="85" rx="14" ry="16" fill="var(--eye)"/>' +
  '<ellipse cx="97" cy="85" rx="4.4" ry="12" fill="#15181d"/><ellipse cx="143" cy="85" rx="4.4" ry="12" fill="#15181d"/>' +
  '<circle cx="93" cy="79" r="2.8" fill="#fff" opacity=".9"/><circle cx="139" cy="79" r="2.8" fill="#fff" opacity=".9"/></g>' +
  '<g class="eyes-open only-sad"><ellipse cx="97" cy="85" rx="14" ry="16" fill="var(--eye)"/><ellipse cx="143" cy="85" rx="14" ry="16" fill="var(--eye)"/>' +
  '<ellipse cx="97" cy="85" rx="4.4" ry="12" fill="#15181d"/><ellipse cx="143" cy="85" rx="4.4" ry="12" fill="#15181d"/></g>' +
  '<g class="only-sad"><path d="M83,64 L108,73 M157,64 L132,73" stroke="var(--fur-dark)" stroke-width="5" stroke-linecap="round" fill="none"/></g>' +
  '<g class="only-happy"><path d="M85,89 q12,-15 24,0 M131,89 q12,-15 24,0" stroke="#15181d" stroke-width="5.5" stroke-linecap="round" fill="none"/>' +
  '<path class="spark" d="M186,66 l0,-16 M178,58 l16,0" stroke="var(--good)" stroke-width="4.5" stroke-linecap="round" fill="none"/>' +
  '<path class="spark b" d="M56,52 l0,-12 M50,46 l12,0" stroke="var(--good)" stroke-width="4" stroke-linecap="round" fill="none"/></g>';
const MOUTHS =
  '<path class="only-idle" d="M120,113 v5 M120,118 q-1,7 -10,7 M120,118 q1,7 10,7" stroke="var(--fur-dark)" stroke-width="2.8" stroke-linecap="round" fill="none"/>' +
  '<path class="only-happy" d="M120,113 v4 M120,117 q-2,11 -13,7 M120,117 q2,11 13,7" stroke="var(--fur-dark)" stroke-width="3" stroke-linecap="round" fill="none"/>' +
  '<path class="only-sad" d="M120,113 v5 M109,128 q11,-9 22,0" stroke="var(--fur-dark)" stroke-width="3" stroke-linecap="round" fill="none"/>';
function mascotInner(key){
  const m = MASCOTS[key] || MASCOTS.cat;
  return '<g class="whole"><g class="tail">' + m.tail + '</g>' +
    '<g class="body">' + m.body + '<g class="paw paw-l">' + m.pawL + '</g><g class="paw paw-r">' + m.pawR + '</g></g>' +
    '<g class="head"><g class="ear ear-l">' + m.earL + '</g><g class="ear ear-r">' + m.earR + '</g>' +
    m.head + FACE + m.nose + MOUTHS + m.whiskers + '</g></g>';
}
// A whole mascot as markup, for the player tiles and the mascot choice.
const mascotSvg = (key, mood) => { const m = MASCOTS[key] || MASCOTS.cat;
  return '<svg class="cat" data-mood="' + (mood || 'idle') + '" viewBox="' + m.view + '" style="' + m.vars + '" aria-hidden="true">' + mascotInner(key) + '</svg>'; };
// Dress the page's own mascot (the one whose moods follow the round) as this animal.
function wearMascot(el, key){
  const m = MASCOTS[key] || MASCOTS.cat;
  el.setAttribute('viewBox', m.view); el.setAttribute('style', m.vars);
  el.innerHTML = mascotInner(key);
}
