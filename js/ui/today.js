// Today (#/today), the home screen of the Десетка 2026 redesign: hello, the streak and the rounds played today and
// this week, the level to play now (or the round to go back to), every level due again, the countdown to her next
// competition with how ready she is, and the practice paper. Two columns on a wide screen (app.css).
// app.js gathers the data (todayData) and does the playing; this only draws. Same classes as the picker's cards.
import { h, render } from '../vendor/preact.js';
import htm from '../vendor/htm.js';
import { go, playLevel, todayData, trainFor } from '../app.js';
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
      ${d.week > d.roundsToday && html`<span class="pill">${t('weekRounds', d.week)}</span>`}
    </div>
    <div class="tcols">
      <div class="tcol">
        ${d.mid && html`<button class="gcard nextcard main" onClick=${() => go('play', true)}><span class="nm"><span class="lab">${t('goOn')}</span><span class="eq">${d.mid}</span></span>${CHEV}</button>`}
        ${d.next ? html`<${LevelCard} l=${d.next} lab=${t(d.next.review ? 'reviewNext' : 'startHere')} cls=${d.mid ? '' : 'main'}/>`
                 : html`<div class="gcard advice">${t('allLearned')}</div>`}
        ${d.due.length > 0 && html`<div class="gtitle"><b>${t('reviewNext')}</b><span>${t('dueToday', d.due.length)}</span></div>
          <div class="duegrid">${d.due.map(l => html`<${LevelCard} l=${l}/>`)}</div>`}
      </div>
      <div class="tcol">
        ${d.paper && html`<button class="gcard paperday" data-at=${d.paper.at} onClick=${() => trainFor(d.paper.at)}>
          <span class="nm"><span class="lab">${d.paper.name}</span><span class="eq">${d.paper.when}</span><span class="meta">${t('inDays', d.paper.days)}</span></span>
          <span class="ready" title=${t('readyHow')}><b>${d.paper.ready}%</b><span class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow=${d.paper.ready}
            aria-label=${t('readyPct', d.paper.ready)}><i style=${{ width: d.paper.ready + '%' }}></i></span></span></button>`}
        ${(d.notebook.total > 0 || d.notebook.done.some(x => x.recheck)) && html`<button class="gcard nextcard nbcard" onClick=${() => go('notebook')}>
          <span class="nm"><span class="lab">${t('notebook')}</span><span class="eq">${d.notebook.total ? t('nbKinds', d.notebook.open.length, d.notebook.total) : t('nbRecheck')}</span></span>${CHEV}</button>`}
        <button class="gcard nextcard comp" onClick=${() => startComp()}><span class="nm"><span class="lab">${t('compName')}</span><span class="eq">${t('compWhat', d.compN, d.compMin)}</span></span>${CHEV}</button>
        <button class="btn ghost" onClick=${() => go('levels', true)}>${t('chooseLevel')}</button>
      </div>
    </div>`;
}

export const showToday = el => render(html`<${Today}/>`, el);
