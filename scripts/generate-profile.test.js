const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { parseContributions, renderActivity, validDays } = require('./generate-profile');

const source = fs.readFileSync(path.join(__dirname, 'generate-profile.js'), 'utf8');
const user = { public_repos: 2, followers: 3, created_at: '2021-04-01T00:00:00Z' };
const repo = (stars, pushed_at) => ({ stargazers_count: stars, pushed_at });
const day = (date, level = 0) => ({ date, level });
const calendarHtml = days => days.map(item =>
  `<td class="ContributionCalendar-day" data-level="${item.level}" data-date="${item.date}"></td>`).join('');

async function run(responses, cache = null) {
  const result = { requests: [], writes: [], errors: [], warnings: [], exitCode: 0 };
  const entry = { exports: {} };
  const mockRequire = name => name === 'node:fs' ? {
    writeFileSync: (file, content) => result.writes.push({ file, content }),
    readFileSync: () => { if (!cache) throw new Error('No cache'); return JSON.stringify(cache); },
  } : require(name);
  mockRequire.main = null;
  vm.runInNewContext(source, {
    __dirname, module: entry, require: mockRequire, AbortSignal,
    process: { env: {} },
    console: { log() {}, error: error => result.errors.push(String(error)), warn: warning => result.warnings.push(warning) },
    fetch: async url => {
      result.requests.push(url);
      const response = responses.shift();
      if (!response) throw new Error('No contribution response');
      return {
        ok: response.ok ?? true, status: response.status ?? 200,
        json: async () => response.body, text: async () => String(response.body),
      };
    },
  });
  try { await entry.exports.generateProfile(); }
  catch (error) { result.exitCode = 1; result.errors.push(String(error)); }
  result.desktop = result.writes.find(item => item.file.endsWith('adventurer-log.svg'))?.content;
  result.mobile = result.writes.find(item => item.file.endsWith('adventurer-log-mobile.svg'))?.content;
  return result;
}

test('uses real totals, join year and the newest push across repositories', async () => {
  const result = await run([{ body: user }, { body: [
    repo(2, '2026-10-01T12:00:00Z'), repo(5, '2026-10-15T12:00:00Z'),
  ] }]);
  assert.equal(result.exitCode, 0);
  assert.match(result.desktop, /2 public repositories, 7 total repository stars and 3 followers/);
  assert.match(result.desktop, /Joined GitHub 2021/);
  assert.match(result.desktop, /Latest push \/ 2026-10-15 UTC/);
  assert.match(result.desktop, /Contribution data unavailable/);
  assert.match(result.mobile, /viewBox="0 0 600 440"/);
  assert.doesNotMatch(result.desktop, /ACTIVITY SIGNAL|metricBar|<a\b/);
});

test('includes stars and pushes beyond the first page', async () => {
  const result = await run([
    { body: { ...user, public_repos: 101 } },
    { body: Array.from({ length: 100 }, () => repo(1, '2026-10-01T00:00:00Z')) },
    { body: [repo(7, '2026-10-16T00:00:00Z')] },
  ]);
  assert.equal(result.exitCode, 0);
  assert.match(result.requests[2], /page=2$/);
  assert.match(result.desktop, /107 total repository stars/);
  assert.match(result.desktop, /Latest push \/ 2026-10-16 UTC/);
});

test('handles empty repositories and repositories with no push', async () => {
  for (const repos of [[], [repo(0, null)]]) {
    const result = await run([{ body: { ...user, public_repos: repos.length, followers: 0 } }, { body: repos }]);
    assert.equal(result.exitCode, 0);
    assert.match(result.desktop, /Latest push \/ N\/A/);
    assert.match(result.desktop, /0 total repository stars and 0 followers/);
  }
});

test('an API failure preserves all existing output files', async () => {
  const result = await run([{ body: user }, { ok: false, status: 403, body: 'rate limited' }]);
  assert.equal(result.exitCode, 1);
  assert.equal(result.writes.length, 0);
  assert.match(result.errors[0], /GitHub API 403/);
});

test('invalid metrics never overwrite either SVG', async () => {
  for (const responses of [
    [{ body: { ...user, followers: '3' } }],
    [{ body: { ...user, created_at: 'not a date' } }],
    [{ body: user }, { body: { message: 'not a list' } }],
    [{ body: user }, { body: [repo(-1, null)] }],
    [{ body: user }, { body: [repo(1, 'not a date')] }],
    [{ body: user }, { body: [null] }],
  ]) {
    const result = await run(responses);
    assert.equal(result.exitCode, 1);
    assert.equal(result.writes.length, 0);
    assert.match(result.errors[0], /Invalid GitHub/);
  }
});

test('parses calendar intensity independently of HTML attribute order', () => {
  const days = parseContributions('<td data-date="2026-10-15" data-level="4"></td><td data-level="0" class="ContributionCalendar-day" data-date="2026-10-14"></td>');
  assert.deepEqual(days, [day('2026-10-14'), day('2026-10-15', 4)]);
  for (const html of ['', '<td data-date="2026-10-16" data-level="7">', '<td data-date="invalid" data-level="0">', calendarHtml([day('2026-10-16'), day('2026-10-16')])]) {
    assert.throws(() => parseContributions(html), /Invalid GitHub/);
  }
  assert.equal(validDays([day('2026-02-30')]), false);
});

test('stores a complete real calendar and draws exactly its reported days', async () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const days = Array.from({ length: 366 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - 365 + index);
    return day(date.toISOString().slice(0, 10), index % 5);
  });
  const result = await run([{ body: user }, { body: [] }, { body: calendarHtml(days) }]);
  assert.equal(result.exitCode, 0);
  assert.equal(result.writes.length, 3);
  const cache = JSON.parse(result.writes.find(item => item.file.endsWith('.json')).content);
  assert.deepEqual(cache.days, days);
  assert.equal((result.desktop.match(/: contribution intensity \d\/4<\/title>/g) || []).length, 366);
  assert.equal((result.mobile.match(/: contribution intensity \d\/4<\/title>/g) || []).length, 366);
  assert.doesNotMatch(result.desktop, /CACHED|unavailable/);
});

test('labels a cached calendar on refresh failure and preserves its date', async () => {
  const cached = { updated: '2026-10-15', days: [day('2026-10-14', 3), day('2026-10-15', 1)] };
  const result = await run([{ body: user }, { body: [] }, { ok: false, status: 500 }], cached);
  assert.equal(result.exitCode, 0);
  assert.match(result.desktop, /CACHED \/ 2026-10-15 UTC/);
  assert.equal(result.writes.length, 2);
  assert.equal((result.desktop.match(/: contribution intensity \d\/4<\/title>/g) || []).length, 2);
});

test('no valid cache produces an explicit unavailable state, never fake cells', async () => {
  const result = await run([{ body: user }, { body: [] }], { updated: '2026-10-15', days: [day('invalid', 9)] });
  assert.equal(result.exitCode, 0);
  assert.match(result.desktop, /Contribution data unavailable/);
  assert.doesNotMatch(result.desktop, /contribution intensity/);
});

test('rendered activity contains no external dependency or active SVG link', () => {
  const output = renderActivity({ repos: 0, stars: 0, followers: 0, joined: 2021, latest: 'N/A', updated: '2026-10-16' }, null);
  assert.doesNotMatch(output, /<script|<a\b|@import|https?:\/\/(?!www.w3.org)/);
  assert.match(output, /aria-labelledby="title desc"/);
});
