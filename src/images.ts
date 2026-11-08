import {categories} from './data';
const contentFiles:Record<string,string>={
'clothing-men':'clothing-men-16x9.png','clothing-women':'clothing-women-16x9.png',logo:'logo-comparison-16x9.png',photo:'gemini-photo-16x9.png',reels:'reels-16x9.png','ad-analysis':'instagram-ads-16x9-v2.png','blog-keywords':'blog-keywords-16x9-v2.png','instagram-feed':'instagram-feed-comparison-glow-16x9.png'
};
export const imageRegistry:Record<string,{src:string;alt:string}>={
...Object.fromEntries(categories.map(c=>[c.image,{src:contentFiles[c.id]?import.meta.env.BASE_URL+'content/'+contentFiles[c.id]:'',alt:c.title+' — '+(c.id==='logo'?'레퍼런스와 최종 로고 비교':'기존 콘텐츠 표지')}])),
'남자 포트폴리오 의상 분위기 콜라주':{src:import.meta.env.BASE_URL+'content/clothing-men-moodboard-16x9.png',alt:'남자 포트폴리오 의상 분위기 콜라주'},
'브랜드 톤을 통일한 반영구샵 캐러셀과 피드 템플릿':{src:'',alt:'피드 템플릿 결과물'},
'반영구샵에서 콘텐츠를 준비하는 1인 원장님':{src:import.meta.env.BASE_URL+'content/owner-day-01.jpg',alt:'사람들 사이에서 지친 표정으로 서 있는 캐릭터'},
'네일샵에서 피드 템플릿을 확인하는 원장님':{src:import.meta.env.BASE_URL+'content/owner-day-02.jpg',alt:'노트북 앞에서 고민하는 캐릭터'},
'속눈썹샵에서 예약 안내를 정리하는 원장님':{src:import.meta.env.BASE_URL+'content/owner-day-03.jpg',alt:'늦은 시간 혼자 사무실에서 작업하는 캐릭터'},
'샵에서 노트북으로 콘텐츠를 만드는 LUNA':{src:import.meta.env.BASE_URL+'brand/luna-profile.jpg',alt:'MUNV HAUS를 운영하는 LUNA의 프로필 사진'}
};

