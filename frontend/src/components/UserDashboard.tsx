// User dashboard provides self-service booking creation, tracking, and cancellation.
import { CalendarCheck, XCircle } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { cancelBooking, createBooking, getMyBookings } from '../api';
import type { AuthUser, Booking } from '../types';

type UserDashboardProps = {
  user: AuthUser;
};

export function UserDashboard({ user }: UserDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

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
          Manage Agricore consultation bookings, field assessments, advisory visits, and service
          requests for {user.company}.
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
            <strong>{bookings.filter((booking) => booking.status === 'CANCELLED').length}</strong>
            Cancelled
          </span>
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
        </div>
      </div>
    </section>
  );
}

