import {brand,categories} from './data';
type Value=string|number|boolean;
const allowed=new Set(['category_id','resource_id','button_location','slide_index','is_demo']);
const eventNames=new Set(['category_impression','category_click','detail_view','detail_slide_view','lead_form_open','resource_select','lead_submit_attempt','generate_lead','lead_submit_error','instagram_click']);
declare global {interface Window {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void}}
let initialized=false;
export function initAnalytics(){
  if(initialized||!brand.ga4Id||typeof window==='undefined')return;
  initialized=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer!.push(arguments)};
  const pageLocation=location.origin+location.pathname;
  let pageReferrer='';
  try{pageReferrer=document.referrer?new URL(document.referrer).origin:''}catch{}
  window.gtag('js',new Date());
  window.gtag('config',brand.ga4Id,{
    send_page_view:false,page_location:pageLocation,page_referrer:pageReferrer,
    allow_google_signals:false,allow_ad_personalization_signals:false,
    ...(new URLSearchParams(location.search).get('ga_debug')==='1'?{debug_mode:true}:{})
  });
  window.gtag('event','page_view',{send_to:brand.ga4Id,page_location:pageLocation,page_referrer:pageReferrer});
  if(!document.querySelector('script[data-moonket-ga4]')){
    const script=document.createElement('script');
    script.async=true;script.dataset.moonketGa4='true';
    if(new URLSearchParams(location.search).get('ga_debug')==='1'){
      script.onload=()=>console.info('[Moonket GA4] Google tag loaded');
      script.onerror=()=>console.warn('[Moonket GA4] Google tag blocked or unavailable');
    }
    script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(brand.ga4Id);
    document.head.appendChild(script);
  }
}
export function track(name:string,params:Record<string,Value>={}){
  if(!eventNames.has(name))return;
  const safe:Record<string,Value>=Object.fromEntries(Object.entries({...params,is_demo:!brand.emailEndpoint}).filter(([k])=>allowed.has(k)));
  const category=categories.find(c=>c.id===(safe.category_id||safe.resource_id));
  if(category){safe.content_name=category.title;safe.content_group=category.group;safe.content_status=category.status}
  if(brand.ga4Id&&window.gtag){window.gtag('event',name,{...safe,send_to:brand.ga4Id});if(new URLSearchParams(location.search).get('ga_debug')==='1')console.info('[Moonket GA4 event]',name,JSON.stringify(safe));}
  else if(import.meta.env.DEV)console.debug('[analytics demo]',name,safe);
}
// UTM is intentionally not persisted before an approved attribution/consent policy exists.
export const CONSENT_VERSION='moonket-privacy-2026-11-09-v1';
let retryKey='';let retryId='';
export async function submitLead(email:string,resource:string,consent:boolean,requestNote=''){if(!consent)throw new Error('consent required');if(!brand.emailEndpoint)throw new Error('collection not connected');const key=JSON.stringify([email.trim(),resource,requestNote.trim()]);if(key!==retryKey){retryKey=key;retryId=crypto.randomUUID();}const response=await fetch(brand.emailEndpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({email,resource_id:resource,consent,resource_request:requestNote.trim().slice(0,500),consent_version:CONSENT_VERSION,request_id:retryId})});if(!response.ok)throw new Error('request failed');const result=await response.json();if(result.saved!==true)throw new Error('save not confirmed');retryKey='';retryId='';return {demo:false};}
