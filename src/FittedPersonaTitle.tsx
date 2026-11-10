import {useEffect,useRef} from 'react';
export function FittedPersonaTitle({text}:{text:string}){
 const ref=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{const n=ref.current;if(!n)return;let live=true;const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');const fit=()=>{if(!live||!ctx)return;const css=getComputedStyle(n);ctx.font=`${css.fontWeight} 100px ${css.fontFamily}`;const natural=ctx.measureText(text).width;const tracking=parseFloat(css.letterSpacing)||0;const size=(n.clientWidth*.985-tracking*(text.length-1))/natural*100;n.style.fontSize=`${Math.max(12,Math.min(40,size))}px`};const observer=new ResizeObserver(fit);observer.observe(n.parentElement!);document.fonts.ready.then(fit);fit();return()=>{live=false;observer.disconnect()}},[text]);
 return <h3 ref={ref} className="persona-who">{text}</h3>;
}
