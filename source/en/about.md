---
---

<div class="about-hero">
  <div class="about-avatar">
    <div class="avatar-ring" />
    <div class="avatar-inner">Z</div>
  </div>
  <h1 class="about-name">Xiaozhou</h1>
  <p class="about-role">Frontend Engineer · Workflow System Architecture</p>
</div>

<div class="about-section">
  <h2>👋 Hello</h2>
  <p>A Web frontend developer focused on <strong>workflow systems</strong> and <strong>frontend engineering</strong>.</p>
  <p>Passionate about solving real problems with code. I believe technology can make work more efficient.</p>
</div>

<div class="about-section">
  <h2>💻 Tech Stack</h2>
  <div class="tech-tags">
    <span class="tech-tag primary">Vue 3</span>
    <span class="tech-tag">TypeScript</span>
    <span class="tech-tag">Vite</span>
    <span class="tech-tag">Element Plus</span>
    <span class="tech-tag">Pinia</span>
    <span class="tech-tag">Node.js</span>
    <span class="tech-tag">Docker</span>
    <span class="tech-tag">Git</span>
  </div>
</div>

<div class="about-section">
  <h2>🚀 Projects</h2>
  <div class="project-cards">
    <div class="project-card">
      <div class="project-icon">🚗</div>
      <h3>oneLineCar Workflow</h3>
      <p>Core developer of workflow management platform, vehicle search, offline reconnection, million-row Excel export</p>
    </div>
    <div class="project-card">
      <div class="project-icon">🏢</div>
      <h3>Bureau OA</h3>
      <p>4 sub-repositories, 2,000+ commits OA workflow system</p>
    </div>
    <div class="project-card">
      <div class="project-icon">🏗️</div>
      <h3>Smart Building</h3>
      <p>IoT alerts, video surveillance, GIS dashboard visualization</p>
    </div>
    <div class="project-card">
      <div class="project-icon">🛒</div>
      <h3>Retail Platform</h3>
      <p>Retail/Operations/Supplier triple-platform architecture</p>
    </div>
  </div>
</div>

<div class="about-section">
  <h2>📊 Git Contributions</h2>
  <GitStats />
</div>

<div class="about-section">
  <h2>📮 Contact</h2>
  <div class="contact-links">
    <a href="https://github.com/zhou0928" class="contact-link" target="_blank">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      GitHub
    </a>
    <a href="https://000902.icu/" class="contact-link" target="_blank">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      Website
    </a>
  </div>
</div>

<style>
.about-hero {
  text-align: center;
  padding: 3rem 0 2rem;
}

.about-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--blog-accent), var(--blog-accent-2), var(--blog-accent));
  animation: rotateGlow 3s linear infinite;
}

.avatar-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--vp-c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 800;
  color: var(--blog-accent);
}

@keyframes rotateGlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.about-name {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--blog-gradient-from), var(--blog-accent), var(--blog-accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-role {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
}

.about-section {
  max-width: 780px;
  margin: 0 auto 3rem;
}

.about-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
  background: linear-gradient(135deg, var(--blog-gradient-from), var(--blog-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-section p {
  color: var(--vp-c-text-2);
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--blog-card-border);
  background: var(--blog-tag-bg);
  color: var(--vp-c-text-2);
  transition: all 0.3s;
}

.tech-tag:hover {
  border-color: var(--blog-card-border-hover);
  color: var(--blog-accent);
  transform: translateY(-2px);
}

.tech-tag.primary {
  border-color: var(--blog-accent);
  background: var(--blog-accent-soft);
  color: var(--blog-accent);
}

.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.project-card {
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--blog-card-border);
  background: var(--blog-card-bg);
  transition: all 0.3s;
}

.project-card:hover {
  border-color: var(--blog-card-border-hover);
  transform: translateY(-3px);
  box-shadow: 0 0 20px var(--blog-accent-glow);
}

.project-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.project-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.project-card p {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}

.contact-links {
  display: flex;
  gap: 1rem;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--blog-card-border);
  background: var(--blog-tag-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.contact-link:hover {
  border-color: var(--blog-card-border-hover);
  background: var(--blog-accent-soft);
  color: var(--blog-accent);
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .about-name { font-size: 2rem; }
  .project-cards { grid-template-columns: 1fr; }
  .contact-links { flex-direction: column; }
}
</style>
