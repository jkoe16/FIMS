// dist/ 빌드 결과(JS·CSS)를 index.html 하나에 합쳐 fims.html 생성 (추가 라이브러리 없음)
// 사용: npm run build:html  → 프로젝트 루트의 fims.html
// 주의: .env 의 Supabase URL·Publishable key 가 파일 안에 포함됩니다. (Git 업로드 제외)
import { readFileSync, writeFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
let html = readFileSync(new URL('index.html', dist), 'utf8');

html = html.replace(/<script type="module" crossorigin src="\/?([^"]+)"><\/script>/, (_, src) => {
  const js = readFileSync(new URL(src, dist), 'utf8').replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
  return `<script type="module">${js}</script>`;
});
html = html.replace(/<link rel="stylesheet" crossorigin href="\/?([^"]+)">/, (_, href) =>
  `<style>${readFileSync(new URL(href, dist), 'utf8')}</style>`);

if (/src="\/?assets\/|href="\/?assets\//.test(html)) throw new Error('인라인되지 않은 파일이 남아 있습니다.');
if (!html.includes('supabase.co')) throw new Error('.env 의 Supabase 연결 정보가 빌드에 없습니다. .env 를 확인하세요.');

writeFileSync(new URL('../fims.html', import.meta.url), html);
console.log(`fims.html 생성 완료 (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
