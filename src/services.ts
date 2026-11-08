import {brand} from './data';
type Value=string|number|boolean;
const allowed=new Set(['category_id','resource_id','button_location','slide_index','is_demo']);
declare global {interface Window {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void}}
export function track(name:string,params:Record<string,Value>={}){const safe=Object.fromEntries(Object.entries({...params,is_demo:!brand.emailEndpoint}).filter(([k])=>allowed.has(k)));if(brand.ga4Id&&window.gtag)window.gtag('event',name,safe);else if(import.meta.env.DEV)console.debug('[analytics demo]',name,safe)}
// UTM is intentionally not persisted before an approved attribution/consent policy exists.
export const CONSENT_VERSION='moonket-privacy-2026-11-09-v1';
let retryKey='';let retryId='';
export async function submitLead(email:string,resource:string,consent:boolean,requestNote=''){if(!consent)throw new Error('consent required');if(!brand.emailEndpoint)throw new Error('collection not connected');const key=JSON.stringify([email.trim(),resource,requestNote.trim()]);if(key!==retryKey){retryKey=key;retryId=crypto.randomUUID();}const response=await fetch(brand.emailEndpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({email,resource_id:resource,consent,resource_request:requestNote.trim().slice(0,500),consent_version:CONSENT_VERSION,request_id:retryId})});if(!response.ok)throw new Error('request failed');const result=await response.json();if(result.saved!==true)throw new Error('save not confirmed');retryKey='';retryId='';return {demo:false};}
