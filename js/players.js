// Who is playing. Each player keeps her own rounds and settings under her own storage
// key; the first player keeps the original key, so everything played before there were
// players is simply hers - nothing is moved or rewritten.
const PKEY = 'crossingten.players';
let PLAYERS = { list:[{ id:'p1', name:'', mascot:'cat', lang:'bg' }], cur:'p1', gone:[] };   // gone: deleted players, for sync
try {
  const s = JSON.parse(localStorage.getItem(PKEY));
  if(s && s.list && s.list.length) PLAYERS = Object.assign({ gone:[] }, s);
} catch(e){}
let PLAYER = PLAYERS.list.find(p => p.id === PLAYERS.cur) || PLAYERS.list[0];
const roundsKey = p => p.id === 'p1' ? 'crossingten.v3' : 'crossingten.v3.' + p.id;
function savePlayers(){ try { localStorage.setItem(PKEY, JSON.stringify(PLAYERS)); } catch(e){} }
