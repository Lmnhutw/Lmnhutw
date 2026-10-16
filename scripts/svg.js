const fs = require('node:fs');
const path = require('node:path');

const colors = {
  background: '#080D16', panel: '#0D1522', surface: '#121D2D',
  text: '#E6EDF7', secondary: '#8FAAC7', mint: '#59F5BE',
  purple: '#A970FF', cyan: '#69BFFF', border: '#29445C',
};

function escape(value) {
  return String(value).replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
}

function text(x, y, value, kind = 'body', attributes = '') {
  return `<text x="${x}" y="${y}" class="${kind}" ${attributes}>${escape(value)}</text>`;
}

function frame(width, height, accent = colors.border) {
  return `<path d="M12 3H${width - 12}L${width - 3} 12V${height - 12}L${width - 12} ${height - 3}H12L3 ${height - 12}V12Z" fill="${colors.panel}" stroke="${accent}"/>
    <path d="M8 30V8H30M${width - 30} 8H${width - 8}V30M8 ${height - 30}V${height - 8}H30M${width - 30} ${height - 8}H${width - 8}V${height - 30}" fill="none" stroke="${accent}"/>
    <rect x="12" y="12" width="${width - 24}" height="${height - 24}" fill="none" stroke="${colors.border}" stroke-opacity=".55"/>`;
}

function svg(title, description, width, height, body, accent = colors.border, framed = true) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escape(title)}</title><desc id="desc">${escape(description)}</desc>
  <style>
    text{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;fill:${colors.text};font-size:15px}
    .title{font-size:20px;font-weight:700;fill:${accent}}
    .heading{font-size:28px;font-weight:700}
    .body{font-size:16px}
    .secondary{font-size:14px;fill:${colors.secondary}}
    .label{font-size:13px;fill:${colors.cyan}}
    .meta{font-size:11px;fill:${colors.secondary}}
    .state{font-size:13px;fill:${colors.mint}}
    .value{font-size:27px;font-weight:700}
    .mobile{font-size:26px}
    .mobile-label{font-size:23px;fill:${colors.cyan}}
    .mobile-meta{font-size:21px;fill:${colors.secondary}}
  </style>
  <rect width="${width}" height="${height}" fill="${colors.background}"/>
  ${framed ? frame(width, height, accent) : ''}
  ${body}
</svg>
`;
}

function image(file, x, y, width, height, attributes = '') {
  const bytes = fs.readFileSync(path.join(__dirname, '..', 'assets', file));
  const data = (file.endsWith('.svg') ? Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n')) : bytes).toString('base64');
  const type = file.endsWith('.svg') ? 'image/svg+xml' : file.endsWith('.gif') ? 'image/gif' : 'image/png';
  return `<image x="${x}" y="${y}" width="${width}" height="${height}" href="data:${type};base64,${data}" ${attributes}/>`;
}

function line(x1, y1, x2, y2, color = colors.border) {
  return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}"/>`;
}

function slot(x, y, width, height, content) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="3" fill="${colors.surface}" stroke="${colors.border}"/>${content}`;
}

function pixelName(x, y, scale = 6) {
  const glyphs = {
    V: ['10001','10001','10001','10001','10001','01010','00100'],
    I: ['11111','00100','00100','00100','00100','00100','11111'],
    N: ['10001','11001','11001','10101','10011','10011','10001'],
    C: ['01111','10000','10000','10000','10000','10000','01111'],
    E: ['11111','10000','10000','11110','10000','10000','11111'],
    T: ['11111','00100','00100','00100','00100','00100','00100'],
    _: ['00000','00000','00000','00000','00000','00000','11111'],
  };
  let body = '';
  [...'VINCENT_'].forEach((letter, index) => glyphs[letter].forEach((row, ry) =>
    [...row].forEach((bit, rx) => {
      if (bit === '1') body += `<rect x="${x + (index * 6 + rx) * scale}" y="${y + ry * scale}" width="${scale}" height="${scale}"/>`;
    })));
  return `<g fill="${colors.text}" shape-rendering="crispEdges" role="img" aria-label="VINCENT_">${body}</g>`;
}

function projectIcon(kind, x, y, size = 42) {
  const drawings = {
    narrative: '<path d="M6 5h20v23H6z M16 5v23 M9 10h4 M19 10h4 M9 15h4 M19 15h4"/>',
    animio: '<path d="M6 12V4l7 6h6l7-6v19l-5 5H11l-5-5z M11 17h1 M21 17h1 M14 23h4"/>',
    chatapp: '<path d="M4 5h24v17H17l-7 6v-6H4z M9 12h2 M15 12h2 M21 12h2"/>',
    skiishop: '<path d="M5 11h22v17H5z M10 11V5h12v6 M10 17v3 M22 17v3"/>',
    yoursafe: '<path d="M6 14h20v15H6z M10 14V8a6 6 0 0 1 12 0v6 M16 19v5"/>',
  };
  return `<g transform="translate(${x} ${y}) scale(${size / 32})" fill="none" stroke="${colors.cyan}" stroke-width="2" stroke-linejoin="miter">${drawings[kind]}</g>`;
}

module.exports = { colors, escape, text, frame, svg, image, line, slot, pixelName, projectIcon };
