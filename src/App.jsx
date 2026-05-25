import './style.css'

const trips = [
  {
    day: 'Day 1',
    city: 'Seoul to Shanghai',
    date: '2026.06.12',
    title: '상해 도착',
    schedule: [
      { time: '07:01 - 01:40', plan: '공항버스', destination: '인천국제공항 2터미널', note: '올림픽선수촌 탑승' },
      { time: '11:10 - 01:15', plan: '비행', destination: '푸동국제공항 1터미널', note: '' },
      { time: '14:00 - 00:50', plan: '숙소 이동', destination: '상하이 센트럴 호텔', note: '택시' },
      { time: '14:50 - 00:10', plan: '체크인', note: '' },
      { time: '15:00 - 01:00', plan: '점심', destination: 'SMP몰', note: '点都德(白玉兰店)' },
      { time: '16:00 - 01:00', plan: '쇼핑', destination: 'SMP몰', note: '핸드크림' },
      { time: '17:00 - 01:30', plan: '숙소', note: '휴식' },
      { time: '18:30 - 02:30', plan: '관광', note: '와이탄 & 황푸강' },
      { time: '21:00 - 01:30', plan: '저녁', destination: '헌지우이치엔(광음광장점)', note: '' },
    ],
  },
  {
    day: 'Day 2',
    city: 'Shanghai',
    date: '2026.06.13',
    title: '쇼핑과 관광',
    schedule: [
      { time: '09:00 - 01:00', plan: '아침', destination: '산동잡곡전병', note: '' },
      { time: '10:00 - 00:30', plan: '카페', destination: 'CHAGEE', note: '' },
      { time: '10:30 - 01:30', plan: '숙소', note: '휴식 or 운동' },
      { time: '12:00 - 01:00', plan: '점심', destination: '홍쿠이지아', note: '' },
      { time: '13:00 - 01:00', plan: '카페', destination: '상하이 스타벅스 리저브', note: '' },
      { time: '14:00 - 01:30', plan: '쇼핑', destination: '따룬파마트', note: '大润发(平型关店)' },
      { time: '15:30 - 01:30', plan: '숙소', note: '휴식' },
      { time: '17:00 - 01:00', plan: '쇼핑', destination: '미니소랜드', note: '' },
      { time: '18:00 - 01:30', plan: '관광', destination: '예원', note: '' },
      { time: '19:30 - 01:00', plan: '저녁', destination: '상하이 그랜드마더', note: '' },
    ],
  },
  {
    day: 'Day 3',
    city: 'Shanghai',
    date: '2026.06.14',
    title: '관광과 쇼핑',
    schedule: [
      { time: '09:00 - 01:00', plan: '아침', note: '또우장 & 요우티아오' },
      { time: '10:00 - 01:00', plan: '숙소', note: '' },
      { time: '11:00 - 01:00', plan: '관광', destination: '우캉멘션', note: '' },
      { time: '12:00 - 01:00', plan: '점심', destination: '라오지스', note: '' },
      { time: '13:00 - 01:00', plan: '관광', destination: '신천지 임시정부', note: '' },
      { time: '14:00 - 02:00', plan: '쇼핑', destination: '티엔즈팡', note: '홀리랜드, 핸드크림' },
      { time: '16:00 - 01:30', plan: '숙소', note: '' },
      { time: '17:30 - 01:00', plan: '저녁', destination: '신세계백화점', note: '좌정우원(훠궈)' },
      { time: '18:30 - 02:00', plan: '쇼핑', destination: '신세계백화점', note: '' },
    ],
  },
  {
    day: 'Day 4',
    city: 'Shanghai to Seoul',
    date: '2026.06.15',
    title: '마지막 날, 서울로 이동',
    schedule: [
      { time: '09:00 - 01:00', plan: '아침', destination: '장씨네 게살국수', note: '' },
      { time: '10:00 - 01:00', plan: '쇼핑', destination: '미니소랜드', note: '' },
      { time: '11:00 - 00:10', plan: '숙소', destination: '상하이 센트럴 호텔', note: '체크아웃' },
      { time: '12:00 - 00:50', plan: '공항 이동', destination: '푸동국제공항 1터미널', note: '' },
      { time: '13:40 - 02:05', plan: '비행', destination: '인천국제공항 2터미널', note: '16:45분 도착' },
    ],
  },
]

const notes = [
  { label: 'Budget', value: '₩1,000,000' },
  { label: 'Travelers', value: '2 people' },
]

