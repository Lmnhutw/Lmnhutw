const fs = require('node:fs');
const path = require('node:path');
const { colors: c, text: t, svg, line, slot } = require('./svg');

const USERNAME = 'Lmnhutw';
const assets = path.join(__dirname, '..', 'assets');
const cacheFile = path.join(assets, 'github-contributions.json');

async function gh(pathname) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'pixel-quest-profile' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch('https://api.github.com' + pathname, {
    headers, signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  return response.json();
}

function validDays(days) {
  return Array.isArray(days) && days.length > 0 &&
    new Set(days.map(day => day.date)).size === days.length &&
    days.every(day => typeof day.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
      Number.isFinite(Date.parse(day.date)) &&
      new Date(day.date).toISOString().slice(0, 10) === day.date &&
      Number.isInteger(day.level) && day.level >= 0 && day.level <= 4);
}

// shortcut: GitHub's public calendar HTML supplies real intensity levels; update this parser if its markup changes.
function parseContributions(html) {
  const days = [];
  for (const match of html.matchAll(/<td\b[^>]*>/g)) {
    const date = match[0].match(/\bdata-date="([^"]+)"/)?.[1];
    const level = match[0].match(/\bdata-level="([^"]+)"/)?.[1];
    if (date && level !== undefined) days.push({ date, level: Number(level) });
  }
  if (!validDays(days)) throw new Error('Invalid GitHub contribution calendar');
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function calendar(days, x, y, step = 8, cell = 6) {
  const first = new Date(days[0].date);
  first.setUTCDate(first.getUTCDate() - first.getUTCDay());
  const palette = [c.surface, '#164936', '#217655', '#32AD7A', c.mint];
  return days.map(day => {
    const date = new Date(day.date);
    const column = Math.floor((date - first) / (7 * 86400000));
    return `<rect x="${x + column * step}" y="${y + date.getUTCDay() * step}" width="${cell}" height="${cell}" fill="${palette[day.level]}"><title>${day.date}: contribution intensity ${day.level}/4</title></rect>`;
  }).join('');
}

function monthLabels(days, x, y) {
  const first = new Date(days[0].date);
  first.setUTCDate(first.getUTCDate() - first.getUTCDay());
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return days.filter(day => day.date.endsWith('-01')).map(day => {
    const date = new Date(day.date);
    const column = Math.floor((date - first) / (7 * 86400000));
    return t(x + column * 8, y, names[date.getUTCMonth()], 'meta');
  }).join('');
}

