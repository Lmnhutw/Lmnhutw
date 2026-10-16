const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'generate-profile.js'), 'utf8');
const user = { public_repos: 2, followers: 3 };
const repo = (stars, pushed_at) => ({ stargazers_count: stars, pushed_at });

async function run(responses) {
  const result = { requests: [], writes: [], errors: [], exitCode: 0 };
  await vm.runInNewContext(source, {
    __dirname,
    AbortSignal,
    require: name => name === 'fs' ? {
      writeFileSync: (file, content) => result.writes.push({ file, content }),
    } : require(name),
    process: { env: {}, exit: code => { result.exitCode = code; } },
    console: { log() {}, error: error => result.errors.push(String(error)) },
    fetch: async url => {
      result.requests.push(url);
      const response = responses.shift();
      assert.ok(response, `Unexpected request: ${url}`);
      return {
        ok: response.ok ?? true,
        status: response.status ?? 200,
        json: async () => response.body,
        text: async () => String(response.body),
      };
    },
  });
  return result;
}

test('generates real metrics and finds the latest push across all repositories', async () => {
  const result = await run([{ body: user }, { body: [
    repo(2, '2026-10-01T12:00:00Z'),
    repo(5, '2026-10-15T12:00:00Z'),
  ] }]);
  assert.equal(result.exitCode, 0);
  assert.equal(result.writes.length, 1);
  const svg = result.writes[0].content;
  assert.match(svg, /2 public repositories, 7 total repository stars and 3 followers/);
  assert.match(svg, /Latest public push \/ 2026-10-15 UTC/);
  assert.match(svg, /Snapshot \/ \d{4}-\d{2}-\d{2} UTC/);
  assert.doesNotMatch(svg, /ACTIVITY SIGNAL|opacity=|<a\b/);
});

test('includes stars and pushes beyond the first API page', async () => {
  const firstPage = Array.from({ length: 100 }, () => repo(1, '2026-10-01T00:00:00Z'));
  const result = await run([
    { body: { ...user, public_repos: 101 } },
    { body: firstPage },
    { body: [repo(7, '2026-10-16T00:00:00Z')] },
  ]);
  assert.equal(result.exitCode, 0);
  assert.match(result.requests[2], /page=2$/);
  assert.match(result.writes[0].content, /107 total repository stars/);
  assert.match(result.writes[0].content, /Latest public push \/ 2026-10-16 UTC/);
});

test('handles no repositories and repositories with no push', async () => {
  for (const repos of [[], [repo(0, null)]]) {
    const result = await run([{ body: { public_repos: repos.length, followers: 0 } }, { body: repos }]);
    assert.equal(result.exitCode, 0);
    assert.match(result.writes[0].content, /Latest public push \/ N\/A/);
    assert.match(result.writes[0].content, /0 total repository stars and 0 followers/);
  }
});

test('keeps the existing SVG when an API request fails', async () => {
  const result = await run([{ body: user }, { ok: false, status: 403, body: 'rate limited' }]);
  assert.equal(result.exitCode, 1);
  assert.equal(result.writes.length, 0);
  assert.match(result.errors[0], /GitHub API 403/);
});

test('rejects invalid payloads before writing an SVG', async () => {
  const cases = [
    [{ body: { public_repos: 2, followers: '3' } }],
    [{ body: user }, { body: { message: 'not a repository list' } }],
    [{ body: user }, { body: [repo(-1, null)] }],
    [{ body: user }, { body: [repo(1, 'not a date')] }],
    [{ body: user }, { body: [null] }],
  ];
  for (const responses of cases) {
    const result = await run(responses);
    assert.equal(result.exitCode, 1);
    assert.equal(result.writes.length, 0);
    assert.match(result.errors[0], /Invalid GitHub/);
  }
});
