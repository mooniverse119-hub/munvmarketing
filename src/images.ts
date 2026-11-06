import {categories} from './data';
export const imageRegistry:Record<string,{src:string;alt:string}>={
...Object.fromEntries(categories.map(c=>[c.image,{src:'',alt:c.image}])),
'AI로 구성한 샵 소개 페이지와 인스타 피드 목업':{src:'',alt:'샵 소개 페이지와 피드 템플릿 결과물'},
'샵 사진 배경 정리 전후 비교':{src:'',alt:'같은 샵 사진의 배경 정리 전후 비교'},
'샵에서 노트북으로 콘텐츠를 만드는 LUNA':{src:'',alt:'샵에서 콘텐츠 작업 중인 LUNA'}
};
