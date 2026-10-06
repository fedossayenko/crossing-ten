// The mistakes notebook (#/notebook): the mistakes that come back, by kind, each with the tasks she missed
// (drawn again from their seeds) and a button to put them right; a kind put right this week, and one to check
// again a week on. app.js gathers it (notebookData) and plays the rounds (fixKind); this only draws.
import { h, render } from '../vendor/preact.js';
import htm from '../vendor/htm.js';
import { back, fixKind, notebookData } from '../app.js';
import { t } from '../i18n.js';

const html = htm.bind(h);
const BACK = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>`;

const Kind = ({ g }) => html`
  <div class="gcard nbkind" data-kind=${g.kind}>
    <div class="nbhead"><span class="nbn">×${g.items.length}</span><div><b>${g.name}</b>${g.desc && html`<span>${g.desc}</span>`}</div></div>
    <div class="nbitems">${g.items.slice(0, 3).map(x => html`<div class="nbitem"><span class="eq">${x.text}</span><s>${x.wrote}</s></div>`)}</div>
    <button class="btn" onClick=${() => fixKind(g.kind)}>${t('fixN', g.items.length)}</button>
  </div>`;

function Notebook(){
  const d = notebookData();
  return html`
    <div class="bar"><button class="icon back" aria-label=${t('back')} onClick=${() => back()}>${BACK}</button>
      <div class="hello"><h1>${t('notebook')}</h1><div class="date">${t('nbSub')}</div></div></div>
    ${d.total > 0 && html`<div class="gcard nbtotal"><span class="big">${d.total}</span><span>${t('nbToFix')}</span></div>`}
    ${d.open.map(g => html`<${Kind} key=${g.kind} g=${g}/>`)}
    ${d.done.map(x => x.recheck
      ? html`<div class="gcard nbkind" data-kind=${x.kind}><div class="nbhead"><div><b>${x.name}</b><span>${t('nbRecheckSub')}</span></div></div>
          <button class="btn ghost" onClick=${() => fixKind(x.kind, true)}>${t('nbRecheck')}</button></div>`
      : html`<div class="banner good nbdone" data-kind=${x.kind}><div><b>${x.name}</b><span>${t('nbFixed', x.when)}</span></div></div>`)}
    ${!d.total && !d.done.length && html`<div class="gcard advice">${t('nbEmpty')}</div>`}
    <p class="nbhow">${t('nbHow')}</p>`;
}

export const showNotebook = el => render(html`<${Notebook}/>`, el);
