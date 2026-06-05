// The hero is isolated because it carries media, brand positioning, and primary conversion CTAs.
import { Activity, ArrowUpRight } from 'lucide-react';
import { media } from '../data/media';

export function Hero() {
  return (
    <section className="hero" aria-label="Agricore enterprise agriculture">
      <video className="hero-video" autoPlay muted loop playsInline poster={media.heroPoster}>
        <source src={media.heroVideo} type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow">Precision agriculture for resilient supply chains</p>
        <h1>Agricore</h1>
        <p className="hero-copy">
          A leading agriculture company uniting commercial farming, controlled-environment
          production, field intelligence, and sustainable sourcing across high-value crop networks.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#operations">
            <span>View operating system</span>
            <Activity size={18} />
          </a>
          <a className="secondary-button" href="#impact">
            <span>See impact</span>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <div className="hero-panel" aria-label="Live operating signal">
        <span>2026 production signal</span>
        <strong>High-confidence harvest pipeline</strong>
        <small>PostgreSQL operational data with MongoDB content intelligence</small>
      </div>
    </section>
  );
}

