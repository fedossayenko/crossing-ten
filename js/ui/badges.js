// The badges screen as a Preact component — R0, the redesign's framework trial (PLAN.md). It draws what
// renderStats draws by hand under the screen's own bar (the next badge, all sixteen with the one tapped explained, the
// three tiles), with the same markup and classes, so app.css applies unchanged. Shown with ?ui=next only.
import { h, render } from '../vendor/preact.js';
import { useState } from '../vendor/hooks.js';
import htm from '../vendor/htm.js';
import { BADGES, FAM, GLYPH, badgeName, badgeNeed, statsFrom } from '../app.js';
import { t } from '../i18n.js';

const html = htm.bind(h);

function Medal({ b, got }){
  const [ring, disc, ink, ribbon] = FAM[got ? b.fam : 'lock'], [how, d] = GLYPH[b.g];
  return html`<svg viewBox="0 0 96 118" aria-hidden="true">
    ${got && html`<path d="M28 64L20 114 48 100 76 114 68 64Z" fill=${ribbon}/><path d="M34 66L30 106 48 98 66 106 62 66Z" fill=${ring}/>
      <path d="M48 98L38 103 40 72Z M48 98L58 103 56 72Z" fill="rgba(0,0,0,0.16)"/>`}
    <circle cx="48" cy="50" r="45" fill=${ribbon}/><circle cx="48" cy="48" r="44" fill=${ring}/>
    <circle cx="48" cy="48" r="35" fill=${disc}/><circle cx="48" cy="48" r="35" fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="3"/>
    <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
    <path d="M19 36a32 32 0 0 1 21-21" stroke="rgba(255,255,255,0.85)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <g transform="translate(27 27) scale(1.75)"><path d=${d} fill=${how === 'fill' ? ink : 'none'} stroke=${how === 'stroke' ? ink : 'none'}
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
    ${!got && html`<g><circle cx="78" cy="80" r="13" fill="#5F6675" stroke="#fff" stroke-width="2"/><rect x="72" y="79" width="12" height="9" rx="2" fill="#fff"/>
      <path d="M74.5 79v-2.5a3.5 3.5 0 0 1 7 0V79" stroke="#fff" stroke-width="2" fill="none"/></g>`}
  </svg>`;
}

const Tile = ({ n, label }) => html`<div class="tile"><span class="n">${n}</span><span class="t">${label}</span></div>`;

export function Badges({ rounds }){
  const st = statsFrom(rounds), [picked, pick] = useState(null);
  // the next badge: the unearned one she is closest to
  const next = BADGES.filter(b => !b.has(st)).map(b => { const [a, n] = b.prog(st); return { b, a: Math.min(a, n), n, f: a / n }; })
    .sort((x, y) => y.f - x.f)[0];
  const need = b => { const [a, n] = b.prog(st); return badgeName(b) + ' · ' + badgeNeed(b) + (b.has(st) ? ' ✓' : ' · ' + Math.min(a, n) + ' / ' + n); };
  const pc = st.sums ? Math.round(100*st.first/st.sums) : 0;
  return html`
    ${next && html`<div class="gcard nextbadge"><${Medal} b=${next.b} got=${false}/><div class="nb"><div class="lab">${t('nextBadge')}</div>
      <div class="nbname">${badgeName(next.b)} <span>· ${badgeNeed(next.b)}</span></div>
      <div class="meter"><span class="track" role="progressbar" aria-valuemin="0" aria-valuemax=${next.n} aria-valuenow=${next.a}>
        <i style=${{ width: Math.round(100*next.f) + '%' }}></i></span><span>${next.a} / ${next.n}</span></div></div></div>`}
    <div class="gcard">
      <div class="gtitle"><b>${t('allBadges')}</b><span>${t('tapBadge')}</span></div>
      <div class="badges">${BADGES.map(b => { const on = b.has(st); return html`
        <button class="badge" key=${b.id} data-b=${b.id} aria-pressed=${String(picked === b)} onClick=${() => pick(b)}
          aria-label=${badgeName(b) + ' – ' + badgeNeed(b) + ' (' + t(on ? 'earned' : 'notYetEarned') + ')'}><${Medal} b=${b} got=${on}/><span class="nm">${badgeName(b)}</span></button>`; })}
      </div>
      <div class="badgeneed" aria-live="polite">${picked ? need(picked) : ''}</div>
    </div>
    <div class="bigstat"><${Tile} n=${st.sums} label=${t('sumsDone')}/><${Tile} n=${pc + '%'} label=${t('firstTry')}/><${Tile} n=${st.streak} label=${t('daysRow', st.streak)}/></div>`;
}

// Draw it into a container (again on every call: Preact keeps what has not changed).
export const showBadges = (el, rounds) => render(html`<${Badges} rounds=${rounds}/>`, el);
