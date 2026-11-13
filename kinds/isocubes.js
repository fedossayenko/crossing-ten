// Cubes drawn in isometric view, shared by the cube kinds (cubetower, cubeglue, cubepaint). Not a question kind.
// A cube is {x, y, z, c, t}: its place in whole steps (x to the right and forward, y to the left and forward, z up),
// its colour c (an index into CUBE_COL) and an optional label t. The eye looks from the side where x, y and z grow, so the
// faces seen are the top (+z), the right (+x) and the left (+y); a cube with a larger x + y + z is nearer and drawn later.
import { svgText } from '../js/core.js';

export const CUBE_COL = ['var(--lemon)', 'var(--bad)', 'var(--accent)'];   // yellow, red, blue: theme tokens, light and dark

/** where a point of the 3-D model lands in a drawing with a cube s pixels high */
const iso = (s, x, y, z) => [(x - y)*s*0.866, (x + y)*s/2 - z*s];

/**
 * The cubes as one SVG group: { g, w, h } with the group moved so that its picture starts at 2, 2.
 * @param {{x: number, y: number, z: number, c?: number, t?: string|number}[]} cells
 * @param {number} s the cube's edge in pixels
 */
export function isoCubes(cells, s, dx = 0, dy = 0){
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  cells.forEach(({ x, y, z }) => { for(let i = 0; i < 2; i++) for(let j = 0; j < 2; j++) for(let k = 0; k < 2; k++){
    const [px, py] = iso(s, x + i, y + j, z + k); x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); } });
  const ox = 2 - x0 + dx, oy = 2 - y0 + dy;
  const poly = (x, y, z, pts, fill, shade) => {
    const d = pts.map(([i, j, k]) => iso(s, x + i, y + j, z + k)).map(([px, py]) => (px + ox).toFixed(1) + ',' + (py + oy).toFixed(1)).join(' ');
    return '<polygon points="' + d + '" fill="' + fill + '" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>' +
      (shade ? '<polygon points="' + d + '" fill="var(--ink)" fill-opacity="' + shade + '"/>' : '');
  };
  const order = cells.slice().sort((p, q) => (p.x + p.y + p.z) - (q.x + q.y + q.z) || p.z - q.z);
  const g = order.map(({ x, y, z, c, t }) => {
    const fill = CUBE_COL[c || 0];
    const [lx, ly] = iso(s, x + 0.5, y + 0.5, z + 1);
    return '<g>' + poly(x, y, z, [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], fill, 0) + poly(x, y, z, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], fill, 0.2) +
      poly(x, y, z, [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], fill, 0.34) +
      (t === undefined ? '' : svgText((lx + ox).toFixed(1), (ly + oy + s*0.16).toFixed(1), t, Math.round(s*0.46), 'var(--ink)')) + '</g>';
  }).join('');
  return { g, w: Math.ceil(x1 - x0) + 4, h: Math.ceil(y1 - y0) + 4 };
}

/** a drawing of the cubes in an <svg> of their own size */
export const isoSvg = (cells, s, label, max) => {
  const { g, w, h } = isoCubes(cells, s);
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" style="max-width:' + (max || 100) + '%" role="img" aria-label="' + label + '">' + g + '</svg>';
};

const key = c => c.x + ',' + c.y + ',' + c.z;
/**
 * A picture a child can count from: no two cubes drawn on the same spot, no two cubes that only look as if they touch, and no
 * cube with all three of its seen faces covered. Tested on the 3-D model, the same way a drawing would be read. loose: a cube in front
 * and one step to the side of another (x and y both one more) may look stacked: allowed for the solids of cubepaint.
 */
export function isoReadable(cells, loose){
  const at = new Map(cells.map(c => [key(c), c]));
  for(const c of cells) if(at.has(key({ x: c.x + 1, y: c.y, z: c.z })) && at.has(key({ x: c.x, y: c.y + 1, z: c.z })) && at.has(key({ x: c.x, y: c.y, z: c.z + 1 }))) return false;
  const edge = new Set(loose ? ['1,1', '-1,-1', '-1,1', '1,-1'] : ['1,1', '-1,-1', '-1,1', '1,-1', '0,2', '0,-2']);
  for(let i = 0; i < cells.length; i++) for(let j = i + 1; j < cells.length; j++){
    const a = cells[i], b = cells[j], dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
    const p = [dx - dy, dx + dy - 2*dz];
    if(!p[0] && !p[1]) return false;                                   // one hides the other
    if(edge.has(p.join()) && Math.abs(dx) + Math.abs(dy) + Math.abs(dz) !== 1) return false;   // looks glued, is not
  }
  return true;
}

/** the cubes that touch (two cubes with a common face), as pairs of indices */
export function touching(cells){
  const out = [];
  for(let i = 0; i < cells.length; i++) for(let j = i + 1; j < cells.length; j++){
    const a = cells[i], b = cells[j];
    if(Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) === 1) out.push([i, j]);
  }
  return out;
}
