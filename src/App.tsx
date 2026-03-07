import { personalInfo, projects, stack } from './data';
import './styles.css';

function App() {
  const [firstName, lastName] = personalInfo.name.split(' ');

  return (
    <div className="portfolio">
      <header className="header">
        <a href="#home" className="logo">
          KG©
        </a>

        <nav className="nav">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="contact-link">
          <a href="#contact">GET IN TOUCH —</a>
        </div>
      </header>

      <main className="hero" id="home">
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

          <div className="hero-actions">
            <a href="#projects" className="primary-btn">
              View Projects
            </a>
            <a href="#contact" className="secondary-btn">
              Contact
            </a>
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
        </div>
      </section>

      <section className="about-section" id="about">
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

        <div className="work-list">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="work-item"
              aria-label={`Open ${project.title}`}
            >
              <div className="work-head">
                <div className="work-num">{project.id}</div>

                <div className="work-title-wrap">
                  <h2>{project.title}</h2>
                  <p className="work-type">{project.type}</p>
                </div>

                <div className="work-arrow">↗</div>
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

                <div className="work-links">
                  <span className="project-link">View Project</span>
                </div>
              </div>
            </a>
          ))}
        </div>
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