// Platform messaging is kept in its own component to avoid mixing static content with live data views.
import { CheckCircle2 } from 'lucide-react';
import { capabilities } from '../data/capabilities';
import { media } from '../data/media';

export function PlatformSection() {
  return (
    <section className="section split" id="platform">
      <div className="section-copy">
        <p className="eyebrow">Enterprise farm intelligence</p>
        <h2>One operating layer from soil signal to boardroom forecast.</h2>
        <p>
          Agricore brings agronomy teams, logistics partners, exporters, and finance leaders into a
          single view of crop performance, water demand, compliance readiness, and market
          commitments.
        </p>
        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article className="capability" key={capability.title}>
              <CheckCircle2 size={18} />
              <div>
                <strong>{capability.title}</strong>
                <span>{capability.text}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="image-stack">
        <img src={media.fieldRows} alt="Aerial crop rows on a commercial farm" />
        <img src={media.greenhouse} alt="Fresh produce and controlled agriculture work" />
      </div>
    </section>
  );
}

