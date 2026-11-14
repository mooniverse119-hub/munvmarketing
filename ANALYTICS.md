# 문캣 GA4 이벤트

측정 ID: G-MREJ124JGZ. GA4는 src/services.ts의 initAnalytics()에서 1회 직접 초기화합니다. GTM에 같은 GA4 태그를 추가하면 중복될 수 있으므로 추가하지 않습니다.

| 행동 | 이벤트 | 구분 |
|---|---|---|
| 콘텐츠 카드가 보임 | category_impression | category_id, content_name, content_group |
| 콘텐츠 카드 클릭 | category_click | category_id, content_name, content_group, button_location=content_grid |
| 사례 소개에서 콘텐츠 열기 | category_click | button_location=persona |
| 콘텐츠 상세 열람 | detail_view | category_id, content_name |
| 상단 인스타그램 바로가기 | instagram_click | button_location=header |
| 자료집 신청창 열기 | lead_form_open | button_location |
| 자료집 선택 | resource_select | resource_id, content_name |
| 신청 저장 성공 | generate_lead | resource_id, category_id, content_name |

콘텐츠별 클릭 비교: GA4 탐색에서 행=콘텐츠 이름, 값=이벤트 수/총 사용자, 필터 이벤트 이름 정확히 category_click. 카드만 비교하려면 클릭 위치 정확히 content_grid 추가. 새로고침이나 주소로 상세에 직접 들어가면 detail_view만 발생하며 클릭으로 세지 않습니다.

맞춤 측정기준: category_id(콘텐츠 종류), resource_id(신청 자료집), content_name(콘텐츠 이름), content_group(콘텐츠 분야), button_location(클릭 위치). generate_lead만 사이트의 주요 전환으로 사용합니다. content_status는 existing/upcoming 구분값입니다.

검증: ?ga_debug=1로 사이트를 열고 DebugView에서 각 카드를 클릭해 category_click의 콘텐츠 이름을 확인합니다. 검증 클릭도 테스트 데이터로 수집됩니다. 일반 보고서는 처리 시간이 필요합니다.

이벤트에는 이메일/자유 입력/신청 의견을 보내지 않습니다. 페이지 URL의 검색 문자열·해시는 제외하고 리퍼러는 출처 도메인만 보냅니다. GA4 양식 상호작용 자동 측정은 끄고 실제 API saved:true 응답에서만 generate_lead를 보냅니다. 신청 API와 개인정보 동의 절차는 기존 동작을 유지합니다.
