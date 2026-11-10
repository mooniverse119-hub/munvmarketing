import {useEffect,useRef,type ReactNode} from 'react';
export function ScrollReveal({children}:{children:ReactNode}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const n=ref.current;if(!n)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){n.classList.add('is-revealed');observer.disconnect()}},{threshold:.16});observer.observe(n);return()=>observer.disconnect()},[]);
 return <div className="scroll-reveal" ref={ref}>{children}</div>;
}

export function usePageReveal(){
 useEffect(()=>{const nodes=Array.from(document.querySelectorAll<HTMLElement>('.archive-after,.content-source-note,.filters,.inline-cta,.moon-banner,.persona-section .section-heading,.persona-card,.idea-heading,.about-image,.about-copy,.faq>div,.final-cta,footer'));const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}}),{threshold:.10});nodes.forEach((node,i)=>{node.classList.add('auto-reveal');node.style.setProperty('--reveal-delay',String(i%3*55)+'ms');observer.observe(node)});return()=>observer.disconnect()},[]);
}
