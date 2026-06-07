// User dashboard provides self-service booking creation, tracking, and farm advisory guidance.
import { CalendarCheck, ClipboardCheck, Droplets, Leaf, MapPinned, XCircle } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { cancelBooking, createBooking, getMyBookings } from '../api';
import type { AuthUser, Booking } from '../types';
import { formatNumber } from '../utils/formatters';

const serviceCards = [
  {
    icon: MapPinned,
    title: 'Precision farm assessment',
    text: 'Map farm blocks, operating constraints, and near-term production opportunities.'
  },
  {
    icon: Droplets,
    title: 'Irrigation optimization',
    text: 'Review water efficiency, scheduling, and risk areas before yield is affected.'
  },
  {
    icon: Leaf,
    title: 'Sustainability reporting session',
    text: 'Prepare water, soil, and regenerative indicators for commercial reporting.'
  }
];

type UserDashboardProps = {
  user: AuthUser;
};

export function UserDashboard({ user }: UserDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const nextBooking = useMemo(
    () =>
      bookings
        .filter((booking) => !['COMPLETED', 'CANCELLED'].includes(booking.status))
        .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())[0],
    [bookings]
  );

  async function refreshBookings() {
    const response = await getMyBookings();
    setBookings(response.bookings);
  }

  useEffect(() => {
    void refreshBookings().catch(() => setMessage('Unable to load bookings'));
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const form = new FormData(event.currentTarget);

    try {
      await createBooking({
        service: String(form.get('service')),
        farmName: String(form.get('farmName')),
        region: String(form.get('region')),
        hectares: Number(form.get('hectares')),
        preferredDate: String(form.get('preferredDate')),
        notes: String(form.get('notes'))
      });
      event.currentTarget.reset();
      setMessage('Booking request submitted.');
      await refreshBookings();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Booking failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel(booking: Booking) {
    const reason = window.prompt('Cancellation reason');

    if (!reason) {
      return;
    }

    await cancelBooking(booking._id, reason);
    setMessage('Booking cancelled.');
    await refreshBookings();
  }

  return (
    <section className="workspace-grid">
      <div className="workspace-panel">
        <p className="eyebrow">User panel</p>
        <h3>Welcome, {user.fullName}</h3>
        <p>
          Manage Agricore consultations, field assessments, advisory visits, and service requests
          for {user.company}.
        </p>
        <div className="workspace-stats">
          <span>
            <strong>{bookings.length}</strong>
            Bookings
          </span>
          <span>
            <strong>{bookings.filter((booking) => booking.status === 'CONFIRMED').length}</strong>
            Confirmed
          </span>
          <span>
            <strong>{formatNumber(bookings.reduce((sum, booking) => sum + Number(booking.hectares), 0))}</strong>
            Hectares
          </span>
        </div>
      </div>

      <div className="workspace-panel">
        <p className="eyebrow">Next action</p>
        <h3>{nextBooking ? nextBooking.service : 'No active booking yet'}</h3>
        <p>
          {nextBooking
            ? `${nextBooking.farmName} in ${nextBooking.region} is scheduled for ${new Date(
                nextBooking.preferredDate
              ).toLocaleDateString()} with status ${nextBooking.status}.`
            : 'Create a booking to start an Agricore assessment, irrigation review, or reporting session.'}
        </p>
        <div className="advisory-list">
          <span>
            <ClipboardCheck size={17} /> Keep farm block notes ready
          </span>
          <span>
            <Droplets size={17} /> Prepare irrigation records
          </span>
          <span>
            <Leaf size={17} /> Add sustainability goals in notes
          </span>
        </div>
      </div>

      <div className="workspace-panel wide-panel">
        <h3>Recommended Agricore services</h3>
        <div className="service-card-grid">
          {serviceCards.map((card) => {
            const Icon = card.icon;

            return (
              <article className="service-card" key={card.title}>
                <Icon size={22} />
                <strong>{card.title}</strong>
                <span>{card.text}</span>
              </article>
            );
          })}
        </div>
      </div>

      <form className="partner-form" onSubmit={handleCreate}>
        <label>
          Service
          <select name="service" required defaultValue="Precision farm assessment">
            <option>Precision farm assessment</option>
            <option>Irrigation optimization</option>
            <option>Crop forecast consultation</option>
            <option>Controlled environment planning</option>
            <option>Sustainability reporting session</option>
          </select>
        </label>
        <label>
          Farm name
          <input name="farmName" type="text" minLength={2} required />
        </label>
        <label>
          Region
          <input name="region" type="text" minLength={2} required />
        </label>
        <label>
          Hectares
          <input name="hectares" type="number" min={1} required />
        </label>
        <label>
          Preferred date
          <input name="preferredDate" type="date" required />
        </label>
        <label>
          Notes
          <textarea name="notes" rows={4} maxLength={1000} />
        </label>
        <button className="primary-button form-button" type="submit" disabled={busy}>
          <CalendarCheck size={18} /> {busy ? 'Submitting' : 'Request booking'}
        </button>
        {message && <p className="form-note success">{message}</p>}
      </form>

      <div className="workspace-panel">
        <h3>Booking lifecycle</h3>
        <div className="timeline-list">
          {['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </div>

      <div className="workspace-panel wide-panel">
        <h3>My bookings</h3>
        <div className="dashboard-table">
          <div className="dashboard-row dashboard-head">
            <span>Service</span>
            <span>Farm</span>
            <span>Date</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {bookings.map((booking) => (
            <div className="dashboard-row" key={booking._id}>
              <strong>{booking.service}</strong>
              <span>{booking.farmName}</span>
              <span>{new Date(booking.preferredDate).toLocaleDateString()}</span>
              <span className={`status-pill status-${booking.status.toLowerCase()}`}>{booking.status}</span>
              <button
                className="table-action"
                type="button"
                disabled={['COMPLETED', 'CANCELLED'].includes(booking.status)}
                onClick={() => void handleCancel(booking)}
              >
                <XCircle size={16} /> Cancel
              </button>
            </div>
          ))}
          {bookings.length === 0 && <p className="empty-state">No bookings yet.</p>}
        </div>
      </div>
    </section>
  );
}
