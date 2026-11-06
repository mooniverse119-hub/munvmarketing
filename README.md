# MUNV AI CLASS

1인 뷰티샵 원장님을 위한 AI 운영·마케팅 교육 랜딩페이지. React + TypeScript + Vite. 외부 배포는 하지 않았습니다.

## 실행

Node.js 20.19+ 또는 22.12+ 권장. 일반적인 Node 설치 환경에서:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

현재 작업 환경처럼 npm 명령이 없는 경우 프로젝트 내부의 임시 제작 도구 사용:

```sh
node tools/package/bin/npm-cli.js ci
node tools/package/bin/npm-cli.js run dev
```

`tools/`는 Git에 포함되지 않는 임시 도구입니다. `node_modules/`, `dist/`, 비밀 환경 설정도 제외합니다.

## 파일 수정

- `src/data.ts`: 브랜드, 13개 콘텐츠, 그룹, 자료집 제목, FAQ.
- `src/images.ts`: 이미지 경로와 설명. 빈 경로는 사진 요구사항이 적힌 회색 상자로 표시됩니다.
- `src/main.tsx`: 페이지 구성, 상세 슬라이드, 신청 폼.
- `src/style.css`: 반응형 디자인.
- `src/services.ts`: 허용된 분석 정보와 이메일 서비스 연결 경계.

자료집과 사진은 아직 준비되지 않았습니다. 현 상태는 이메일을 저장·발송하지 않는 데모입니다.

## GitHub Pages 배포 준비

1. 이 폴더를 GitHub 저장소에 연결합니다. 비밀 키를 커밋하지 않습니다.
2. 로컬 또는 CI에서 `npm ci` 후 `npm run build`.
3. `dist/` 결과물을 Pages 정적 아티팩트로 배포합니다. GitHub Actions의 configure-pages, upload-pages-artifact, deploy-pages 조합을 사용할 수 있습니다.
4. 저장소 Settings → Pages의 배포 소스를 GitHub Actions로 지정합니다.
5. `base: './'` 설정으로 하위 경로의 에셋을 지원합니다. 상세 주소는 `#/content/photo` 같은 해시 경로여서 새로고침 시 서버 라우팅 설정이 필요하지 않습니다.
6. 운영 URL에서 상세 직접 접근, 새로고침, 모바일, 외부 서비스 CORS를 다시 확인합니다.

## 운영 전 체크

- 브랜드 이름, LUNA 소개, 사진을 실제 자료로 교체.
- 실제 발송할 자료집을 제작하고 서비스에서 자료 ID와 파일을 연결.
- 개인정보 처리 주체, 문의처, 수집 목적·항목, 보관·삭제 정책, 실제 동의 문구를 확정. 현재 화면의 동의는 데모 체험에 대한 문구이며 운영 동의가 아닙니다.
- 이메일 API 서버 및 발송 서비스 연결. 서버에서 이메일 검증, 동의 기록, 요청 제한, 중복 신청 정책, 오류 처리, 발송 이력을 구현.
- 브라우저 공개 코드에 API 비밀 키를 넣지 말 것. 정적 GitHub Pages와 별도로 서버 또는 서버리스 서비스가 필요합니다.
- `brand.emailEndpoint`를 설정하기 전에 신청 화면의 데모 설명, 버튼, 성공 문구, FAQ를 운영 흐름에 맞게 변경.
- API는 저장을 확정한 경우에만 `{ "saved": true }` 응답. 저장과 메일 발송은 서로 다른 상태입니다.
- GA4, 광고 UTM, 개인정보 및 동의 정책을 검토한 뒤 ANALYTICS.md에 따라 연결.

## 검증

`npm run build`로 TypeScript와 배포 빌드를 검사합니다. `node verify.mjs`는 로컬 서버 실행 중 브라우저 흐름을 검증합니다. 브라우저 최초 설치는 `npx playwright install chromium`입니다.
