// Types for `tsc -p .` (TypeScript checks the plain JS; nothing is built and the page never loads
// this file). The scripts share one global scope, and so do these declarations.

/** One question, as a generator returns it. The app reads the fields below; every kind adds its own. */
interface Question {
  /** the kind in kinds/*.js that draws it; a plain sum (the basics) has none */
  kind?: string;
  /** the answer, or for А/Б/В/Г the index of the right option. Optional only because some generators
      build the question first and set it last; check.js makes sure every one ends up with it. */
  ans?: number;
  /** the other answers that also count, for a task with more than one box */
  alt?: number[];
  /** how many answer boxes */
  slots?: number;
  // a plain sum is a, op, b — kinds reuse those names for their own things, so they stay untyped
  /** А/Б/В/Г */
  options?: { id: number; v: any; text: [string, string] | string }[];
  pick?: number;
  /** a kind that is always А/Б/В/Г keeps its options in every mode */
  own?: boolean;
  /** wrong answers worth offering as options */
  traps?: number[];
  /** in a competition: the points and the level it came from */
  pts?: number; lvl?: number;
  [field: string]: any;
}

/** A level: one row of js/levels.js, plus what the table fills in on load. */
interface Level {
  id: number;
  op: string;
  grp?: string;
  needs?: number[];
  src?: string;
  grade?: number;
  d: number;
  eq: string;
  desc: string;
  also?: string[];
  gen?: () => Question;
  /** filled in on load: the papers that ask it, and how many of them are dated */
  papers?: string[];
  freq?: number;
}

/** What a kind file registers: KIND.x = { draw, eq, why } */
interface Kind {
  draw: (q: Question) => string;
  eq: (q: Question) => string;
  why: (q: Question, full?: boolean) => string;
}

// The browser bits the DOM typings leave out, or type too narrowly for a page that looks its
// elements up by id and by selector and knows what they are.
interface Element {
  dataset: DOMStringMap; hidden: boolean; title: string; value: string; checked: boolean;
  onclick: ((e: MouseEvent) => any) | null; onchange: ((e: Event) => any) | null;
}
interface EventTarget { closest(selector: string): HTMLElement | null; }
interface Node { dataset: DOMStringMap; removeAttribute(name: string): void; }
interface ParentNode { hidden: boolean; }
interface HTMLElement { value: string; checked: boolean; placeholder: string; autocomplete: string; disabled: boolean; }
interface Window { webkitAudioContext?: typeof AudioContext; google?: any; }
/** Google sign-in, loaded from accounts.google.com when it is used */
declare var google: any;

/** iOS Safari: true when opened from the home screen */
interface Navigator { standalone?: boolean }
