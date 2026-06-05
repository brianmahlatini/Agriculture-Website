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
import { useAgricoreData } from './hooks/useAgricoreData';

function App() {
  const { overview, stories, metrics } = useAgricoreData();

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
        <PartnerSection />
      </main>
      <Footer />
    </>
  );
}

export default App;

