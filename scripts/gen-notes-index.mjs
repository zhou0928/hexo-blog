// Generate the notes index pages from the two-level subject layout:
//   source/notes/index.md            -> subject directory (subjects only)
//   source/notes/<sub>/index.md      -> that subject's note list, grouped
// Subjects are any directory under source/notes/ containing NN-*.md files.
// Idempotent. Run: node scripts/gen-notes-index.mjs
//
// NOTE: dynamic imports (not static) so Hexo's scripts/ loader can wrap this file
// as a plain function body without a SyntaxError; the `typeof hexo` guard keeps it
// a no-op when Hexo loads it and runs it only when executed directly via node.

// Display titles per subject dir; falls back to the dir name.
const SUBJECT_TITLES = { python: 'Python3 学习笔记' };

async function main() {
  const { readFileSync, writeFileSync, readdirSync } = await import('node:fs');
  const { dirname, join } = await import('node:path');

  const root = join(dirname(process.argv[1]), '..');
  const notesDir = join(root, 'source', 'notes');

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const parseFrontmatter = (src) => {
    const m = src.match(/^---\n([\s\S]*?)\n---/);
    const fm = m ? m[1] : '';
    const title = (fm.match(/^title:\s*(.*)$/m)?.[1] ?? '').trim().replace(/^["']|["']$/g, '');
    const raw = fm.match(/^tags:\s*\[(.*)\]$/m)?.[1] ?? '';
    const tags = raw.split(',').map((t) => t.trim()).filter(Boolean);
    const group = (fm.match(/^group:\s*(.*)$/m)?.[1] ?? '').trim().replace(/^["']|["']$/g, '');
    return { title, tags, group };
  };

  const href = (file) => `./${file.replace(/\.md$/, '')}.html`;

  const renderNote = (n) => {
    const tags = n.tags.length
      ? ` <span class="note-tags">${n.tags.map(esc).join(' · ')}</span>`
      : '';
    return `<li><a href="${href(n.file)}">${esc(n.title)}</a>${tags}</li>`;
  };

  // `<ul>` must live inside the wrapper for `.notes-list li` styling to apply.
  const renderGroup = (items) =>
    `<div class="notes-list">\n<ul>\n${items.map(renderNote).join('\n')}\n</ul>\n</div>`;

  const subjects = readdirSync(notesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => readdirSync(join(notesDir, name)).some((f) => /^\d{2}-.*\.md$/.test(f)))
    .sort();

  const summary = [];

  for (const sub of subjects) {
    const subDir = join(notesDir, sub);
    const files = readdirSync(subDir)
      .filter((f) => /^\d{2}-.*\.md$/.test(f))
      .sort();

    const notes = files.map((file) => {
      const { title, tags, group } = parseFrontmatter(readFileSync(join(subDir, file), 'utf8'));
      return { file, title, tags, group };
    });

    const hasGroups = notes.some((n) => n.group);
    const groups = [];
    if (hasGroups) {
      for (const n of notes) {
        if (!groups.some((g) => g.name === n.group)) groups.push({ name: n.group, items: [] });
        groups.find((g) => g.name === n.group).items.push(n);
      }
    }

    const body = hasGroups
      ? groups
          .map((g) => `${g.name ? `## ${g.name}\n\n` : ''}${renderGroup(g.items)}`)
          .join('\n\n')
      : renderGroup(notes);

    const title = SUBJECT_TITLES[sub] ?? sub;
    const out = `---
title: "${title}"
date: 2026-09-10 00:00:00
---

共 ${notes.length} 篇

${body}
`;

    writeFileSync(join(subDir, 'index.md'), out);
    summary.push(`${sub}: ${notes.length} 篇`);
  }

  const subjectList = subjects
    .map((sub) => {
      const n = readdirSync(join(notesDir, sub)).filter((f) => /^\d{2}-.*\.md$/.test(f)).length;
      return `- [${esc(SUBJECT_TITLES[sub] ?? sub)}](./${sub}/) · ${n} 篇`;
    })
    .join('\n');

  const subjectsIndex = `---
title: "笔记"
date: 2026-09-10 00:00:00
---

我的学习笔记

${subjectList}
`;

  writeFileSync(join(notesDir, 'index.md'), subjectsIndex);

  console.log(`${subjects.length} subject(s) -> source/notes/index.md`);
  summary.forEach((s) => console.log(`  - ${s}`));
}

// `hexo` is defined only when Hexo wraps this file as a script (function body).
if (typeof hexo === 'undefined') main();
