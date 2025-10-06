import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapIcon, Satellite, Layers as LayersIcon } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LayerToggle {
  id: string;
  enabled: boolean;
}

interface MapProps {
  layers?: LayerToggle[];
  searchQuery?: string;
  filterType?: 'all' | 'ifr' | 'cr' | 'cfr';
}

interface ClaimData {
  id: number;
  coords: number[][];
  village: string;
  type: 'IFR' | 'CFR' | 'CR';
  area: string;
  status: string;
  claimId: string;
  beneficiaries: number;
  dateGranted?: string;
}

const Map = ({ layers = [], searchQuery = '', filterType = 'all' }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [baseLayer, setBaseLayer] = useState<'street' | 'satellite' | 'topo'>('street');
  const layersRef = useRef<{
    street: L.TileLayer;
    satellite: L.TileLayer;
    topo: L.TileLayer;
    forestRights: L.LayerGroup;
    watershed: L.TileLayer;
    landUse: L.TileLayer;
  } | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null);

  // Sample forest rights data
  const forestRightsData: ClaimData[] = [
    {
      id: 1,
      coords: [[20.5, 78.5], [20.6, 78.5], [20.6, 78.6], [20.5, 78.6]],
      village: 'Bhilwara Village',
      type: 'IFR',
      area: '5.2 ha',
      status: 'Approved',
      claimId: 'FRA-2024-001',
      beneficiaries: 45,
      dateGranted: '2024-01-15',
    },
    {
      id: 2,
      coords: [[21.2, 79.1], [21.3, 79.1], [21.3, 79.2], [21.2, 79.2]],
      village: 'Khunti Village',
      type: 'CFR',
      area: '12.5 ha',
      status: 'Pending',
      claimId: 'FRA-2024-002',
      beneficiaries: 120,
    },
    {
      id: 3,
      coords: [[19.8, 81.5], [19.9, 81.5], [19.9, 81.6], [19.8, 81.6]],
      village: 'Dantewada Village',
      type: 'CR',
      area: '8.7 ha',
      status: 'Approved',
      claimId: 'FRA-2024-003',
      beneficiaries: 78,
      dateGranted: '2024-02-20',
    },
    {
      id: 4,
      coords: [[22.1, 82.0], [22.2, 82.0], [22.2, 82.1], [22.1, 82.1]],
      village: 'Bastar Village',
      type: 'IFR',
      area: '4.1 ha',
      status: 'Under Review',
      claimId: 'FRA-2024-004',
      beneficiaries: 32,
    },
  ];

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 6,
      zoomControl: false,
    });

    // Add zoom control to top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Base layers
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
      maxZoom: 19,
    });

    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap contributors',
      maxZoom: 17,
    });

    // Watershed overlay (example WMS)
    const watershedLayer = L.tileLayer.wms('https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms', {
      layers: 'watershed',
      format: 'image/png',
      transparent: true,
      opacity: 0.6,
    });

    // Land use overlay (example WMS)
    const landUseLayer = L.tileLayer.wms('https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms', {
      layers: 'landuse',
      format: 'image/png',
      transparent: true,
      opacity: 0.6,
    });

    // Forest rights layer group
    const forestRightsLayer = L.layerGroup();

    // Add polygons for forest rights
    forestRightsData.forEach((data) => {
      const polygon = L.polygon(data.coords as [number, number][], {
        color: data.status === 'Approved' ? '#16a34a' : data.status === 'Pending' ? '#f59e0b' : '#6b7280',
        fillColor: data.status === 'Approved' ? '#22c55e' : data.status === 'Pending' ? '#fbbf24' : '#9ca3af',
        fillOpacity: 0.4,
        weight: 2,
      });

      polygon.bindPopup(`
        <div style="font-family: system-ui; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">${data.village}</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Claim ID:</strong> ${data.claimId}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Type:</strong> ${data.type}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Area:</strong> ${data.area}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: ${data.status === 'Approved' ? '#16a34a' : data.status === 'Pending' ? '#f59e0b' : '#6b7280'}">${data.status}</span></p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Beneficiaries:</strong> ${data.beneficiaries}</p>
          ${data.dateGranted ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Date Granted:</strong> ${data.dateGranted}</p>` : ''}
        </div>
      `);

      forestRightsLayer.addLayer(polygon);
    });

    // Add default base layer
    streetLayer.addTo(map);
    forestRightsLayer.addTo(map);

    layersRef.current = {
      street: streetLayer,
      satellite: satelliteLayer,
      topo: topoLayer,
      forestRights: forestRightsLayer,
      watershed: watershedLayer,
      landUse: landUseLayer,
    };

    mapRef.current = map;
    toast.success('Map loaded successfully');

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle base layer toggle
  const toggleBaseLayer = () => {
    if (!mapRef.current || !layersRef.current) return;

    const newLayer = baseLayer === 'street' ? 'satellite' : baseLayer === 'satellite' ? 'topo' : 'street';

    mapRef.current.removeLayer(layersRef.current[baseLayer]);
    mapRef.current.addLayer(layersRef.current[newLayer]);

    setBaseLayer(newLayer);
  };

  // Handle layer visibility
  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return;

    layers.forEach((layer) => {
      if (layer.id === 'forest' && layersRef.current?.forestRights) {
        if (layer.enabled) {
          mapRef.current?.addLayer(layersRef.current.forestRights);
        } else {
          mapRef.current?.removeLayer(layersRef.current.forestRights);
        }
      }
      if (layer.id === 'water' && layersRef.current?.watershed) {
        if (layer.enabled) {
          mapRef.current?.addLayer(layersRef.current.watershed);
        } else {
          mapRef.current?.removeLayer(layersRef.current.watershed);
        }
      }
      if (layer.id === 'agriculture' && layersRef.current?.landUse) {
        if (layer.enabled) {
          mapRef.current?.addLayer(layersRef.current.landUse);
        } else {
          mapRef.current?.removeLayer(layersRef.current.landUse);
        }
      }
    });
  }, [layers]);

  // Handle filter type
  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return;

    // Clear and rebuild forest rights layer with filter
    layersRef.current.forestRights.clearLayers();

    forestRightsData
      .filter((data) => filterType === 'all' || data.type.toLowerCase() === filterType)
      .forEach((data) => {
        const polygon = L.polygon(data.coords as [number, number][], {
          color: data.status === 'Approved' ? '#16a34a' : data.status === 'Pending' ? '#f59e0b' : '#6b7280',
          fillColor: data.status === 'Approved' ? '#22c55e' : data.status === 'Pending' ? '#fbbf24' : '#9ca3af',
          fillOpacity: 0.4,
          weight: 2,
        });

        polygon.bindPopup(`
          <div style="font-family: system-ui; min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">${data.village}</h3>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Claim ID:</strong> ${data.claimId}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Type:</strong> ${data.type}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Area:</strong> ${data.area}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: ${data.status === 'Approved' ? '#16a34a' : data.status === 'Pending' ? '#f59e0b' : '#6b7280'}">${data.status}</span></p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Beneficiaries:</strong> ${data.beneficiaries}</p>
            ${data.dateGranted ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Date Granted:</strong> ${data.dateGranted}</p>` : ''}
          </div>
        `);

        layersRef.current?.forestRights.addLayer(polygon);
      });
  }, [filterType]);

  // Handle search
  useEffect(() => {
    if (!mapRef.current || !searchQuery) return;

    const query = searchQuery.toLowerCase().trim();
    const match = forestRightsData.find((data) =>
      data.village.toLowerCase().includes(query) || data.claimId.toLowerCase().includes(query)
    );

    if (match) {
      const lats = match.coords.map((c) => c[0]);
      const lngs = match.coords.map((c) => c[1]);
      const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

      mapRef.current.flyTo([centerLat, centerLng], 12, { duration: 1.5 });
      toast.success(`Found: ${match.village}`);
    } else {
      toast.info('No matching location found');
    }
  }, [searchQuery]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Base layer toggle */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button onClick={toggleBaseLayer} variant="secondary" size="sm" className="shadow-lg">
          {baseLayer === 'street' ? (
            <>
              <MapIcon className="w-4 h-4 mr-2" />
              Street Map
            </>
          ) : baseLayer === 'satellite' ? (
            <>
              <Satellite className="w-4 h-4 mr-2" />
              Satellite
            </>
          ) : (
            <>
              <LayersIcon className="w-4 h-4 mr-2" />
              Topographic
            </>
          )}
        </Button>
      </div>

    </div>
  );
};

export default Map;
