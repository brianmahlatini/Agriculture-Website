// Impact cards render MongoDB-backed stories, keeping flexible content separate from operations data.
import type { ImpactStory } from '../types';

type ImpactSectionProps = {
  stories: ImpactStory[];
};

export function ImpactSection({ stories }: ImpactSectionProps) {
  return (
    <section className="section impact" id="impact">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Measured impact</p>
          <h2>Growth that earns its license to operate.</h2>
        </div>
        <p>MongoDB stores flexible impact stories, regional narratives, and inquiry content.</p>
      </div>
      <div className="impact-grid">
        {stories.map((story) => (
          <article className="impact-card" key={story._id}>
            <span>{story.category}</span>
            <strong>{story.metric}</strong>
            <h3>{story.title}</h3>
            <p>{story.summary}</p>
            <small>{story.region}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