const calendarWeeks = [
  ['', '1', '2', '3', '4', '5', '6'],
  ['7', '8', '9', '10', '11', '12', '13'],
  ['14', '15', '16', '17', '18', '19', '20'],
  ['21', '22', '23', '24', '25', '26', '27'],
  ['28', '29', '30', '', '', '', ''],
]

const tripDates = ['12', '13', '14', '15']

function App() {
  return (
    <main className="app-shell">
      <section className="hero-section" aria-label="Travel overview">
        <nav className="topbar" aria-label="Primary navigation">
          <strong>Travel Log</strong>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trip planner and shareable blog</p>
            <h1>상해 여행 노트</h1>
            <p>
              여행 날짜별 일정, 예산, 숙소 메모를 한 화면에서 정리하고 공유할 수 있는 여행
              블로그입니다.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#schedule">일정 보기</a>
              <a className="secondary-action" href="#share">공유 노트</a>
            </div>
          </div>

          <aside className="trip-panel" aria-label="Trip summary">
            <span className="panel-label">Next Trip</span>
            <h2>Shanghai Weekend</h2>
            <p>June 12 - 15, 2026</p>
            <div className="metric-row">
              {notes.map((note) => (
                <div key={note.label}>
                  <span>{note.label}</span>
                  <strong>{note.value}</strong>
                </div>
              ))}
            </div>

            <div className="calendar-card" aria-label="June 2026 travel calendar">
              <div className="calendar-head">
                <strong>June 2026</strong>
                <span>4-day route</span>
              </div>
              <div className="calendar-weekdays" aria-hidden="true">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="calendar-grid">
                {calendarWeeks.flat().map((date, index) => (
                  <span
                    className={tripDates.includes(date) ? 'selected-date' : ''}
                    key={`${date || 'empty'}-${index}`}
                  >
                    {date}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="content-section" id="schedule">
        <div className="section-heading">
          <p className="eyebrow">여행 일정</p>
          <h2>일일 여행 계획</h2>
        </div>

        <div className="timeline">
          {trips.map((trip) => (
            <article className="timeline-card" key={trip.day}>
              <div className="timeline-meta">
                <span>{trip.day}</span>
                <strong>{trip.date}</strong>
              </div>
              <div className="timeline-content">
                <p className="city">{trip.city}</p>
                <h3>{trip.title}</h3>
                <div className="schedule-table-wrap">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th scope="col">시작시간</th>
                        <th scope="col">예상소요시간</th>
                        <th scope="col">일정</th>
                        <th scope="col">목적지</th>
                        <th scope="col">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trip.schedule.map((item) => {
                        const [startTime, endTime = ''] = item.time.split(' - ')

                        return (
                          <tr key={`${trip.day}-${item.time}-${item.plan}`}>
                            <td data-label="시작시간">{startTime}</td>
                            <td data-label="예상소요시간">{endTime}</td>
                            <td data-label="일정">{item.plan}</td>
                            <td data-label="목적지">{item.destination}</td>
                            <td data-label="비고">{item.note}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="share-section" id="share">
        <div>
          <p className="eyebrow">Share</p>
          <h2>Ready for GitHub Pages</h2>
          <p>
            일정을 수정하고 `npm run deploy`를 실행하면 정적 파일을 만들고 GitHub Pages에 올릴
            준비가 됩니다.
          </p>
        </div>
        <div className="share-checklist">
          <span>Route notes</span>
          <span>Cost summary</span>
          <span>Photo captions</span>
        </div>
      </section>
    </main>
  )
}

export default App


/*
1. 상하이 센트럴 호텔, 숙소
2. SMP몰 (헤이티, 점도덕), 쇼핑
3. 미니소랜드, 쇼핑
4. 헌지우이치엔(광음광장점), 식당
5. 와이탄, 명소
6. 황푸강 유람선 선착장, 명소
7. 산동잡곡전병, 식당
8. CHAGEE, 카페
9. 홍쿠이지아, 식당
10. 상하이 스타벅스 리저브, 카페
11. 따룬파마트, 마트
12. 예원, 명소
13. 상하이 그랜드마더, 식당
14. 우캉멘션, 명소
15. 라오지스, 식당
16. 신천지 임시정부, 명소
17. 티엔즈팡, 쇼핑거리
18. 신세계백화점 (헤이티, 좌정우원), 복합몰
19. 장씨네 게살국수, 식당
20. 푸동국제공항 1터미널, 공항
*/