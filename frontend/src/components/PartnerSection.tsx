// The partnership form is isolated because it owns submission state and validation feedback.
import { ArrowUpRight, Factory, Leaf, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { submitLead } from '../api';

const assuranceItems = [
  { icon: ShieldCheck, text: 'Governance-ready data model' },
  { icon: Factory, text: 'Built for multi-site operations' },
  { icon: Leaf, text: 'Sustainability indicators included' }
];

export function PartnerSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus('loading');
    const formData = new FormData(event.currentTarget);

    try {
      await submitLead(Object.fromEntries(formData));
      event.currentTarget.reset();
      setFormStatus('success');
    } catch {
      setFormStatus('error');
    }
  }

  return (
    <section className="section partner" id="partner">
      <div className="partner-copy">
        <p className="eyebrow">Enterprise partnership</p>
        <h2>Build the next Agricore production network.</h2>
        <p>
          Start a conversation for commercial farming partnerships, sourcing programs,
          controlled-environment expansion, or sustainability reporting infrastructure.
        </p>
        <div className="assurance-list">
          {assuranceItems.map((item) => {
            const Icon = item.icon;

            return (
              <span key={item.text}>
                <Icon size={18} /> {item.text}
              </span>
            );
          })}
        </div>
      </div>

      <form className="partner-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" minLength={2} required />
        </label>
        <label>
          Work email
          <input name="email" type="email" required />
        </label>
        <label>
          Company
          <input name="company" type="text" minLength={2} required />
        </label>
        <label>
          Acreage or scope
          <input name="acreage" type="text" placeholder="Example: 5,000 ha" required />
        </label>
        <label>
          Interest
          <select name="interest" required defaultValue="Supply partnership">
            <option>Supply partnership</option>
            <option>Farm management</option>
            <option>Controlled environment</option>
            <option>Sustainability reporting</option>
          </select>
        </label>
        <label>
          Message
          <textarea name="message" minLength={10} rows={5} required />
        </label>
        <button className="primary-button form-button" type="submit" disabled={formStatus === 'loading'}>
          <span>{formStatus === 'loading' ? 'Sending' : 'Send request'}</span>
          <ArrowUpRight size={18} />
        </button>
        {formStatus === 'success' && <p className="form-note success">Request received.</p>}
        {formStatus === 'error' && <p className="form-note error">Submission failed. Try again.</p>}
      </form>
    </section>
  );
}

