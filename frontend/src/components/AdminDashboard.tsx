// Admin dashboard gives Agricore leaders full-system visibility and controlled user operations.
import { RefreshCw, ShieldCheck, Trash2, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  deleteAdminUser,
  getAdminBookings,
  getAdminOverview,
  updateAdminBookingStatus,
  updateAdminUser
} from '../api';
import type { AdminOverview, AuthUser, Booking, BookingStatus, Role } from '../types';
import { formatNumber } from '../utils/formatters';

const statuses: BookingStatus[] = ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const roles: Role[] = ['ADMIN', 'USER'];

type AdminDashboardProps = {
  user: AuthUser;
};

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');

  const bookingStatusMap = useMemo(() => {
    const counts = new Map<BookingStatus, number>();
    overview?.statusBreakdown.forEach((item) => counts.set(item._id, item.count));
    return counts;
  }, [overview]);

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

  async function changeUserRole(account: AuthUser, role: Role) {
    await updateAdminUser(account.id, { role });
    setMessage(`${account.fullName} is now ${role}.`);
    await refresh();
  }

  async function changeUserStatus(account: AuthUser, status: AuthUser['status']) {
    await updateAdminUser(account.id, { status });
    setMessage(`${account.fullName} marked ${status}.`);
    await refresh();
  }

  async function removeUser(account: AuthUser) {
    if (!window.confirm(`Delete ${account.fullName} and their bookings?`)) {
      return;
    }

    await deleteAdminUser(account.id);
    setMessage(`${account.fullName} deleted.`);
    await refresh();
  }

  return (
    <section className="workspace-grid admin-grid">
      <div className="workspace-panel wide-panel command-panel">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h3>System command center</h3>
          <p>
            Control user access, booking workflows, lead visibility, and farm operating signals
            from one Agricore management workspace.
          </p>
        </div>
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

      <div className="workspace-panel">
        <h3>Booking pipeline</h3>
        <div className="pipeline-list">
          {statuses.map((status) => (
            <article key={status}>
              <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span>
              <strong>{bookingStatusMap.get(status) ?? 0}</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="workspace-panel">
        <h3>Operations watch</h3>
        <div className="compact-list">
          {(overview?.operations.sites ?? []).slice(0, 4).map((site) => (
            <article key={site.id}>
              <strong>{site.name}</strong>
              <span>
                {site.region} - {formatNumber(site.hectares)} ha - {Number(site.water_efficiency).toFixed(1)}% water efficiency
              </span>
            </article>
          ))}
        </div>
      </div>

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
          {bookings.length === 0 && <p className="empty-state">No bookings yet.</p>}
        </div>
      </div>

      <div className="workspace-panel wide-panel">
        <h3>User access control</h3>
        <div className="dashboard-table">
          <div className="dashboard-row user-admin-row dashboard-head">
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {(overview?.users ?? []).map((account) => (
            <div className="dashboard-row user-admin-row" key={account.id}>
              <strong>
                <UsersRound size={16} /> {account.fullName}
              </strong>
              <span>{account.email}</span>
              <select value={account.role} onChange={(event) => void changeUserRole(account, event.target.value as Role)}>
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
              <select
                value={account.status}
                onChange={(event) => void changeUserStatus(account, event.target.value as AuthUser['status'])}
              >
                <option>ACTIVE</option>
                <option>SUSPENDED</option>
              </select>
              <button
                className="table-action danger-action"
                type="button"
                disabled={account.id === user.id}
                onClick={() => void removeUser(account)}
              >
                <Trash2 size={16} /> Delete
              </button>
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
              <span>
                {lead.name} - {lead.interest} - {lead.email}
              </span>
            </article>
          ))}
          {(overview?.recentLeads ?? []).length === 0 && <p className="empty-state">No leads yet.</p>}
        </div>
      </div>

      <div className="workspace-panel">
        <h3>Crop confidence</h3>
        <div className="compact-list">
          {(overview?.operations.forecasts ?? []).map((forecast) => (
            <article key={forecast.id}>
              <strong>{forecast.crop}</strong>
              <span>
                {formatNumber(forecast.projected_yield_tons)}t - {Number(forecast.confidence).toFixed(1)}% confidence
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
