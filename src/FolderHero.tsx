import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArrowDown,ArrowUpRight,Plus} from 'lucide-react';
import {categories,type Category} from './data';
import {imageRegistry} from './images';
import {track} from './services';
import './folder-hero.css';
import './archive-refinement.css';
import './paper-folders.css';
import './stacked-folders.css';
import './folder-hover.css';

const folders=[
 {name:'사진·디자인',color:'#DEFB0B',ink:'#000000',line:'사진 한 장에서 시작하는 변화',short:'PHOTO & DESIGN'},
 {name:'릴스·캐러셀',color:'#3051F5',ink:'#000000',line:'사진을 넘어, 움직이는 콘텐츠로',short:'REELS & CAROUSEL'},
 {name:'광고·블로그',color:'#D41CCF',ink:'#000000',line:'감으로 하던 마케팅에 방향을',short:'ADS & BLOG'},
 {name:'레퍼런스 도구',color:'#F07BC4',ink:'#000000',line:'아이디어를 찾고 모으는 방법',short:'REFERENCE TOOLS'}
];
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function FolderHero({onOpen,onLead}:{onOpen:(c:Category)=>void;onLead:(location:string)=>void}){
 const ref=useRef<HTMLElement>(null),[active,setActive]=useState(0),[expanded,setExpanded]=useState<number|null>(null),[progress,setProgress]=useState(0),[reduced,setReduced]=useState(false);
 const statementRef=useRef<HTMLHeadingElement>(null);const introTitleRef=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{let live=true;const fit=()=>{if(!live||!statementRef.current)return;const lines=Array.from(statementRef.current.children) as HTMLElement[];const intro=introTitleRef.current;if(intro)ref.current?.style.setProperty('--statement-top',`${intro.offsetTop+intro.offsetHeight/2}px`);const width=Math.max(...lines.map(n=>n.offsetWidth));lines.forEach(n=>n.style.setProperty('--line-scale',String(width/n.offsetWidth)))};document.fonts.ready.then(fit);addEventListener('resize',fit);fit();return()=>{live=false;removeEventListener('resize',fit)}},[]);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(media.matches);change();media.addEventListener('change',change);
  let raf=0;const update=()=>{raf=0;const n=ref.current;if(n)setProgress(clamp(-n.getBoundingClientRect().top/(n.offsetHeight-innerHeight)))};
  const scroll=()=>{if(!raf)raf=requestAnimationFrame(update)};update();addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);
  return()=>{removeEventListener('scroll',scroll);removeEventListener('resize',scroll);media.removeEventListener('change',change);cancelAnimationFrame(raf)};
 },[]);
 const lift=clamp((progress-.36)/.30),open=reduced?1:clamp((progress-.72)/.20),arrived=reduced||lift>.98;

 const choose=(i:number)=>{setActive(i);track('folder_select',{category_id:folders[i].short});ref.current?.querySelectorAll<HTMLElement>('.folder-files')[i]?.scrollTo({left:0,behavior:reduced?'instant':'smooth'});};
 const reveal=()=>{const n=ref.current;if(n)scrollTo({top:n.offsetTop+(n.offsetHeight-innerHeight)*.9,behavior:reduced?'instant':'smooth'})};
 return <>
 <section className={'archive-story'+(reduced?' reduce-motion':'')} ref={ref} aria-label="문켓 AI 마케팅 소개와 콘텐츠 폴더" style={{'--intro-fade':reduced?1:1-clamp((progress-.22)/.12),'--lift':lift,'--open':open} as CSSProperties}>
  <div className="archive-pin">
   <div className="archive-intro" style={{pointerEvents:progress>.35?'none':'auto'}} aria-hidden={!reduced&&progress>.38}>
    <span className="archive-kicker">FOR THE ONE WHO DOES IT ALL</span>
    <h1 ref={introTitleRef}>아직도 혼자<br className="intro-mobile-break"/> 일하고 계신가요?</h1>
    <p className="archive-sub" style={{opacity:reduced?1:clamp((progress-.025)/.08),transform:`translateY(${reduced?0:20*(1-clamp((progress-.025)/.08))}px)`}}>시술 이후에도 끝나지 않는<br/>사진 편집, 인스타 피드, 릴스, 광고 분석, 블로그까지</p>
    <p className="archive-sign" style={{opacity:reduced?1:clamp((progress-.12)/.07)}}>혼자 운영하는 뷰티샵을 위한<br/><strong>AI 마케팅, 문켓</strong></p>
    <button className="archive-scroll" onClick={reveal} tabIndex={progress>.35?-1:0}><span className="scroll-mouse" aria-hidden="true"><i/></span><span>아래로 스크롤해보세요<small>원장님의 다음 가능성이 열립니다</small></span><ArrowDown size={22}/></button>
   </div>
   <div className="archive-folder-view" style={{opacity:reduced?1:clamp((progress-.24)/.04),pointerEvents:arrived?'auto':'none'}} aria-hidden={!arrived}>
    <div className="archive-folder-heading" style={{opacity:reduced?1:clamp((progress-.28)/.10),transform:`translateY(calc(-50% + ${reduced?0:20*(1-clamp((progress-.28)/.10))}px))`}}><span>THE MOONKET FILES</span><h2 ref={statementRef}><span>시술 너머의 일들,</span><span>이 안에 담았습니다</span></h2><p>{open>.65?'파일을 눌러 활용법을 살펴보세요':'스크롤하면 폴더 속 가능성이 열립니다'}</p></div>
    <div className="folder-stage">
     {folders.map((f,i)=>{
      const isActive=i===active,rank=i;const isExpanded=expanded===i;const allFiles=categories.filter(c=>c.group===f.name);const files=allFiles.filter(c=>c.id!=='reference-tools'||c.status==='existing');const fileOpen=reduced?1:clamp((progress-.68-i*.035)/.17);
      const enter=reduced?1:clamp((progress-.38-i*.035)/.16);
      return <div key={f.name} className={'archive-folder'+(isActive?' is-active':'')+(isExpanded?' is-expanded':'')} onMouseLeave={()=>setExpanded(n=>n===i?null:n)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setExpanded(n=>n===i?null:n)}} style={{'--folder-color':f.color,'--folder-ink':f.ink,'--rank':rank,'--folder-open':fileOpen,transform:`translate3d(0,${(1-enter)*850}px,0)`,zIndex:isExpanded?20:rank+1} as CSSProperties}>
       <div className="folder-back"/>
       <button className={'folder-tab tab-'+i} onMouseEnter={()=>{if(matchMedia('(hover:hover)').matches){setExpanded(i);choose(i)}}} onMouseLeave={()=>setExpanded(n=>n===i?null:n)} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))setExpanded(i)}} onClick={()=>{choose(i);if(matchMedia('(hover:hover)').matches)setExpanded(i);else setExpanded(n=>n===i?null:i)}} aria-expanded={isExpanded} aria-controls={'folder-files-'+i} disabled={!arrived} tabIndex={arrived?0:-1} aria-pressed={isActive} aria-label={f.name+' 폴더 열기'}><span>{f.name}</span><Plus size={15}/></button>
       <div id={'folder-files-'+i} className="folder-files" style={{opacity:fileOpen,pointerEvents:fileOpen>.75?'auto':'none'}} aria-hidden={fileOpen<=.75}>
        {files.map((c,i)=><button key={c.id} className="archive-file" aria-hidden={!isExpanded&&i>0} tabIndex={fileOpen>.75&&(isExpanded||i===0)?0:-1} onClick={()=>{track('folder_file_click',{category_id:c.id});onOpen(c)}} style={{'--file-index':i,'--file-count':files.length,'--fan-slot':[0,-1,1,-2,2][i]??i} as CSSProperties}>
         <span className="file-topline"><span>MOONKET / {String(i+1).padStart(2,'0')}</span><ArrowUpRight size={15}/></span>
         <div className="file-art">{imageRegistry[c.image]?.src?<img src={imageRegistry[c.image].src} alt="" loading="lazy"/>:<span>comming</span>}</div><strong>{c.title}</strong><small>{c.status==='existing'?'활용 가이드 열기':'콘텐츠 준비 중'}</small>
        </button>)}
       </div>
       <div className="folder-front"><div className="folder-face-copy"><span>{String(i+1).padStart(2,'0')} / {f.short}</span><strong>{f.line}</strong><span>MOONKET®<br/>A GUIDE FOR YOUR NEXT POSSIBILITY</span></div></div>
      </div>
     })}
    </div>
    <nav className="folder-switcher" style={{opacity:arrived?1:0}} aria-label="폴더 카테고리">{folders.map((f,i)=><button key={f.name} tabIndex={arrived?0:-1} className={i===active?'active':''} onClick={()=>{choose(i);setExpanded(null)}} aria-pressed={i===active}><i style={{background:f.color}}/>{f.name}<span>{categories.filter(c=>c.group===f.name).length}</span></button>)}</nav>
   </div>
   <div className="archive-progress" aria-hidden="true"><span style={{transform:`scaleX(${progress})`}}/></div>
  </div>
 </section>
 <section className="archive-after inline-cta"><div className="archive-banner-copy"><span>MAKE IT YOURS</span><h2>우리 샵에서도 해보고 싶다면</h2><p>마음에 든 활용법을 골라, 무료 자료집으로 따라 해보세요</p></div><div className="archive-banner-actions"><button className="primary" onClick={()=>onLead('folder_after')}>무료 자료집 받아보기 <ArrowUpRight size={18}/></button></div></section>
 </>;
}
