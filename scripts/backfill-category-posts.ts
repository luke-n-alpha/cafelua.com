import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');
const MAP = '/tmp/naver-category-map.json';
const BLOG_ID = 'fstory97';
const TARGET_CATS = new Set(['172','173','178','175','183','188','176','174','184']);

const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));
const normalizeDate=(s:string)=>{const m=s.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/); if(m) return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`; return '';};
const slugify=(date:string,title:string)=>`${date.replace(/-/g,'')}-${title.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g,'').replace(/\s+/g,'-').replace(/-+$/,'').slice(0,50)||'post'}`;

async function scrape(page:Page, logNo:string){
  const url=`https://m.blog.naver.com/PostView.naver?blogId=${BLOG_ID}&logNo=${logNo}`;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await sleep(900);
  return await page.evaluate(() => {
    const root = document.querySelector('.se_doc_viewer') || document.querySelector('.post_ct') || document.body;
    const title = (root.querySelector('.se_textarea,.se-title-text,.title_post,h3')?.textContent || '').trim();
    const dateStr = (root.querySelector('.blog_date,.se_publishDate,.se-date,.date')?.textContent || '').trim();
    const category = (root.querySelector('a[href*="categoryNo="]')?.textContent || '').trim();

    const images:string[]=[]; const seen=new Set<string>(); let idx=0;
    const getSrc=(img:HTMLImageElement)=>img.getAttribute('data-lazy-src')||img.getAttribute('data-src')||img.currentSrc||img.src||'';
    const ser=(node:Node):string=>{
      if(node.nodeType===Node.TEXT_NODE) return node.textContent||'';
      if(node.nodeType!==Node.ELEMENT_NODE) return '';
      const el=node as HTMLElement; const tag=el.tagName.toLowerCase();
      if(tag==='img'){
        const img=el as HTMLImageElement; const src=getSrc(img).trim(); if(!src||seen.has(src)) return '';
        const cls=`${img.className||''} ${(img.parentElement?.className||'')}`.toLowerCase();
        if(cls.includes('oglink')||img.closest('.se_oglink,[class*="oglink"]')) return '';
        if(src.includes('blogpfthumb')||src.includes('dthumb-phinf.pstatic.net')) return '';
        seen.add(src); images.push(src); idx+=1; return `{{IMG:${idx}}}`;
      }
      const child=Array.from(el.childNodes).map(ser).join('');
      if(tag==='br') return '\n';
      if(tag==='strong'||tag==='b') return `**${child}**`;
      if(tag==='a'){ const href=(el as HTMLAnchorElement).href||''; const txt=child.replace(/\s+/g,' ').trim(); if(!href) return txt; if(!txt) return href; return `[${txt}](${href})`; }
      if(/^h[1-6]$/.test(tag)){ const lv=Number(tag[1]); return `\n\n${'#'.repeat(lv)} ${child.trim()}\n\n`; }
      if(tag==='li') return `- ${child.trim()}\n`;
      return child;
    };

    const comps=Array.from(root.querySelectorAll('.se_component,.se-component'));
    const parts:string[]=[]; const targets=comps.length?comps:Array.from(root.childNodes);
    for(const n of targets){ const cls=((n as HTMLElement).className||'').toLowerCase(); if(cls.includes('documenttitle')||cls.includes('reaction')||cls.includes('comment')||cls.includes('blog2_series')) continue; const t=ser(n).trim(); if(!t) continue; if(/^(이웃추가|본문 기타 기능|공유하기|댓글)/.test(t)) continue; parts.push(t); }
    const content=parts.join('\n\n').replace(/\n{3,}/g,'\n\n').trim();
    return {title,dateStr,category,content,images};
  });
}

