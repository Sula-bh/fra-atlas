import { useState } from 'react';
import Map from '@/components/Map';
import LayerControl from '@/components/LayerControl';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/Navbar';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TreePine, Droplet, Wheat } from 'lucide-react';
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
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar role="admin" />

        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-4 px-6 shadow-lg">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-primary-foreground" />
                <div className="flex-1">
                  <Navbar 
                    title="Forest Rights Act Atlas" 
                    username="FRA User"
                    onLogout={() => toast.info("Logout clicked")}
                  />
                  <p className="text-sm text-primary-foreground/90 -mt-6">
                    Digital Repository for FRA Claims, Satellite Mapping & Decision Support
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Search Bar */}
          <section className="max-w-7xl mx-auto w-full px-6 py-4">
            <SearchBar onSearch={handleSearch} />
          </section>

          {/* Main Content - Map & Controls */}
          <section className="flex-1 max-w-7xl mx-auto w-full px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
              {/* Map Area */}
              <div className="lg:col-span-4 rounded-lg overflow-hidden shadow-xl">
                <Map layers={layers} searchQuery={searchState.query} filterType={searchState.filter} />
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <LayerControl layers={layers} onLayerToggle={handleLayerToggle} />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-muted py-4 px-6">
            <div className="max-w-7xl mx-auto text-center text-muted-foreground text-xs">
              <p>© 2024 Forest Rights Act Atlas | Ministry of Tribal Affairs, Government of India</p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
