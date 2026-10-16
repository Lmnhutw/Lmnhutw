const fs = require('fs');
const path = require('path');

const USERNAME = 'Lmnhutw';
const output = path.join(__dirname, '..', 'assets', 'adventurer-log.svg');

async function gh(pathname) {
  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'pixel-quest-profile' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${pathname}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  return res.json();
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));
}

(async () => {
  const user = await gh(`/users/${USERNAME}`);
  if (!user || !Number.isInteger(user.public_repos) || user.public_repos < 0 ||
      !Number.isInteger(user.followers) || user.followers < 0) {
    throw new Error('Invalid GitHub user metrics');
  }

  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await gh(`/users/${USERNAME}/repos?per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error('Invalid GitHub repository list');
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  if (repos.some(repo => !repo || !Number.isInteger(repo.stargazers_count) ||
      repo.stargazers_count < 0 || (repo.pushed_at !== null &&
      (typeof repo.pushed_at !== 'string' || !Number.isFinite(Date.parse(repo.pushed_at)))))) {
    throw new Error('Invalid GitHub repository metrics');
  }

  const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const latestPush = repos.reduce((latest, repo) =>
    Math.max(latest, repo.pushed_at === null ? 0 : Date.parse(repo.pushed_at)), 0);
  const latest = latestPush ? new Date(latestPush).toISOString().slice(0, 10) : 'N/A';
  const updated = new Date().toISOString().slice(0, 10);

  const svg = `<svg width="1000" height="430" viewBox="0 0 1000 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Adventurer Log — Public GitHub Snapshot</title>
  <desc id="desc">${esc(user.public_repos)} public repositories, ${esc(stars)} total repository stars and ${esc(user.followers)} followers. Latest public repository push: ${esc(latest)} UTC. Snapshot updated ${esc(updated)} UTC.</desc>
  <style>
    .panel{fill:#151e2a;stroke:#364558;stroke-width:1.5}
    .title{font:600 32px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#7ee7b3}
    .value{font:700 76px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#f0f5fc}
    .label{font:32px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#b4c3d6}
    .body{font:42px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#c5d1e2}
    .meta{font:30px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#b4c3d6}
  </style>
  <rect x="1" y="1" width="998" height="428" rx="10" class="panel"/>
  <text x="34" y="55" class="title">ADVENTURER LOG</text>
  <text x="966" y="55" text-anchor="end" class="meta">PUBLIC GITHUB</text>
  <text x="34" y="173" class="value">${esc(user.public_repos)}</text>
  <text x="34" y="239" class="label">PUBLIC REPOS</text>
  <text x="368" y="173" class="value">${esc(stars)}</text>
  <text x="368" y="239" class="label">TOTAL STARS</text>
  <text x="700" y="173" class="value">${esc(user.followers)}</text>
  <text x="700" y="239" class="label">FOLLOWERS</text>
  <line x1="34" y1="274" x2="966" y2="274" stroke="#364558" stroke-width="1.5"/>
  <text x="34" y="332" class="body">Latest public push / ${esc(latest)} UTC</text>
  <text x="34" y="392" class="meta">Snapshot / ${esc(updated)} UTC</text>
</svg>
`;

  fs.writeFileSync(output, svg);
  console.log(`Updated ${output}`);
})().catch(err => { console.error(err); process.exit(1); });
