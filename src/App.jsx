import './style.css'

const trips = [
  {
    day: 'Day 1',
    city: 'Seoul to Taipei',
    date: '2026.06.12',
    title: 'Arrival and night market walk',
    details: ['Check in near Zhongshan', 'Dinner at Ningxia Night Market', 'Share first photos with friends'],
  },
  {
    day: 'Day 2',
    city: 'Taipei',
    date: '2026.06.13',
    title: 'Old streets and tea houses',
    details: ['Morning train to Jiufen', 'Tea house reservation', 'Sunset view from Keelung Mountain'],
  },
  {
    day: 'Day 3',
    city: 'Taipei',
    date: '2026.06.14',
    title: 'Museum, cafe, and local notes',
    details: ['National Palace Museum', 'Cafe list review', 'Write cost summary for sharing'],
  },
  {
    day: 'Day 4',
    city: 'Taipei to Seoul',
    date: '2026.06.15',
    title: 'Last walk and departure',
    details: ['Morning souvenir stop', 'Pack travel receipts', 'Evening flight back to Seoul'],
  },
]

const notes = [
  { label: 'Budget', value: '₩620,000' },
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
              여행 날짜별 일정, 예산, 장소 메모를 한 화면에서 정리하고 공유할 수 있는 여행 블로그.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#schedule">일정 보기</a>
              <a className="secondary-action" href="#share">공유 노트</a>
            </div>
          </div>

          <aside className="trip-panel" aria-label="Trip summary">
            <span className="panel-label">Next Trip</span>
            <h2>Taipei Weekend</h2>
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
              <div>
                <p className="city">{trip.city}</p>
                <h3>{trip.title}</h3>
                <ul>
                  {trip.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
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
            일정을 수정한 뒤 `npm run deploy`를 실행하면 정적 파일이 만들어지고
            GitHub Pages에 올릴 준비가 됩니다.
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
