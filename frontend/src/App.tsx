// App composes page sections only; data loading and behavior live in hooks/components.
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ImpactSection } from './components/ImpactSection';
import { MediaBand } from './components/MediaBand';
import { MetricsStrip } from './components/MetricsStrip';
import { OperationsSection } from './components/OperationsSection';
import { PartnerSection } from './components/PartnerSection';
import { PlatformSection } from './components/PlatformSection';
import { AuthSection } from './components/AuthSection';
import { WorkspaceSection } from './components/WorkspaceSection';
import { useAgricoreData } from './hooks/useAgricoreData';
import { useAuth } from './hooks/useAuth';

function App() {
  const { overview, stories, metrics } = useAgricoreData();
  const { user, status, isAuthenticated, registerAccount, loginAccount, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <main id="top" className="authenticated-app">
        <WorkspaceSection user={user} onLogout={logout} />
      </main>
    );
  }

  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <MetricsStrip metrics={metrics} />
        <PlatformSection />
        <OperationsSection overview={overview} />
        <MediaBand />
        <ImpactSection stories={stories} />
        {status !== 'checking' && <AuthSection onRegister={registerAccount} onLogin={loginAccount} />}
        <PartnerSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
