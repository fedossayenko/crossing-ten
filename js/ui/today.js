// Today (#/today), the home screen of the Десетка 2026 redesign: hello, the streak and the rounds played today and
// this week, the level to play now (or the round to go back to), every level due again, the countdown to her next
// competition with how ready she is, and the practice paper. Two columns on a wide screen (app.css).
// app.js gathers the data (todayData) and does the playing; this only draws. Same classes as the picker's cards.
import { h, render } from '../vendor/preact.js';
import htm from '../vendor/htm.js';
import { go, playLevel, todayData, trainFor } from '../app.js';
import { startComp } from '../compete.js';
import { LANG, LANG_TAG, t } from '../i18n.js';
import { mascotSvg } from '../mascots.js';

const html = htm.bind(h);
const CHEV = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>`;
const Dots = ({ d }) => html`<span class="dots5" title=${t('difficulty', d)} aria-label=${t('difficulty', d)}>${[1, 2, 3, 4, 5].map(k => html`<i class=${k <= d ? 'on' : ''}></i>`)}</span>`;

// "Започни тук": what it is, then Play — and on a wide screen, another level
const StartCard = ({ l, lab, main }) => html`
  <div class=${'gcard nextcard start ' + (main ? 'main' : '')} data-lvl=${l.id} onClick=${() => playLevel(l.id)}>
    <span class="nm">${lab && html`<span class="lab">${lab}</span>`}<span class="eq">${l.name}</span>
      <span class="meta"><span>${l.group}</span><${Dots} d=${l.d}/></span><span class="desc">${l.desc}</span></span>
    <span class="acts"><button class="btn" onClick=${e => { e.stopPropagation(); playLevel(l.id); }}>${t('play')}</button>
      <button class="btn ghost other" onClick=${e => { e.stopPropagation(); go('levels', true); }}>${t('otherLevel')}</button></span>
  </div>`;

function Today(){
  const d = todayData();
  const date = new Date().toLocaleDateString(LANG_TAG[LANG], { weekday: 'long', day: 'numeric', month: 'long' });
  return html`
    <div class="bar today-bar"><div class="hello"><h1>${t('helloName', d.name)}</h1><div class="date">${date}</div></div><span class="hellocat" dangerouslySetInnerHTML=${{ __html: mascotSvg(d.mascot) }}></span></div>
    <div class="chiprow">
      ${d.streak > 0 && html`<span class="pill warm">${t('streakDays', d.streak)}</span>`}
      <span class="pill">${t('roundsToday', d.roundsToday)}</span>
      ${d.week > d.roundsToday && html`<span class="pill">${t('weekRounds', d.week)}</span>`}
    </div>
    <div class="tcols">
      <div class="tcol">
        ${d.mid && html`<button class="gcard nextcard main" onClick=${() => go('play', true)}><span class="nm"><span class="lab">${t('goOn')}</span><span class="eq">${d.mid}</span></span>${CHEV}</button>`}
        ${d.next ? html`<${StartCard} l=${d.next} lab=${t(d.next.review ? 'reviewNext' : 'startHere')} main=${!d.mid}/>`
                 : html`<div class="gcard advice">${t('allLearned')}</div>`}
        ${d.due.length > 0 && html`<div class="gtitle"><b>${t('forToday')}</b><span>${t('dueToday', d.due.length)}</span></div>
          <div class="gcard list duelist">${d.due.map(l => html`<button class="duerow" data-lvl=${l.id} onClick=${() => playLevel(l.id)}>
            <span class="nm"><span class="eq">${l.name}</span><span class="meta">${l.group} · ${t('learned')}</span></span>${CHEV}</button>`)}</div>
          <p class="nbhow">${t('spacing')}</p>`}
      </div>
      <div class="tcol">
        ${d.paper && html`<button class="gcard paperday" data-at=${d.paper.at} onClick=${() => trainFor(d.paper.at)}>
          <span class="nm"><span class="lab">${d.paper.name}</span><span class="eq">${d.paper.when}</span><span class="meta">${t('inDays', d.paper.days)}</span></span>
          <span class="ready" title=${t('readyHow')}><b>${d.paper.ready}%</b><span class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow=${d.paper.ready}
            aria-label=${t('readyPct', d.paper.ready)}><i style=${{ width: d.paper.ready + '%' }}></i></span></span></button>`}
        ${(d.notebook.total > 0 || d.notebook.done.some(x => x.recheck)) && html`<button class="gcard nextcard nbcard" onClick=${() => go('notebook')}>
          <span class="nm"><span class="lab">${t('notebook')}</span><span class="eq">${d.notebook.total ? t('nbKinds', d.notebook.open.length, d.notebook.total) : t('nbRecheck')}</span></span>${CHEV}</button>`}
        ${d.badge && html`<button class="gcard nextcard badgecard" onClick=${() => go('badges')}><span class="nm"><span class="lab">${t('badgeLeft', d.badge.left, d.badge.name)}</span>
          <span class="eq">${t('badgesOf', d.badge.earned, d.badge.total)}</span></span>${CHEV}</button>`}
        <div class="gcard weekstrip">
          <div class="gtitle"><b>${t('thisWeek')}</b><span>${t('learnedOf', d.learned, d.levels)}</span></div>
          <div class="days">${d.days.map(x => html`<span class=${x.played ? 'on' : ''}><i></i>${x.label}</span>`)}</div>
        </div>
        <button class="gcard nextcard comp" onClick=${() => startComp()}><span class="nm"><span class="lab">${t('compName')}</span><span class="eq">${t('compWhat', d.compN, d.compMin)}</span></span>${CHEV}</button>
      </div>
    </div>`;
}

export const showToday = el => render(html`<${Today}/>`, el);
