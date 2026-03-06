import { personalInfo, projects, stack } from './data';
import './styles.css';

function App() {
  const [firstName, lastName] = personalInfo.name.split(' ');

  return (
    <div className="portfolio">
      <nav className="header">
        <div className="logo">KG©</div>
        <div className="contact-link">
          <a href={`mailto:${personalInfo.email}`}>GET IN TOUCH —</a>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-top">
          <span className="availability">● AVAILABLE FOR WORK</span>
          <span className="location">{personalInfo.location}</span>
        </div>

        <h1 className="main-title">
          {firstName}
          <br />
          <span className="indent">{lastName}</span>
        </h1>

        <div className="hero-footer">
          <div className="hero-copy">
            <p className="role">{personalInfo.role}</p>
            <p className="statement">{personalInfo.statement}</p>
          </div>

          <div className="socials">
            <a href={personalInfo.github} target="_blank" rel="noreferrer">
              GH
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
              LI
            </a>
            <a href={`mailto:${personalInfo.email}`}>MAIL</a>
          </div>
        </div>
      </main>

      <section className="image-section">
        <div className="profile-wrapper">
          <img
            src={personalInfo.image}
            alt="Kristijan Gega"
            className="main-img"
          />
          <div className="image-badge">
            <span>WEB DEVELOPER</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-label">ABOUT</div>

        <div className="about-grid">
          <p className="about-lead">
            I am a Computer Science student at VUB focused on building modern,
            responsive and practical web solutions.
          </p>

          <p className="about-text">
            My main focus is frontend-oriented web development with React,
            TypeScript, JavaScript, HTML and CSS, while also working with SQL,
            MySQL, Oracle and C#. I am currently building real-world projects,
            improving my portfolio and growing toward freelance and junior
            developer opportunities.
          </p>
        </div>
      </section>

      <section className="work-section" id="projects">
        <div className="section-label">SELECTED WORK</div>

        {projects.map((project) => (
          <article key={project.id} className="work-item">
            <div className="work-head">
              <div className="work-num">{project.id}</div>

              <div className="work-title-wrap">
                <h2>{project.title}</h2>
                <p className="work-type">{project.type}</p>
              </div>

              <a
                href={project.link}
                className="work-arrow"
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.title}`}
              >
                ↗
              </a>
            </div>

            <div className="work-body">
              <p className="work-desc">{project.desc}</p>

              <div className="work-tech">
                {project.tech.map((item) => (
                  <span key={item} className="tech-pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="stack-section">
        <div className="section-label">STACK</div>
        <div className="stack-scroll">
          {[...stack, ...stack].map((item, index) => (
            <span key={`${item}-${index}`} className="stack-item">
              {item} —
            </span>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-label">CONTACT</div>

        <div className="contact-grid">
          <div>
            <h3>Let&apos;s build something useful.</h3>
            <p>
              Open to freelance work, collaborations and junior opportunities.
            </p>
          </div>

          <div className="contact-links">
            <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
            <a href={personalInfo.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>DESIGNED &amp; CODED BY KRISTIJAN GEGA / 2026</p>
      </footer>
    </div>
  );
}

export default App;