function generate(posts:any[]){
  const lines:string[]=[];
  lines.push(`import type { DeskPost } from './deskData';\n`);
  lines.push('/**');
  lines.push(` * 네이버 블로그에서 자동 스크래핑한 포스트 (${new Date().toISOString().slice(0,10)})`);
  lines.push(` * 블로그: https://blog.naver.com/${BLOG_ID}`);
  lines.push(` * 총 ${posts.length}개`);
  lines.push(' *');
  lines.push(' * NOTE: titleEn / contentEn 은 수동 번역 필요');
  lines.push(' */\n');
  lines.push('export const NAVER_POSTS: DeskPost[] = [');
  for(const p of posts){
    lines.push('    {');
    lines.push(`        slug: ${JSON.stringify(p.slug)},`);
    lines.push(`        date: ${JSON.stringify(p.date)},`);
    lines.push(`        titleKo: ${JSON.stringify(p.titleKo)},`);
    lines.push(`        titleEn: ${JSON.stringify(p.titleEn||p.titleKo)}, // TODO: translate`);
    lines.push(`        contentKo: ${JSON.stringify(p.contentKo||'')},`);
    lines.push(`        contentEn: ${JSON.stringify(p.contentEn||'')}, // TODO: translate`);
    lines.push(`        category: ${JSON.stringify(p.category||'misc')},`);
    if(p.sourceCategoryNo) lines.push(`        sourceCategoryNo: ${JSON.stringify(p.sourceCategoryNo)},`);
    if(p.sourceCategory) lines.push(`        sourceCategory: ${JSON.stringify(p.sourceCategory)},`);
    if(p.tags?.length) lines.push(`        tags: ${JSON.stringify(p.tags)},`);
    lines.push(`        thumbnail: ${JSON.stringify(p.thumbnail||'')},`);
    lines.push(`        images: ${JSON.stringify(p.images||[])},`);
    lines.push(`        externalUrl: ${JSON.stringify(p.externalUrl)},`);
    lines.push('    },');
  }
  lines.push('];\n');
  return lines.join('\n');
}

async function main(){
  const map=JSON.parse(fs.readFileSync(MAP,'utf-8')) as Record<string,{categoryNo:string;categoryName:string}>;
  const existing=[...(NAVER_POSTS as any[])];
  const byUrl=new Set(existing.map(p=>String(p.externalUrl||'')));
  const targetLogs=Object.entries(map).filter(([,v])=>TARGET_CATS.has(String(v.categoryNo))).map(([k])=>k);
  const missingLogs=targetLogs.filter(log=>!byUrl.has(`https://blog.naver.com/fstory97/${log}`));
  console.log('target',targetLogs.length,'missing',missingLogs.length);

  const browser=await chromium.launch({headless:true,chromiumSandbox:false});
  const page=await (await browser.newContext({locale:'ko-KR'})).newPage();
  const added:any[]=[];
  for(let i=0;i<missingLogs.length;i++){
    const logNo=missingLogs[i];
    try{
      const s=await scrape(page,logNo);
      if(!s.title){ console.log('skip no title',logNo); continue; }
      const d=normalizeDate(s.dateStr)||'2000-01-01';
      const m=map[logNo];
      const slug=slugify(d,s.title);
      const images=s.images;
      added.push({
        slug,
        date:d,
        titleKo:s.title,
        titleEn:s.title,
        contentKo:s.content,
        contentEn:'',
        category:'misc',
        sourceCategoryNo:String(m.categoryNo),
        sourceCategory:m.categoryName,
        tags:[m.categoryName],
        thumbnail:images[0]||'',
        images,
        externalUrl:`https://blog.naver.com/fstory97/${logNo}`,
      });
      console.log(`+ [${i+1}/${missingLogs.length}] ${logNo} ${m.categoryName}`);
    }catch(e){
      console.log(`x [${i+1}/${missingLogs.length}] ${logNo} ${(e as Error).message}`);
    }
    await sleep(150);
  }
  await browser.close();

  const merged=[...existing,...added];
  fs.writeFileSync(OUT, generate(merged), 'utf-8');
  console.log('written',merged.length,'added',added.length);
}

main().catch(e=>{console.error(e);process.exit(1);});
