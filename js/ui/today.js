// Today (#/today), the home screen of the Десетка 2026 redesign: hello, the streak and the rounds played today,
// the level to play now (or the round to go back to), the levels due again, and the practice paper.
// app.js gathers the data (todayData) and does the playing; this only draws. Same classes as the picker's cards.
import { h, render } from '../vendor/preact.js';
import htm from '../vendor/htm.js';
import { go, playLevel, todayData } from '../app.js';
import { startComp } from '../compete.js';
import { LANG, LANG_TAG, t } from '../i18n.js';

const html = htm.bind(h);
const CHEV = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>`;
const Dots = ({ d }) => html`<span class="dots5" title=${t('difficulty', d)} aria-label=${t('difficulty', d)}>${[1, 2, 3, 4, 5].map(k => html`<i class=${k <= d ? 'on' : ''}></i>`)}</span>`;
const LevelCard = ({ l, lab, cls }) => html`
  <button class=${'gcard nextcard ' + (cls || '')} data-lvl=${l.id} onClick=${() => playLevel(l.id)}>
    <span class="nm">${lab && html`<span class="lab">${lab}</span>`}<span class="eq">${l.name}</span><span class="meta"><span>${l.group}</span><${Dots} d=${l.d}/></span></span>${CHEV}
  </button>`;

function Today(){
  const d = todayData();
  const date = new Date().toLocaleDateString(LANG_TAG[LANG], { weekday: 'long', day: 'numeric', month: 'long' });
  return html`
    <div class="bar today-bar"><div class="hello"><h1>${t('helloName', d.name)}</h1><div class="date">${date}</div></div></div>
    <div class="chiprow">
      ${d.streak > 0 && html`<span class="pill warm">${t('streakDays', d.streak)}</span>`}
      <span class="pill">${t('roundsToday', d.roundsToday)}</span>
    </div>
    ${d.mid && html`<button class="gcard nextcard main" onClick=${() => go('play', true)}><span class="nm"><span class="lab">${t('goOn')}</span><span class="eq">${d.mid}</span></span>${CHEV}</button>`}
    ${d.next ? html`<${LevelCard} l=${d.next} lab=${t(d.next.review ? 'reviewNext' : 'startHere')} cls=${d.mid ? '' : 'main'}/>`
             : html`<div class="gcard advice">${t('allLearned')}</div>`}
    ${d.due.length > 0 && html`<div class="gtitle"><b>${t('reviewNext')}</b></div>
      <div class="duegrid">${d.due.map(l => html`<${LevelCard} l=${l}/>`)}</div>`}
    <button class="gcard nextcard comp" onClick=${() => startComp()}><span class="nm"><span class="lab">${t('compName')}</span><span class="eq">${t('compWhat', d.compN, d.compMin)}</span></span>${CHEV}</button>
    <button class="btn ghost" onClick=${() => go('levels', true)}>${t('chooseLevel')}</button>`;
}

export const showToday = el => render(html`<${Today}/>`, el);
