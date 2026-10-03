// Question kind 'films': level 144 Филмите — Who acted in which film: count the films, not the parts.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2023, задача 6: the father is in 2 films; the mother in one of those and 2 more; the brother in one
// with both parents, 2 alone and one with one parent. Films with at least one of them: 2 + 2 + 2 = 6 — the
// shared films were counted already. Adding up every part (2 + 3 + 4 = 9) is the trap.
function genFilms(){
  const f = 2 + rnd(3), m = 1 + rnd(3), x = 1 + rnd(3);
  return {kind:'films', f, m, x, traps:[f + (1 + m) + (2 + x), f + m + x + 1], ans: f + m + x};
}
const filmBg = n => n + ' ' + (n === 1 ? 'филм' : 'филма'), filmUk = n => n + ' ' + (n === 1 ? 'фільмі' : 'фільмах');
function drawFilms(q){
  if(q.kind === 'films'){
    return '<div class="ask">' + tr('Бащата на Яна участва в ' + filmBg(q.f) + '. Майка ѝ участва в един от тези филми и в още ' + (q.m === 1 ? 'един' : q.m) + ' ' + (q.m === 1 ? 'филм' : 'други') +
      '. Брат ѝ участва в един филм заедно с двамата си родители, в ' + filmBg(q.x) + ' сам и в един филм заедно с един от родителите си. В колко филма има участие на <b>поне един</b> роднина на Яна?',
      'Тато Яни знімався у ' + filmUk(q.f) + '. Мама знімалася в одному з цих фільмів і ще в ' + filmUk(q.m).replace(/^1 фільмі/, 'одному')+
      '. Брат знімався в одному фільмі разом з обома батьками, у ' + filmUk(q.x) + ' сам і в одному фільмі разом з одним із батьків. У скількох фільмах знімався <b>хоча б один</b> родич Яни?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqFilms(q){
  if(q.kind === 'films') return q.f + ' + ' + q.m + ' + ' + q.x + ' = ' + q.ans;
}
function whyFilms(q, full){
  if(q.kind === 'films'){
    if(!full) return tr('Нарисувай филмите като кръгчета. Кои филми на майката и на брат ѝ вече са нарисувани?', 'Намалюй фільми кружечками. Які фільми мами й брата вже намальовані?');
    const nw = n => '<b>' + n + '</b> ' + tr(n === 1 ? 'нов' : 'нови', ukN(n, 'новий', 'нові', 'нових').replace(/^\d+ /, ''));
    return tr('филмите на бащата: <b>' + q.f + '</b>; на майката — още ' + nw(q.m) + '; на брат ѝ — още ' + nw(q.x) + ' (общите вече са преброени)',
              'фільми тата: <b>' + q.f + '</b>; мами — ще ' + nw(q.m) + '; брата — ще ' + nw(q.x) + ' (спільні вже пораховано)') +
      ' &nbsp;→&nbsp; ' + q.f + ' + ' + q.m + ' + ' + q.x + ' = ' + q.ans;
  }
}
KIND.films = { draw:drawFilms, eq:eqFilms, why:whyFilms };
