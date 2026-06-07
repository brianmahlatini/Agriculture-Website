// Admin dashboard gives Agricore leaders full-system visibility and booking control.
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAdminBookings, getAdminOverview, updateAdminBookingStatus } from '../api';
import type { AdminOverview, AuthUser, Booking, BookingStatus } from '../types';
import { formatNumber } from '../utils/formatters';

const statuses: BookingStatus[] = ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

type AdminDashboardProps = {
  user: AuthUser;
};

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');

  async function refresh() {
    setMessage('');
    const [overviewResponse, bookingsResponse] = await Promise.all([getAdminOverview(), getAdminBookings()]);
    setOverview(overviewResponse);
    setBookings(bookingsResponse.bookings);
  }

  useEffect(() => {
    void refresh().catch((error) =>
      setMessage(error instanceof Error ? error.message : 'Unable to load admin data')
    );
  }, []);

  async function changeStatus(booking: Booking, status: BookingStatus) {
    await updateAdminBookingStatus(booking._id, status, `Updated by ${user.username}`);
    setMessage(`Booking marked ${status}.`);
    await refresh();
  }

  return (
    <section className="workspace-grid admin-grid">
      <div className="workspace-panel wide-panel command-panel">
        <p className="eyebrow">Admin dashboard</p>
        <h3>System command center</h3>
        <p>
          Admins can see users, leads, bookings, operating metrics, status breakdowns, and control
          booking workflow states across the full Agricore platform.
        </p>
        <button className="secondary-dark-button" type="button" onClick={() => void refresh()}>
          <RefreshCw size={17} /> Refresh data
        </button>
      </div>

      <div className="admin-metrics">
        {[
          ['Users', overview?.metrics.users ?? 0],
          ['Leads', overview?.metrics.leads ?? 0],
          ['Bookings', overview?.metrics.bookings ?? 0],
          ['Active', overview?.metrics.activeBookings ?? 0],
          ['Hectares', overview?.metrics.managedHectares ?? 0],
          ['Projected tonnes', overview?.metrics.projectedYield ?? 0]
        ].map(([label, value]) => (
          <article className="admin-metric" key={label}>
            <ShieldCheck size={19} />
            <strong>{formatNumber(value)}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>

      {!overview && (
        <div className="workspace-panel wide-panel">
          <p className="form-note">{message || 'Loading admin command center...'}</p>
        </div>
      )}

      <div className="workspace-panel wide-panel">
        <h3>All bookings</h3>
        {message && <p className="form-note success">{message}</p>}
        <div className="dashboard-table">
          <div className="dashboard-row admin-booking-row dashboard-head">
            <span>Client</span>
            <span>Service</span>
            <span>Farm</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {bookings.map((booking) => (
            <div className="dashboard-row admin-booking-row" key={booking._id}>
              <strong>{booking.user?.fullName ?? 'Unknown user'}</strong>
              <span>{booking.service}</span>
              <span>{booking.farmName}</span>
              <span>{new Date(booking.preferredDate).toLocaleDateString()}</span>
              <select
                value={booking.status}
                onChange={(event) => void changeStatus(booking, event.target.value as BookingStatus)}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="workspace-panel">
        <h3>Recent leads</h3>
        <div className="compact-list">
          {(overview?.recentLeads ?? []).map((lead) => (
            <article key={lead._id}>
              <strong>{lead.company}</strong>
              <span>{lead.name} - {lead.interest}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="workspace-panel">
        <h3>Newest users</h3>
        <div className="compact-list">
          {(overview?.users ?? []).map((account) => (
            <article key={account.id}>
              <strong>{account.fullName}</strong>
              <span>{account.role} - {account.email}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
