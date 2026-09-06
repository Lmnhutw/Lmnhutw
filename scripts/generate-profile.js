const fs = require('fs');
const path = require('path');

const USERNAME = 'Lmnhutw';
const output = path.join(__dirname, '..', 'assets', 'adventurer-log.svg');

async function gh(pathname) {
  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'pixel-quest-profile' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${pathname}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  return res.json();
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));
}

function metricBar(seed) {
  return Array.from({ length: 16 }, (_, i) => {
    const opacity = [0.18,0.28,0.4,0.55,0.7,0.85,1][(seed + i * 3) % 7];
    return `<rect x="${i*28}" y="0" width="22" height="22" fill="#7ee787" opacity="${opacity}"/>`;
  }).join('');
}

(async () => {
  const user = await gh(`/users/${USERNAME}`);
  const repos = await gh(`/users/${USERNAME}/repos?per_page=100&sort=updated`);
  const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const latest = repos[0]?.pushed_at ? new Date(repos[0].pushed_at).toISOString().slice(0,10) : 'N/A';
  const seed = (user.public_repos + user.followers + stars) % 7;

  const svg = `<svg width="1000" height="280" viewBox="0 0 1000 280" xmlns="http://www.w3.org/2000/svg">
  <style>.panel{fill:#0d1117;stroke:#30363d;stroke-width:4}.title{font:700 18px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#7ee787}.value{font:700 28px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#e6edf3}.label{font:12px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#8b949e;letter-spacing:1px}.body{font:13px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#b1bac4}</style>
  <rect x="2" y="2" width="996" height="276" class="panel"/>
  <text x="30" y="42" class="title">▥ ADVENTURER LOG</text><text x="820" y="42" class="label">GITHUB ACTIVITY</text>
  <line x1="28" y1="58" x2="972" y2="58" stroke="#30363d" stroke-width="2"/>
  <text x="42" y="106" class="value">${esc(user.public_repos)}</text><text x="42" y="128" class="label">PUBLIC REPOS</text>
  <text x="230" y="106" class="value">${esc(stars)}</text><text x="230" y="128" class="label">TOTAL STARS</text>
  <text x="420" y="106" class="value">${esc(user.followers)}</text><text x="420" y="128" class="label">FOLLOWERS</text>
  <text x="42" y="170" class="label">ACTIVITY SIGNAL</text><g transform="translate(42,190)">${metricBar(seed)}</g>
  <text x="650" y="198" class="body">Latest push: ${esc(latest)}</text>
  <text x="650" y="224" class="body">Generated from public GitHub data</text>
</svg>`;

  fs.writeFileSync(output, svg);
  console.log(`Updated ${output}`);
})().catch(err => { console.error(err); process.exit(1); });
