import {categories} from './data';
const contentFiles:Record<string,string>={
'clothing-men':'clothing-men.png','clothing-women':'clothing-women.png',logo:'logo-comparison.png',photo:'gemini-photo.png',reels:'reels.png','ad-analysis':'instagram-ads.png','blog-keywords':'blog-keywords.png'
};
export const imageRegistry:Record<string,{src:string;alt:string}>={
...Object.fromEntries(categories.map(c=>[c.image,{src:contentFiles[c.id]?import.meta.env.BASE_URL+'content/'+contentFiles[c.id]:'',alt:c.title+' — '+(c.id==='logo'?'레퍼런스와 최종 로고 비교':'기존 콘텐츠 표지')}])),
'남자 포트폴리오 의상 분위기 콜라주':{src:import.meta.env.BASE_URL+'content/clothing-men-moodboard.png',alt:'남자 포트폴리오 의상 분위기 콜라주'},
'브랜드 톤을 통일한 반영구샵 캐러셀과 피드 템플릿':{src:'',alt:'피드 템플릿 결과물'},
'반영구샵에서 콘텐츠를 준비하는 1인 원장님':{src:'',alt:'원장님 활용 사례'},
'네일샵에서 피드 템플릿을 확인하는 원장님':{src:'',alt:'원장님 활용 사례'},
'속눈썹샵에서 예약 안내를 정리하는 원장님':{src:'',alt:'원장님 활용 사례'},
'샵에서 노트북으로 콘텐츠를 만드는 LUNA':{src:'',alt:'샵에서 콘텐츠 작업 중인 LUNA'}
};
