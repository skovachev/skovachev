import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const b64 = (p: string) => readFileSync(join(root, p)).toString("base64");

const C = {
  bg: "#07060d",
  fg: "#e6ecf3",
  fg2: "#c5cdd6",
  muted: "#8b95a3",
  comment: "#7a8799",
  pink: "#ff6ac1",
  blue: "#7cc7ff",
  mint: "#7cf0ba",
  purple: "#c792ea",
  gold: "#ffcb6b",
  border: "rgba(255,255,255,0.12)",
};

const W = 840;
const H = 440;
const version = `${new Date().getFullYear() - 2010}.0.0`;
const sunset = `data:image/jpeg;base64,${b64("src/sunset.jpg")}`;
const imgW = W + 80;
const imgH = imgW / 1.509;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Seg = [string, string, number?];
function text(x: number, y: number, size: number, segs: Seg[], attrs = "") {
  const spans = segs
    .map(([s, color, weight]) => `<tspan fill="${color}"${weight ? ` font-weight="${weight}"` : ""}>${esc(s)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" font-size="${size}" xml:space="preserve"${attrs}>${spans}</text>`;
}

const panel = { x: 512, y: 92, w: 284, h: 262 };
const term: Seg[][] = [
  [["$ ", C.mint], ["stefan --version", C.fg]],
  [[`stefan ${version}`, C.fg2]],
  [],
  [["$ ", C.mint], ["stefan status", C.fg]],
  [["● ", C.mint], ["open to new projects", C.mint, 700]],
  [["  mode   ", C.muted], ["ai-first", C.purple]],
  [["  stack  ", C.muted], ["ts, react, php", C.blue]],
  [["  based  ", C.muted], ["sofia, bg", C.gold]],
  [["$ ", C.mint]],
];
const lh = 22;
const termX = panel.x + 20;
const termTop = panel.y + 36 + 26;
const termLines = term.map((segs, i) => text(termX, termTop + i * lh, 12.5, segs)).join("\n");
const cursorY = termTop + (term.length - 1) * lh;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
<defs>
<style>
@font-face{font-family:Hack;font-weight:400;src:url(data:font/woff2;base64,${b64("src/fonts/hack-regular-subset.woff2")}) format("woff2")}
@font-face{font-family:Hack;font-weight:700;src:url(data:font/woff2;base64,${b64("src/fonts/hack-bold-subset.woff2")}) format("woff2")}
text{font-family:Hack,"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-variant-ligatures:none}
.breathe{transform-box:fill-box;transform-origin:center;animation:breathe 14s ease-in-out infinite}
.blink{animation:blink 1.2s steps(1) infinite}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.06) translate(-1%,-1%);opacity:1}}
@keyframes blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.breathe,.blink{animation:none}}
</style>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="16"/></clipPath>
<clipPath id="glass"><rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" rx="14"/></clipPath>
<filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="frost" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
<linearGradient id="fadeY" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${C.bg}" stop-opacity=".15"/>
  <stop offset=".6" stop-color="${C.bg}" stop-opacity=".35"/>
  <stop offset="1" stop-color="${C.bg}" stop-opacity=".9"/>
</linearGradient>
<linearGradient id="fadeX" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${C.bg}" stop-opacity=".55"/>
  <stop offset=".6" stop-color="${C.bg}" stop-opacity="0"/>
</linearGradient>
<radialGradient id="vignette" cx=".5" cy=".45" r=".75">
  <stop offset=".6" stop-color="${C.bg}" stop-opacity="0"/>
  <stop offset="1" stop-color="${C.bg}" stop-opacity=".7"/>
</radialGradient>
<linearGradient id="name" gradientUnits="userSpaceOnUse" x1="130" y1="0" x2="470" y2="0">
  <stop offset="0" stop-color="${C.pink}"/>
  <stop offset=".5" stop-color="${C.blue}"/>
  <stop offset="1" stop-color="${C.mint}"/>
</linearGradient>
</defs>
<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<g class="breathe"><image href="${sunset}" x="-40" y="-150" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid slice" filter="url(#soft)"/></g>
<rect width="${W}" height="${H}" fill="url(#fadeY)"/>
<rect width="${W}" height="${H}" fill="url(#fadeX)"/>
<rect width="${W}" height="${H}" fill="url(#vignette)"/>

${text(52, 136, 14, [["$ ", C.mint], ["whoami", C.muted]])}
${text(50, 210, 70, [["stefan", C.fg, 700]], ' letter-spacing="-2.5"')}
<text x="50" y="284" font-size="70" font-weight="700" letter-spacing="-2.5" fill="${C.pink}" opacity=".4" filter="url(#glow)">./kovachev</text>
<text x="50" y="284" font-size="70" font-weight="700" letter-spacing="-2.5" xml:space="preserve"><tspan fill="${C.muted}">./</tspan><tspan fill="url(#name)">kovachev</tspan></text>
${text(52, 330, 15, [["full-stack developer, founder, team lead.", C.fg]])}
${text(52, 358, 13, [["// shipping web apps since 2010 · ai-first since 2025", C.comment]])}

<g clip-path="url(#glass)">
  <g class="breathe"><image href="${sunset}" x="-40" y="-150" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid slice" filter="url(#frost)"/></g>
  <rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" fill="rgba(13,12,24,0.62)"/>
  <rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="36" fill="rgba(255,255,255,0.03)"/>
</g>
<rect x="${panel.x + 0.5}" y="${panel.y + 0.5}" width="${panel.w - 1}" height="${panel.h - 1}" rx="14" fill="none" stroke="${C.border}"/>
<path d="M${panel.x} ${panel.y + 36.5}H${panel.x + panel.w}" stroke="${C.border}"/>
<circle cx="${panel.x + 18}" cy="${panel.y + 18}" r="5" fill="${C.pink}" opacity=".7"/>
<circle cx="${panel.x + 34}" cy="${panel.y + 18}" r="5" fill="${C.gold}" opacity=".7"/>
<circle cx="${panel.x + 50}" cy="${panel.y + 18}" r="5" fill="${C.mint}" opacity=".7"/>
${text(panel.x + 68, panel.y + 22, 11.5, [["~/sk · zsh", C.muted]])}
${termLines}
<rect class="blink" x="${termX + 2 * 7.53 + 2}" y="${cursorY - 11}" width="7" height="14" rx="1" fill="${C.mint}"/>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${C.border}"/>
</svg>
`;

mkdirSync(join(root, "assets"), { recursive: true });
writeFileSync(join(root, "assets/header.svg"), svg);
console.log("wrote assets/header.svg");
