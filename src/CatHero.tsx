import {useEffect,useRef,useState} from 'react';
import './cat-hero.css';

function Paw(){return <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="5" cy="8" rx="2.4" ry="3" transform="rotate(-25 5 8)"/><ellipse cx="10" cy="5" rx="2.3" ry="3"/><ellipse cx="15" cy="5.5" rx="2.3" ry="3"/><ellipse cx="20" cy="9" rx="2.3" ry="3" transform="rotate(25 20 9)"/><path d="M12 10c-3 0-3 3-6 5-4 4 0 8 4 6 1-.5 3-.5 4 0 5 2 8-2 4-6-3-2-3-5-6-5Z"/></svg>}
type Letter={node:HTMLElement;x:number;y:number;vx:number;vy:number;r:number;vr:number;w:number;h:number;hit:boolean};
export function CatHero(){
 const root=useRef<HTMLElement>(null),letters=useRef<HTMLDivElement>(null),cat=useRef<HTMLDivElement>(null);
 const finish=useRef<()=>void>(()=>{});const [cleared,setCleared]=useState(false);
 useEffect(()=>{
  const hero=root.current!,layer=letters.current!,kitty=cat.current!;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let bodies:Letter[]=[],raf=0,last=0,lastHit=0,hitCount=0,done=false,visible=true,lastInput=0,shownAt=0,returning=0;
  let pos={x:0,y:0},target={x:0,y:0},moving=false;
  const build=()=>{layer.querySelectorAll<HTMLElement>('.cat-letter').forEach(n=>{n.style.transform='';n.style.opacity=''});const box=hero.getBoundingClientRect();bodies=Array.from(layer.querySelectorAll<HTMLElement>('.cat-letter')).map(node=>{const b=node.getBoundingClientRect();return{node,x:0,y:0,vx:0,vy:0,r:0,vr:0,w:b.width,h:b.height,hit:false,ox:b.left-box.left,oy:b.top-box.top}});pos={x:box.width*.78,y:box.height*.64};target={...pos};kitty.style.transform=`translate(${pos.x}px,${pos.y}px)`;};
  const scatter=(b:Letter,dx:number)=>{if(b.hit)return;b.hit=true;hitCount++;b.vx=(dx>=0?1:-1)*(3+Math.random()*5);b.vy=-5-Math.random()*5;b.vr=(Math.random()-.5)*10;};
  const clear=()=>{if(done)return;done=true;shownAt=performance.now();for(const b of bodies)scatter(b,Math.random()-.5);setCleared(true);hero.classList.add('is-cleared');};finish.current=clear;
  const move=(e:PointerEvent)=>{lastInput=performance.now();if(returning)return;if(e.pointerType==='touch'){clear();return}const b=hero.getBoundingClientRect();target={x:e.clientX-b.left,y:e.clientY-b.top};moving=true;};
  const leave=()=>{moving=false;};
  const tick=(time:number)=>{const dt=Math.min((time-last)/16.67||1,2);last=time;
   if(visible&&!reduce){const dx=target.x-pos.x,dy=target.y-pos.y;pos.x+=dx*.13*dt;pos.y+=dy*.13*dt;const speed=Math.hypot(dx,dy);const bounce=moving?Math.sin(time*.026)*Math.min(speed*.13,7):0;kitty.style.transform=`translate(${pos.x}px,${pos.y+bounce}px) rotate(${Math.max(-14,Math.min(14,dx*.10))}deg)`;
    if(moving&&!returning&&speed>1&&time-lastHit>100){const nearby=bodies.filter(b=>{const o=b as Letter&{ox:number;oy:number};return !b.hit&&Math.abs(pos.x-o.ox-b.w/2)<b.w/2+20&&Math.abs(pos.y-o.oy-b.h/2)<b.h/2+18}).sort((a,b)=>{const x=a as Letter&{ox:number;oy:number},y=b as Letter&{ox:number;oy:number};return Math.hypot(pos.x-x.ox-a.w/2,pos.y-x.oy-a.h/2)-Math.hypot(pos.x-y.ox-b.w/2,pos.y-y.oy-b.h/2)});if(nearby[0]){scatter(nearby[0],dx);lastHit=time;}}
    for(const b of bodies){if(returning){b.x*=Math.pow(.84,dt);b.y*=Math.pow(.84,dt);b.r*=Math.pow(.84,dt);b.node.style.transform=`translate(${b.x}px,${b.y}px) rotate(${b.r}deg)`;b.node.style.opacity=String(Math.min(1,(time-returning)/450));}else if(b.hit){b.vy+=.34*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.r+=b.vr*dt;b.node.style.transform=`translate(${b.x}px,${b.y}px) rotate(${b.r}deg)`;b.node.style.opacity=String(Math.max(0,1-Math.max(0,b.y-100)/220));}}
    if(hitCount>0&&!returning&&time-Math.max(lastInput,shownAt)>6000){returning=time;moving=false;setCleared(false);hero.classList.remove('is-cleared');for(const b of bodies){b.x=Math.max(-450,Math.min(450,b.x));b.y=Math.max(-350,Math.min(450,b.y));b.r%=360;}}
    if(returning&&time-returning>900){returning=0;done=false;lastHit=0;hitCount=0;moving=false;build();}
    if(!returning&&!done&&hitCount===bodies.length)clear();
   }raf=requestAnimationFrame(tick);};
  build();document.fonts.ready.then(()=>{if(!done)build()});raf=requestAnimationFrame(tick);
  if(reduce)clear();
  const observer=new IntersectionObserver(([e])=>visible=e.isIntersecting);observer.observe(hero);
  const resize=()=>{if(!done)build()};hero.addEventListener('pointermove',move);hero.addEventListener('pointerdown',move);hero.addEventListener('pointerleave',leave);window.addEventListener('resize',resize);
  return()=>{cancelAnimationFrame(raf);observer.disconnect();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerdown',move);hero.removeEventListener('pointerleave',leave);window.removeEventListener('resize',resize)};
 },[]);
 const text='아직도 혼자 일하고 계신가요?';
 return <><section className={'cat-hero'+(cleared?' is-cleared':'')} ref={root} aria-label="혼자 운영하는 뷰티샵을 위한 AI 마케팅 문켓">
  <div className="cat-introduction" aria-hidden={!cleared}>
   <p>시술 이후에도 끝나지 않는<br/><strong>사진 편집, 인스타 피드, 릴스,<br className="cat-mobile-break"/> 광고 분석, 블로그까지</strong></p>
   <p className="cat-sign">혼자 운영하는 뷰티샵을 위한<br/><b>AI 마케팅, 문켓</b></p>
  </div>
  <div className="cat-letter-layer" ref={letters} aria-hidden="true"><div className="cat-line">{['아직도 혼자','일하고 계신가요?'].map((phrase,j)=><span className="cat-phrase" key={j}>{phrase.split('').map((c,i)=><span key={i} className={c===' '?'cat-space':'cat-letter'}>{c===' '?'\u00a0':c}</span>)}</span>)}</div></div>
  <h1 className="cat-sr-only">{text}</h1>
  <div className="hero-cat" ref={cat} aria-hidden="true"><svg viewBox="100 210 700 480"><image href={import.meta.env.BASE_URL+'brand/moonket-lockup-v2.png'} width="900" height="900"/></svg></div>
  <div className="cat-hero-bottom"><div><button onClick={()=>finish.current()} hidden={cleared}>소개 바로 보기</button><a href="#explore">콘텐츠 둘러보기</a></div></div>
 </section>
 <div className="moonket-marquee" aria-label="AI-marketing, semi-permanent"><div className="marquee-track" aria-hidden="true">{[0,1].map(copy=><div className="marquee-sequence" key={copy}>{[0,1,2].map(i=><span className="marquee-pair" key={i}><span>AI-marketing</span><Paw/><span>semi-permanent</span><Paw/></span>)}</div>)}</div></div>
 </>;
}