function renderActivity(metrics, contribution, mobile = false) {
  const { repos, stars, followers, joined, latest, updated } = metrics;
  const values = [repos, stars, followers, joined];
  const labels = ['PUBLIC REPOS', 'TOTAL STARS', 'FOLLOWERS', 'JOINED GITHUB'];
  const width = mobile ? 600 : 1000;
  const height = mobile ? 440 : 214;
  const description = `${repos} public repositories, ${stars} total repository stars and ${followers} followers. Joined GitHub ${joined}. Latest public push ${latest} UTC. Metrics snapshot ${updated} UTC. ` +
    (contribution ? `Real GitHub contribution intensity, ${contribution.updated} UTC${contribution.stale ? ', cached snapshot' : ''}.` : 'Contribution data is currently unavailable.');
  let body = t(mobile ? 24 : 26, mobile ? 42 : 38, 'ADVENTURER LOG', mobile ? 'mobile-label' : 'title', 'style="fill:#59F5BE"');
  values.forEach((value, index) => {
    const x = mobile ? 24 + (index % 2) * 284 : 26 + index * 122;
    const y = mobile ? 65 + Math.floor(index / 2) * 94 : 64;
    body += slot(x, y, mobile ? 268 : 110, mobile ? 82 : 88,
      t(x + 16, y + (mobile ? 34 : 34), value, mobile ? 'heading' : 'value') +
      t(x + 16, y + (mobile ? 65 : 65), labels[index], mobile ? 'mobile-meta' : 'meta'));
  });
  const mapX = mobile ? 26 : 544;
  const mapY = mobile ? 310 : 78;
  body += t(mapX, mobile ? 289 : 60, 'CONTRIBUTION MAP / LAST 12 MONTHS', mobile ? 'mobile-meta' : 'meta');
  if (contribution) {
    const last = new Date(updated);
    const first = new Date(updated);
    first.setUTCFullYear(first.getUTCFullYear() - 1);
    const days = contribution.days.filter(day => new Date(day.date) >= first && new Date(day.date) <= last);
    if (days.length) {
      body += calendar(days, mapX, mapY, mobile ? 10 : 8, mobile ? 8 : 6);
      if (!mobile) body += monthLabels(days, mapX, 147);
      body += t(mapX, mobile ? 410 : 160, contribution.stale ? 'CACHED / ' + contribution.updated + ' UTC' : 'GITHUB / ' + contribution.updated + ' UTC', mobile ? 'mobile-meta' : 'meta');
    } else {
      body += t(mapX, mapY + 30, 'Contribution data unavailable', mobile ? 'mobile-meta' : 'meta');
    }
  } else {
    body += t(mapX, mapY + 30, 'Contribution data unavailable', mobile ? 'mobile-meta' : 'meta');
  }
  if (!mobile) {
    body += line(26, 172, 974, 172);
    body += t(26, 195, 'Latest push / ' + latest + ' UTC', 'meta');
    body += t(974, 195, 'SNAPSHOT / ' + updated + ' UTC', 'meta', 'text-anchor="end"');
  }
  return svg('Adventurer Log — Real GitHub Activity', description, width, height, body, c.mint);
}

async function generateProfile() {
  const user = await gh('/users/' + USERNAME);
  if (!user || !Number.isInteger(user.public_repos) || user.public_repos < 0 ||
      !Number.isInteger(user.followers) || user.followers < 0 ||
      typeof user.created_at !== 'string' || !Number.isFinite(Date.parse(user.created_at))) {
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
  const latestPush = repos.reduce((latest, repo) =>
    Math.max(latest, repo.pushed_at === null ? 0 : Date.parse(repo.pushed_at)), 0);
  const metrics = {
    repos: user.public_repos,
    followers: user.followers,
    stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    joined: new Date(user.created_at).getUTCFullYear(),
    latest: latestPush ? new Date(latestPush).toISOString().slice(0, 10) : 'N/A',
    updated: new Date().toISOString().slice(0, 10),
  };
  let contribution = null;
  let fresh = false;
  try {
    const response = await fetch('https://github.com/users/' + USERNAME + '/contributions', {
      headers: { 'User-Agent': 'pixel-quest-profile' }, signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error('Contribution page HTTP ' + response.status);
    const days = parseContributions(await response.text());
    const newest = new Date(days.at(-1).date);
    if (days.length < 300 || newest < new Date(Date.now() - 7 * 86400000)) {
      throw new Error('Incomplete or stale contribution response');
    }
    contribution = { updated: metrics.updated, days };
    fresh = true;
  } catch (error) {
    console.warn('Contribution refresh failed: ' + error.message);
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      if (validDays(cached.days) && /^\d{4}-\d{2}-\d{2}$/.test(cached.updated)) {
        contribution = { ...cached, stale: true };
      }
    } catch { /* No valid cache: render an explicit unavailable state. */ }
  }
  const desktop = renderActivity(metrics, contribution);
  const mobile = renderActivity(metrics, contribution, true);
  fs.writeFileSync(path.join(assets, 'adventurer-log.svg'), desktop);
  fs.writeFileSync(path.join(assets, 'adventurer-log-mobile.svg'), mobile);
  if (fresh) fs.writeFileSync(cacheFile, JSON.stringify(contribution, null, 2) + '\n');
  console.log('Updated real GitHub metrics and contribution calendar for ' + USERNAME);
}

if (require.main === module) generateProfile().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
module.exports = { generateProfile, parseContributions, renderActivity, validDays };
