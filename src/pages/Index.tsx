import { useState } from 'react';
import Map from '@/components/Map';
import LayerControl from '@/components/LayerControl';
import StatsOverview from '@/components/StatsOverview';
import SearchBar from '@/components/SearchBar';
import DataPanel from '@/components/DataPanel';
import { TreePine, Droplet, Wheat, Building2 } from 'lucide-react';
import { toast } from 'sonner';

type FilterType = 'all' | 'ifr' | 'cr' | 'cfr';

const Index = () => {
  const [layers, setLayers] = useState([
    { id: 'forest', label: 'Forest Rights', icon: <TreePine className="w-4 h-4 text-primary" />, enabled: true },
    { id: 'water', label: 'Watershed', icon: <Droplet className="w-4 h-4 text-accent" />, enabled: false },
    { id: 'agriculture', label: 'Land Use', icon: <Wheat className="w-4 h-4 text-secondary" />, enabled: false },
    { id: 'infrastructure', label: 'Forest Cover', icon: <TreePine className="w-4 h-4 text-primary" />, enabled: false },
  ]);

  const [searchState, setSearchState] = useState<{ query: string; filter: FilterType }>({ query: '', filter: 'all' });

  const handleLayerToggle = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };

  const handleSearch = (query: string, filter: string) => {
    const allowed: FilterType[] = ['all', 'ifr', 'cr', 'cfr'];
    const normalized = allowed.includes(filter as FilterType) ? (filter as FilterType) : 'all';
    setSearchState({ query: query.trim(), filter: normalized });
    toast.message('Search updated', { description: `${query || 'No text'} • ${normalized.toUpperCase()}` });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Forest Rights Act Atlas</h1>
          <p className="text-primary-foreground/90">
            Digital Repository for FRA Claims, Satellite Mapping & Decision Support
          </p>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <StatsOverview />
      </section>

      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Main Content - Map & Controls */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-3 h-[65vh] rounded-lg overflow-hidden shadow-xl">
            <Map layers={layers} searchQuery={searchState.query} filterType={searchState.filter} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 flex flex-col h-[65vh]">
            <LayerControl layers={layers} onLayerToggle={handleLayerToggle} />
            <div className="flex-1 overflow-hidden">
              <DataPanel />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Forest Rights Act Atlas | Ministry of Tribal Affairs, Government of India</p>
          <p className="mt-2">Powered by AI-based Asset Mapping & Satellite Imagery</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
