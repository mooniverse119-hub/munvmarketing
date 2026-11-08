import type {CSSProperties} from 'react';
import './stardust.css';
// Keep artwork in its original color. The wrapper provides only a gentle hover zoom.
export function StardustImage({src,alt,ratio}:{src:string;alt:string;ratio:string}){
 return <div className="stardust-image" style={{aspectRatio:ratio.replace(':','/')} as CSSProperties}><div className="stardust-stage"><img className="content-image" src={src} alt={alt}/></div></div>
}
