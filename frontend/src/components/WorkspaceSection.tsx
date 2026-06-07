// Workspace section switches between admin command center and user self-service panel.
import { LogOut } from 'lucide-react';
import type { AuthUser } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';

type WorkspaceSectionProps = {
  user: AuthUser;
  onLogout: () => void;
};

export function WorkspaceSection({ user, onLogout }: WorkspaceSectionProps) {
  return (
    <section className="section workspace-section" id="workspace">
      <div className="workspace-header">
        <div>
          <p className="eyebrow">Signed in as {user.role}</p>
          <h2>{user.role === 'ADMIN' ? 'Admin control room' : 'User booking workspace'}</h2>
        </div>
        <button className="secondary-dark-button" type="button" onClick={onLogout}>
          <LogOut size={17} /> Logout
        </button>
      </div>
      {user.role === 'ADMIN' ? <AdminDashboard user={user} /> : <UserDashboard user={user} />}
    </section>
  );
}

