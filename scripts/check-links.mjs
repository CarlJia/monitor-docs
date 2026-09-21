#!/usr/bin/env node
// 防止 base 前缀被硬编码进内容导致 404。
//
// 用法:
//   node scripts/check-links.mjs              跑两轮:source 扫 + dist 扫
//   node scripts/check-links.mjs --source     只跑 source 扫(快,无需构建)
//   node scripts/check-links.mjs --dist       只跑 dist 扫(需要先 build)
//
// 退出码:0 干净,>0 至少发现 1 处违规。

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
// 匹配内容中作为路径前缀的 `/monitor-docs`,例如 `[label](/monitor-docs/...)` 或 `link: /monitor-docs/...`。
// 用 lookbehind 排除 `CarlJia/monitor-docs/...` 这类 GitHub URL 中的子串。
const PATTERN = /(?<![\w-])\/monitor-docs(\/|$)/;
const SOURCE_DIRS = ['src/content/docs', 'src/content.config.ts', 'astro.config.mjs'];
const DIST_DIR = 'dist';
const SOURCE_EXTS = new Set(['.md', '.mdx', '.astro', '.ts', '.mjs', '.js', '.json', '.yaml', '.yml']);
const DIST_EXTS = new Set(['.html', '.js', '.css', '.xml', '.txt']);
const SKIP_PATH_SEGMENTS = ['node_modules', '.astro', '.git'];

const args = new Set(process.argv.slice(2));
const runSource = args.has('--source') || (!args.has('--dist') && !args.has('--no-source'));
const runDist = args.has('--dist') || (!args.has('--source') && !args.has('--no-dist'));

function walk(dir, allowedExts) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (SKIP_PATH_SEGMENTS.includes(name)) continue;
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) {
      out.push(...walk(full, allowedExts));
    } else if (allowedExts.has(extname(name))) {
      out.push(full);
    }
  }
  return out;
}

function scanFiles(files) {
  const hits = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (PATTERN.test(lines[i])) {
        hits.push({ file, line: i + 1, text: lines[i].trim() });
      }
    }
  }
  return hits;
}

function report(label, hits) {
  if (hits.length === 0) {
    console.log(`✓ ${label}: no /monitor-docs/ paths found`);
    return 0;
  }
  console.error(`✗ ${label}: found ${hits.length} hardcoded /monitor-docs/ reference(s)`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  ${h.text}`);
  }
  return hits.length;
}

function collectSourceFiles() {
  const files = [];
  for (const target of SOURCE_DIRS) {
    const s = statSync(target);
    if (s.isDirectory()) {
      files.push(...walk(target, SOURCE_EXTS));
    } else {
      files.push(target);
    }
  }
  return files;
}

let totalFailures = 0;

if (runSource) {
  const files = collectSourceFiles();
  const hits = scanFiles(files);
  totalFailures += report(`source scan (${files.length} files)`, hits);
}

if (runDist) {
  if (!existsSync(DIST_DIR)) {
    console.error(`✗ dist scan: ${DIST_DIR}/ not found. Run \`npm run build\` first.`);
    process.exit(2);
  }
  const files = walk(DIST_DIR, DIST_EXTS);
  const hits = scanFiles(files);
  totalFailures += report(`dist scan (${files.length} HTML/CSS/JS files)`, hits);
}

if (totalFailures > 0) {
  console.error(`\n${totalFailures} violation(s). /monitor-docs/ is a leftover from the GitHub project page URL; the site now runs at the custom domain root.`);
  process.exit(1);
}