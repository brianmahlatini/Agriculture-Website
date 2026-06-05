// This visual band gives the page a strong product narrative between data-heavy sections.
import { media } from '../data/media';

export function MediaBand() {
  return (
    <section className="section media-band">
      <img src={media.harvest} alt="Harvest field at sunrise" />
      <div>
        <p className="eyebrow">From farm gate to global demand</p>
        <h2>Built for scale, traceability, and decision velocity.</h2>
        <p>
          The Agricore model gives producers and enterprise buyers a dependable operating rhythm:
          better sensing, sharper planning, cleaner handoffs, and measurable outcomes.
        </p>
      </div>
    </section>
  );
}

