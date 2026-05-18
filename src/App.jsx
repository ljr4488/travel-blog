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
]

const notes = [
  { label: 'Budget', value: '₩620,000' },
  { label: 'Travelers', value: '3 people' },
  { label: 'Shared posts', value: '8 drafts' },
]

function App() {
  return (
    <main className="app-shell">
      <section className="hero-section" aria-label="Travel overview">
        <nav className="topbar" aria-label="Primary navigation">
          <strong>Travel Log</strong>
          <div>
            <a href="#schedule">Schedule</a>
            <a href="#share">Share</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trip planner and shareable blog</p>
            <h1>Plan the route, keep the notes, share the journey.</h1>
            <p>
              여행 날짜별 일정, 예산, 장소 메모를 한 화면에서 정리하고 GitHub Pages로
              친구들에게 공유할 수 있는 React 여행 블로그입니다.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#schedule">View itinerary</a>
              <a className="secondary-action" href="#share">Sharing notes</a>
            </div>
          </div>

          <aside className="trip-panel" aria-label="Trip summary">
            <span className="panel-label">Next Trip</span>
            <h2>Taipei Weekend</h2>
            <p>June 12 - 14, 2026</p>
            <div className="metric-row">
              {notes.map((note) => (
                <div key={note.label}>
                  <span>{note.label}</span>
                  <strong>{note.value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="content-section" id="schedule">
        <div className="section-heading">
          <p className="eyebrow">Itinerary</p>
          <h2>Daily travel plan</h2>
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
