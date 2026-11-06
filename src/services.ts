import {brand} from './data';
type Value=string|number|boolean;
const allowed=new Set(['category_id','resource_id','button_location','slide_index','is_demo']);
declare global {interface Window {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void}}
export function track(name:string,params:Record<string,Value>={}){const safe=Object.fromEntries(Object.entries({...params,is_demo:!brand.emailEndpoint}).filter(([k])=>allowed.has(k)));if(brand.ga4Id&&window.gtag)window.gtag('event',name,safe);else if(import.meta.env.DEV)console.debug('[analytics demo]',name,safe)}
// UTM is intentionally not persisted before an approved attribution/consent policy exists.
export async function submitLead(email:string,resource:string,consent:boolean){if(!brand.emailEndpoint){await new Promise(r=>setTimeout(r,650));return {demo:true};}const response=await fetch(brand.emailEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,resource_id:resource,consent})});if(!response.ok)throw new Error('request failed');const result=await response.json();if(result.saved!==true)throw new Error('save not confirmed');return {demo:false};}
