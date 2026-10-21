const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { colors: c, escape, text: t, svg, image, line, slot, pixelName, projectIcon } = require('./svg');
const root = path.join(__dirname, '..');
const links = require('../profile-links.json');

const projects = [
  { key: 'narrative', name: 'Narrative Studio', description: 'AI-powered creative workspace', status: 'MAIN' },
  { key: 'animio', name: 'Animio', description: 'Pet-transfer platform / SPA + Go', status: 'FEATURED' },
  { key: 'chatapp', name: 'ChatApp', description: 'Real-time messaging platform', status: 'FEATURED' },
  { key: 'skiishop', name: 'SkiiShop', description: 'Full-stack e-commerce project', status: 'SIDE' },
  { key: 'yoursafe', name: 'YourSafe', description: 'Local password manager / Windows', status: 'SIDE' },
];
const inventory = [
  ['LANGUAGES', [['csharp', 'C#'], ['typescript', 'TypeScript'], ['javascript', 'JavaScript']]],
  ['FRAMEWORKS', [['dotnet', '.NET'], ['nextjs', 'Next.js'], ['react', 'React'], ['angular', 'Angular']]],
  ['TOOLS & DEVOPS', [['docker', 'Docker'], ['sqlserver', 'SQL Server'], ['git', 'Git'], ['jenkins', 'Jenkins']]],
  ['OTHER', [['redis', 'Redis'], ['postgresql', 'PostgreSQL'], ['vscode', 'VS Code']]],
];

function save(name, content) {
  fs.writeFileSync(path.join(root, 'assets', name + '.svg'), content);
}

function techSlot(key, name, x, y, width, mobile = false) {
  const size = mobile ? 26 : 19;
  const label = !mobile && name === 'SQL Server'
    ? t(x + 33, y + 19, 'SQL', 'body') + t(x + 33, y + 40, 'Server', 'body')
    : t(x + (mobile ? 54 : 33), y + (mobile ? 26 : 25), name, mobile ? 'mobile' : 'body');
  const backing = key === 'nextjs' ? `<rect x="${x + 7}" y="${y + 7}" width="${size + 2}" height="${size + 2}" rx="12" fill="#E6EDF7"/>` : '';
  return slot(x, y, width, mobile ? 36 : 46, backing + image('icons/' + key + '.svg', x + 8, y + 8, size, size) + label);
}

function contactRows(x, start, step, mobile = false) {
  return ['GitHub', 'Email', 'LinkedIn', 'Portfolio', 'Animio'].map((name, i) => {
    const known = links.contact[name.toLowerCase()];
    const y = start + i * step;
    const size = mobile ? 25 : 15;
    const icon = name === 'GitHub' || name === 'LinkedIn'
      ? image('icons/' + name.toLowerCase() + '.svg', x, y - size + 2, size, size)
      : '<g transform="translate(' + x + ' ' + (y - size + 2) + ') scale(' + size / 16 + ')" fill="none" stroke="#69BFFF" stroke-width="1.4">' +
        ({ Email: '<path d="M1 2h14v12H1z M1 3l7 6 7-6"/>', Portfolio: '<circle cx="8" cy="8" r="7"/><ellipse cx="8" cy="8" rx="3" ry="7"/><path d="M1 8h14"/>', Animio: '<path d="M3 4h10l2 8-3 2-3-3H7l-3 3-3-2z M3 8h4 M5 6v4 M11 7v2"/>' }[name]) + '</g>';
    return icon + t(x + (mobile ? 38 : 25), y, name, mobile ? 'mobile' : 'body') +
      t(mobile ? x + 245 : x + 165, start + i * step, known ? '→' : '—', mobile ? 'mobile-label' : 'label', 'text-anchor="end"');
  }).join('');
}

