# 분석 설계 / 외부 서비스 연결

## 현재 상태

운영 GA4 스크립트는 로드하지 않습니다. 측정 ID가 없으면 개발 콘솔에 개인 정보 없는 이벤트만 표시합니다. 데모 신청은 generate_lead를 발생시키지 않습니다. 이메일은 React 상태에서만 다루며, 데모에서 네트워크 전송·스토리지 저장을 하지 않습니다.

## 이벤트

| 이벤트 | 발생 조건 | 주요 정보 |
|---|---|---|
| category_impression | 카드의 45% 이상이 뷰포트에 보일 때 | category_id |
| category_click | 카드 클릭 | category_id |
| detail_view | 해시 경로를 통해 상세 열기 | category_id |
| detail_slide_view | 상세 슬라이드 표시 | category_id, slide_index(1~4) |
| lead_form_open | 신청 화면 열기 | button_location, 선택값이 있으면 category_id/resource_id |
| resource_select | 자료 선택 또는 상세에서 미리 선택 | category_id, resource_id |
| lead_submit_attempt | 검증된 신청 제출 | category_id, resource_id |
| generate_lead | 실제 API 저장 확인 성공 | category_id, resource_id |
| lead_submit_error | API 실패 또는 저장 미확인 | category_id, resource_id |

모든 이벤트에 is_demo 추가. 버튼 위치는 header, hero, explore_bottom, category_detail, footer. 노출 중복은 현재 페이지 세션의 메모리 Set으로 억제하며 새로고침하면 초기화됩니다. 필터 재선택만으로 노출을 중복 기록하지 않습니다.

신청 이탈은 lead_form_open → resource_select → lead_submit_attempt → generate_lead 퍼널로 분석합니다. 자료 ID와 카테고리 ID는 현재 동일합니다. 클릭 수뿐 아니라 실제 노출 대비 클릭률, 상세 방문 대비 신청률도 비교합니다.

## GA4 연결

현재 track()은 전역 gtag가 있고 brand.ga4Id가 설정된 경우에만 전달합니다. 측정 ID 설정만으로 스크립트를 자동 로드하지 않습니다. 정책 확정 후 GA4 초기화를 별도로 구현해야 합니다.

- GA4 강화 측정의 form interactions는 비활성화하고 수동 이벤트만 사용하도록 권장합니다. 이메일 입력값이 자동 측정되지 않는지 네트워크 검증이 필요합니다.
- page_location/page_referrer는 질의 문자열을 무조건 전달하지 말고 허용된 정보만 담도록 초기화 시 명시적으로 정리합니다. 최초 자동 page_view도 정리 전에 발생하지 않게 합니다.
- custom dimensions: category_id, resource_id, button_location, is_demo. slide_index는 수치 정보로 사용.
- DebugView에서 중복·개인 정보·성공 조건을 확인한 뒤 generate_lead를 주요 이벤트로 지정.
- Looker Studio에서 카테고리 관심도, 자료집 신청, 유입 캠페인과 전환을 구성.

## UTM

현재 UTM을 읽거나 저장하지 않습니다. 계정 및 동의 정책이 확정된 뒤 utm_source, utm_medium, utm_campaign, utm_content, utm_term의 허용 목록만 처리하는 연결부를 추가해야 합니다. 값은 운영자가 사전 승인한 캠페인 식별자와 매칭하고 임의 문자열·이메일·전화번호를 포함하지 않도록 합니다. 브라우저 저장 기간과 동의 조건, GA4 세션 귀속, 서버 리드 연결 방식을 정해야 합니다. 전체 URL과 임의 질의 문자열을 서버 신청 데이터에 넣지 않습니다.

## 이메일 API 계약

POST JSON: email, resource_id, consent. 서버에서 모두 재검증합니다. 성공 응답의 saved:true는 저장 완료를 의미하며 발송 완료를 의미하지 않습니다. 실제 발송 추적은 서버 서비스에서 관리하세요. API 예외 원문·서버 메시지·이메일은 분석 이벤트에 포함하지 않습니다. 중복 정책과 요청 제한은 서버가 최종 보장해야 합니다.
`middle_banner`는 리디자인에 추가된 중간 자료집 배너 버튼 위치입니다. 상단 빠른 카테고리와 사례 카드도 기존 category_click/detail_view 흐름을 사용합니다.