function build() {
  save('system-header-plain', svg('System Board / V2.1', 'Pixel RPG system board. ONLINE is a decorative label, not real-time presence.', 1000, 46,
    t(18, 28, '>_ SYSTEM BOARD / V2.1', 'body') +
    '<circle cx="902" cy="23" r="5" fill="#59F5BE"/>' + t(920, 28, 'ONLINE', 'state') +
    line(8, 43, 992, 43, c.cyan), c.cyan, false));
  save('system-header-plain-mobile', svg('System Board / V2.1', 'Pixel RPG system board.', 600, 64,
    t(18, 40, '>_ SYSTEM BOARD / V2.1', 'mobile-label') +
    t(582, 40, 'ONLINE', 'mobile-label', 'text-anchor="end"') + line(18, 58, 582, 58, c.cyan), c.cyan, false));

  const profileDescription = 'Vincent, software developer. Building web products, AI systems and tools that people enjoy using. Ho Chi Minh City, Vietnam. Focus: Web Development, AI, Useful Tools. Currently Building. Contact links follow in the README.';
  save('hero', svg('Vincent — Player Profile', profileDescription, 1000, 388,
    image('vincent_character.gif', 26, 24, 266, 278, 'preserveAspectRatio="xMidYMid meet"') +
    '<rect x="26" y="24" width="266" height="278" fill="none" stroke="#29445C"/>' +
    t(26, 330, '>_ A DEVELOPER EXPLORING IDEAS...', 'meta') +
    '<rect x="322" y="42" width="10" height="10" fill="#59F5BE"/>' + t(346, 53, 'PLAYER PROFILE / 001', 'state') +
    pixelName(322, 72, 6) + t(322, 149, 'SOFTWARE DEVELOPER', 'title', 'style="fill:#59F5BE"') +
    t(322, 191, '“Building web products, AI systems', 'body') +
    t(322, 214, ' and tools that people enjoy using.”', 'body') +
    line(322, 244, 748, 244) +
    t(322, 270, 'LOCATION', 'label') + t(420, 270, ': Ho Chi Minh City, Vietnam', 'secondary') +
    t(322, 296, 'FOCUS', 'label') + t(420, 296, ': Web Development · AI', 'body') +
    t(438, 321, '· Useful Tools', 'body') +
    t(322, 352, 'STATUS', 'label') + t(420, 352, ': Currently Building', 'state') +
    slot(778, 24, 196, 340,
      t(792, 49, 'CONTACT.EXE', 'label') + line(790, 61, 962, 61) +
      contactRows(794, 86, 27) + line(790, 211, 962, 211) +
      t(792, 236, 'SYSTEM INFO', 'label') +
      t(794, 260, 'OS     Windows 11', 'body') +
      t(794, 285, 'EDITOR VS Code', 'body') +
      t(794, 310, 'SHELL  PowerShell', 'body') +
      t(794, 335, 'PET    Available', 'body')), c.cyan));

  save('hero-mobile', svg('Vincent — Player Profile', profileDescription, 600, 750,
    image('vincent_character.gif', 20, 20, 210, 244, 'preserveAspectRatio="xMidYMid meet"') +
    t(252, 51, 'PLAYER / 001', 'mobile-label') + pixelName(252, 83, 5) +
    t(252, 162, 'SOFTWARE', 'mobile-label') + t(252, 195, 'DEVELOPER', 'mobile-label') +
    t(252, 240, 'CURRENTLY BUILDING', 'mobile-meta') +
    t(20, 308, 'Building web products, AI systems', 'mobile') +
    t(20, 345, 'and tools that people enjoy using.', 'mobile') +
    line(20, 368, 580, 368) +
    t(20, 408, 'LOCATION / Ho Chi Minh City, Vietnam', 'mobile-meta') +
    t(20, 446, 'FOCUS / Web Development · AI · Useful Tools', 'mobile-meta') +
    line(20, 472, 580, 472) +
    t(20, 512, 'CONTACT.EXE', 'mobile-label') + t(326, 512, 'SYSTEM INFO', 'mobile-label') +
    contactRows(20, 557, 38, true) +
    t(326, 557, 'OS / Windows 11', 'mobile-meta') +
    t(326, 595, 'EDITOR / VS Code', 'mobile-meta') +
    t(326, 633, 'SHELL / PowerShell', 'mobile-meta') +
    t(326, 671, 'PET / Available', 'mobile-meta'), c.cyan));

  const questDescription = 'Current Quest: Narrative Studio. In progress. An AI workspace for visual-novel creation, memory and story continuity. Next.js, TypeScript, AI, RAG, Story. Open the linked image or the repository link below.';
  save('current-quest', svg('Current Quest — Narrative Studio', questDescription, 1000, 286,
    '<path d="M30 30h7v-7h8v7h7v8h-7v7h-8v-7h-7z" fill="#A970FF"/>' +
    t(68, 40, 'CURRENT QUEST', 'title') + t(968, 40, '● IN PROGRESS', 'state', 'text-anchor="end"') +
    line(26, 56, 974, 56, c.purple) +
    image('art/narrative-workspace.png', 26, 78, 254, 164, 'preserveAspectRatio="xMidYMid slice"') +
    t(26, 266, '01 / 01 · FEATURED QUEST', 'meta') +
    t(310, 108, 'Narrative Studio', 'heading') +
    t(310, 145, 'An AI workspace for visual-novel creation, memory', 'body') +
    t(310, 170, 'and story continuity.', 'body') +
    [['NEXT.JS', 78], ['TYPESCRIPT', 110], ['AI', 52], ['RAG', 60], ['STORY', 72]].map(([label, width], i, array) => {
      const x = 310 + array.slice(0, i).reduce((sum, item) => sum + item[1] + 12, 0);
      return slot(x, 192, width, 30, t(x + width / 2, 212, label, 'meta', 'text-anchor="middle" style="fill:#E6EDF7"'));
    }).join('') +
    t(310, 260, 'Ideas, characters and stories live longer.', 'meta') +
    '<rect x="812" y="236" width="162" height="32" fill="#080D16" stroke="#59F5BE"/>' +
    t(893, 257, 'VIEW REPOSITORY →', 'state', 'text-anchor="middle"'), c.purple));
  save('current-quest-mobile', svg('Current Quest — Narrative Studio', questDescription, 600, 440,
    t(20, 44, '◆ CURRENT QUEST', 'mobile-label', 'style="fill:#A970FF"') +
    t(580, 44, 'IN PROGRESS', 'mobile-meta', 'text-anchor="end" style="fill:#59F5BE"') +
    image('art/narrative-workspace.png', 20, 76, 210, 142, 'preserveAspectRatio="xMidYMid slice"') +
    t(252, 113, 'Narrative', 'heading') + t(252, 155, 'Studio', 'heading') +
    t(252, 202, 'NEXT.JS / AI / RAG', 'mobile-meta') +
    t(20, 270, 'An AI workspace for visual-novel', 'mobile') +
    t(20, 308, 'creation, memory and story continuity.', 'mobile', 'style="font-size:24px"') +
    t(20, 355, 'TYPESCRIPT / STORY', 'mobile-meta') +
    t(580, 406, 'VIEW REPOSITORY →', 'mobile-label', 'text-anchor="end" style="fill:#59F5BE"'), c.purple));

  save('quest-log', svg('Quest Log — Five Projects', projects.map(p => p.name + ': ' + p.description + ' (' + p.status + ')').join('. '), 490, 430,
    t(24, 39, 'QUEST LOG', 'title') + t(466, 39, 'PUBLIC PROJECTS', 'meta', 'text-anchor="end"') +
    line(24, 54, 466, 54) +
    projects.map((p, i) => {
      const y = 65 + i * 64;
      return (i === 0 ? '<rect x="21" y="65" width="448" height="58" fill="#121D2D" stroke="#29445C"/><path d="M21 65v58" stroke="#59F5BE"/>' : '') +
        projectIcon(p.key, 29, y + 10, 35) +
        t(82, y + 21, p.name, 'body', 'style="font-size:20px;font-weight:700"') +
        t(82, y + 44, p.description, 'body') +
        slot(386, y + 7, 72, 19, t(422, y + 20, p.status, 'meta', 'text-anchor="middle" style="fill:' + (i === 0 ? c.mint : c.cyan) + '"')) +
        (i < 4 ? line(26, y + 59, 464, y + 59) : '');
    }).join('') + t(466, 407, 'VIEW ALL REPOSITORIES →', 'state', 'text-anchor="end"'), c.purple));

  save('quest-log-mobile', svg('Quest Log — Five Projects', 'Narrative Studio, Animio, ChatApp, SkiiShop and YourSafe. Individual links follow below the panels.', 340, 920,
    '<style>.mobile,.mobile-label{font-size:28px}.mobile-meta{font-size:27px}</style>' + t(20, 46, 'QUEST LOG', 'mobile-label', 'style="fill:#A970FF"') +
    projects.map((p, i) => {
      const y = 82 + i * 152;
      const name = p.key === 'narrative'
        ? t(82, y + 25, 'Narrative', 'mobile') + t(82, y + 59, 'Studio', 'mobile')
        : t(82, y + 25, p.name, 'mobile');
      const description = [['AI-powered', 'creative workspace'], ['Pet transfer', 'SPA + Go'], ['Real-time', 'messaging'], ['Full-stack', 'e-commerce'], ['Local password', 'manager / Windows']][i];
      return projectIcon(p.key, 22, y, 42) + name +
        t(22, y + 94, description[0], 'mobile-meta') +
        t(22, y + 129, description[1], 'mobile-meta') +
        t(i === 0 ? 318 : 22, y + (i === 0 ? 25 : 59), p.status, 'mobile-meta', (i === 0 ? 'text-anchor="end" ' : '') + 'style="fill:#59F5BE"') +
        (i < 4 ? line(20, y + 143, 320, y + 143) : '');
    }).join('') + t(20, 888, 'LINKS BELOW', 'mobile-meta'), c.purple));

  save('inventory', svg('Inventory — Skills and Tools', inventory.map(([group, items]) => group + ': ' + items.map(item => item[1]).join(', ')).join('. '), 490, 430,
    t(24, 39, 'INVENTORY', 'title') + t(466, 39, 'SKILLS & TOOLS', 'meta', 'text-anchor="end"') +
    line(24, 54, 466, 54) +
    inventory.map(([group, items], index) => {
      const y = 76 + index * 82;
      const width = items.length === 4 ? 106 : 140;
      const gap = items.length === 4 ? 8 : 12;
      return t(24, y, group, 'label') + items.map(([key, name], i) => techSlot(key, name, 24 + i * (width + gap), y + 12, width)).join('');
    }).join(''), c.cyan));
  const mobileStarts = [90, 270, 500, 730];
  save('inventory-mobile', svg('Inventory — Skills and Tools', 'C#, TypeScript, JavaScript, .NET, Next.js, React, Angular, Docker, SQL Server, Git, Jenkins, Redis, PostgreSQL and VS Code.', 340, 920,
    '<style>.mobile,.mobile-label{font-size:28px}.mobile-meta{font-size:27px}</style>' + t(20, 46, 'INVENTORY', 'mobile-label') +
    inventory.map(([group, items], index) => {
      const y = mobileStarts[index];
      return t(20, y, group, 'mobile-meta') +
        items.map(([key, name], i) => techSlot(key, name, 20, y + 12 + i * 38, 300, true)).join('');
    }).join(''), c.cyan));

  const footerDescription = 'Quest journal saved. Thanks for visiting my GitHub profile. Always open to new ideas and opportunities. A pixel cat watches a moonlit forest. Contact links follow.';
  save('footer', svg('Quest Journal Saved', footerDescription, 1000, 220,
    image('art/moonlit-forest.png', 12, 12, 976, 196, 'preserveAspectRatio="xMidYMid slice"') +
    '<path d="M224 48h464v124H224v-40l-16-10 16-10z" fill="#080D16" fill-opacity=".95" stroke="#29445C"/>' +
    t(246, 80, 'QUEST JOURNAL SAVED ✓', 'title', 'style="fill:#59F5BE"') +
    t(246, 113, 'Thanks for visiting my GitHub profile.', 'body') +
    t(246, 142, 'Always open to new ideas and opportunities!', 'body'), c.cyan));
  save('footer-mobile', svg('Quest Journal Saved', footerDescription, 600, 260,
    image('art/moonlit-forest.png', 12, 12, 576, 236, 'preserveAspectRatio="xMidYMid meet"') +
    '<rect x="150" y="32" width="360" height="194" fill="#080D16" fill-opacity=".96" stroke="#29445C"/>' +
    t(168, 70, 'QUEST JOURNAL SAVED ✓', 'mobile-meta', 'style="fill:#59F5BE"') +
    t(168, 108, 'Thanks for visiting my', 'mobile-meta') +
    t(168, 138, 'GitHub profile.', 'mobile-meta') +
    t(168, 176, 'Always open to new ideas', 'mobile-meta') +
    t(168, 206, 'and opportunities!', 'mobile-meta'), c.cyan));

  const anchor = (url, label) => url ? `<a href="${escape(url)}">${escape(label)}</a>` : escape(label);
  const contactLinks = ['github', 'email', 'linkedin', 'portfolio', 'animio']
    .filter(key => links.contact[key]).map(key => anchor(links.contact[key], { github: 'GitHub', email: 'Email', linkedin: 'LinkedIn', portfolio: 'Portfolio', animio: 'Animio' }[key])).join(' · ');
  const footerLinks = ['github', 'email', 'linkedin']
    .filter(key => links.contact[key]).map(key => anchor(links.contact[key], { github: 'GitHub', email: 'Email', linkedin: 'LinkedIn' }[key])).join(' · ');
  const assetUrl = file => {
    const bytes = fs.readFileSync(path.join(root, 'assets', file));
    const content = file.endsWith('.svg') ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes;
    const version = createHash('sha256').update(content).digest('hex').slice(0, 16);
    return `https://raw.githubusercontent.com/Lmnhutw/Lmnhutw/main/assets/${file}?v=${version}`;
  };
  const picture = (name, alt, width = '100%') => `<picture><source media="(max-width: 600px)" srcset="${assetUrl(name + '-mobile.svg')}"><img src="${assetUrl(name + '.svg')}" width="${width}" alt="${escape(alt)}"></picture>`;
  const projectLinks = projects.map(p => anchor(links.projects[p.key], p.name)).join(' · ');
  const readme = `<p><img src="${assetUrl('banner.png')}" width="100%" alt="Welcome to my GitHub. Vincent at his desk with a cat in a pixel-art nighttime city scene."></p>
<p>${picture('system-header-plain', 'System Board / V2.1. Pixel RPG developer profile.')}</p>
<p>${picture('hero', 'Vincent, software developer in Ho Chi Minh City. Building web products, AI systems and tools that people enjoy using. Currently Building.')}</p>
<p align="center">${contactLinks}</p>
<p>${links.projects.narrative ? '<a href="' + escape(links.projects.narrative) + '">' : ''}${picture('current-quest', 'Current Quest: Narrative Studio. An AI workspace for visual-novel creation, memory and story continuity. Next.js, TypeScript, AI, RAG, Story. Open repository.')}${links.projects.narrative ? '</a>' : ''}</p>
<p align="center">${picture('quest-log', 'Quest Log: Narrative Studio, Animio, ChatApp, SkiiShop and YourSafe. Repository links follow.', '48%')}
    &nbsp;&nbsp;
  ${picture('inventory', 'Inventory. Languages: C#, TypeScript, JavaScript. Frameworks: .NET, Next.js, React, Angular. Tools: Docker, SQL Server, Git, Jenkins. Other: Redis, PostgreSQL, VS Code.', '48%')}</p>
<p>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  ${projectLinks}
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="${escape(links.contact.github + '?tab=repositories')}">View all repositories →</a>
</p>
<p><a href="${escape(links.contact.github + '?tab=overview')}">${picture('adventurer-log', 'Adventurer Log: real public repository, star, follower and account creation metrics with a dated GitHub contribution heatmap. Open GitHub for current activity.')}</a></p>
<p>${picture('footer', 'Quest journal saved. Thanks for visiting my GitHub profile. Always open to new ideas and opportunities!')}</p>
<p align="center">${footerLinks}</p>
<p align="center"><sub>Thank you for coming here ♥</sub></p>
`;
  fs.writeFileSync(path.join(root, 'README.md'), readme);
  console.log('Built 12 static SVGs and README.md from profile-links.json.');
}

if (require.main === module) build();
module.exports = { build, projects, inventory };
