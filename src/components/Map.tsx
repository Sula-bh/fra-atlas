import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import 'ol/ol.css';
import { Button } from '@/components/ui/button';
import { MapIcon, Satellite } from 'lucide-react';

interface LayerToggle {
  id: string;
  enabled: boolean;
}

interface MapProps {
  onMapLoad?: (map: OlMap) => void;
  layers?: LayerToggle[];
  searchQuery?: string;
  filterType?: 'all' | 'ifr' | 'cr' | 'cfr';
}

const Map = ({ onMapLoad, layers = [], searchQuery = '', filterType = 'all' }: MapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<OlMap | null>(null);
  const [baseLayer, setBaseLayer] = useState<'osm' | 'satellite'>('osm');
  const filterRef = useRef<'all' | 'ifr' | 'cr' | 'cfr'>(filterType);

  const layersRef = useRef<{
    osm: TileLayer<OSM>;
    satellite: TileLayer<XYZ>;
    forestCover: TileLayer<TileWMS>;
    watershed: TileLayer<TileWMS>;
    landUse: TileLayer<TileWMS>;
    forestRights: VectorLayer<VectorSource>;
  } | null>(null);

  // Sample forest rights polygons (lon, lat)
  const forestRightsData = [
    {
      id: 1,
      coords: [
        [78.5, 20.5],
        [78.5, 20.6],
        [78.6, 20.6],
        [78.6, 20.5],
        [78.5, 20.5],
      ],
      village: 'Bhilwara Village',
      type: 'IFR',
      area: '5.2 ha',
      status: 'Approved',
    },
    {
      id: 2,
      coords: [
        [79.1, 21.2],
        [79.1, 21.3],
        [79.2, 21.3],
        [79.2, 21.2],
        [79.1, 21.2],
      ],
      village: 'Khunti Village',
      type: 'CFR',
      area: '12.5 ha',
      status: 'Pending',
    },
    {
      id: 3,
      coords: [
        [81.5, 19.8],
        [81.5, 19.9],
        [81.6, 19.9],
        [81.6, 19.8],
        [81.5, 19.8],
      ],
      village: 'Dantewada Village',
      type: 'CR',
      area: '8.7 ha',
      status: 'Approved',
    },
  ];

  // Helpers
  const statusStyle = (status: string) =>
    new Style({
      fill: new Fill({ color: status === 'Approved' ? 'rgba(34,197,94,0.4)' : 'rgba(251,191,36,0.4)' }),
      stroke: new Stroke({ color: status === 'Approved' ? '#16a34a' : '#f59e0b', width: 2 }),
    });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      // Base layers
      const osmLayer = new TileLayer({ source: new OSM(), visible: true });
      const satelliteLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles © Esri',
        }),
        visible: false,
      });

      // Bhuvan WMS overlays (example layer names; adjust if needed)
      const forestCoverLayer = new TileLayer({
        source: new TileWMS({
          url: 'https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms',
          params: { LAYERS: 'india3', TILED: true },
          serverType: 'geoserver',
        }),
        visible: false,
        opacity: 0.7,
      });

      const watershedLayer = new TileLayer({
        source: new TileWMS({
          url: 'https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms',
          params: { LAYERS: 'watershed', TILED: true },
          serverType: 'geoserver',
        }),
        visible: false,
        opacity: 0.6,
      });

      const landUseLayer = new TileLayer({
        source: new TileWMS({
          url: 'https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms',
          params: { LAYERS: 'landuse', TILED: true },
          serverType: 'geoserver',
        }),
        visible: false,
        opacity: 0.6,
      });

      // Forest rights vector layer
      const features = forestRightsData.map((data) => {
        const coords = data.coords.map((c) => fromLonLat(c as [number, number]));
        const polygon = new Polygon([coords]);
        const feature = new Feature({ geometry: polygon });
        feature.setProperties({ village: data.village, type: data.type, area: data.area, status: data.status });
        return feature;
      });

      const vectorSource = new VectorSource({ features });
      const forestRightsLayer = new VectorLayer({
        source: vectorSource,
        visible: true,
        style: (feature) => {
          const t = (feature.get('type') as string) || '';
          const s = (feature.get('status') as string) || '';
          const filterMap: Record<string, string> = { ifr: 'IFR', cr: 'CR', cfr: 'CFR' };
          if (filterRef.current !== 'all' && t !== filterMap[filterRef.current]) return null;
          return statusStyle(s);
        },
      });

      // Store layers
      layersRef.current = {
        osm: osmLayer,
        satellite: satelliteLayer,
        forestCover: forestCoverLayer,
        watershed: watershedLayer,
        landUse: landUseLayer,
        forestRights: forestRightsLayer,
      };

      // Initialize map
      const map = new OlMap({
        target: containerRef.current,
        layers: [osmLayer, satelliteLayer, forestCoverLayer, watershedLayer, landUseLayer, forestRightsLayer],
        view: new View({ center: fromLonLat([78.9629, 20.5937]), zoom: 5 }),
      });

      mapRef.current = map;
      onMapLoad?.(map);
      toast.success('Map loaded successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Failed to load map');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  // Sync overlay visibility with LayerControl
  useEffect(() => {
    if (!layersRef.current || !layers) return;
    layers.forEach((layer) => {
      if (layer.id === 'forest' && layersRef.current?.forestRights) {
        layersRef.current.forestRights.setVisible(layer.enabled);
      }
      if (layer.id === 'water' && layersRef.current?.watershed) {
        layersRef.current.watershed.setVisible(layer.enabled);
      }
      if (layer.id === 'agriculture' && layersRef.current?.landUse) {
        layersRef.current.landUse.setVisible(layer.enabled);
      }
      if (layer.id === 'infrastructure' && layersRef.current?.forestCover) {
        layersRef.current.forestCover.setVisible(layer.enabled);
      }
    });
  }, [layers]);

  // Apply type filter
  useEffect(() => {
    filterRef.current = filterType;
    if (layersRef.current?.forestRights) {
      layersRef.current.forestRights.changed();
    }
  }, [filterType]);

  // Search and fly to village centroid
  useEffect(() => {
    if (!mapRef.current) return;
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return;

    const match = forestRightsData.find((r) => r.village.toLowerCase().includes(q));
    if (match) {
      const lons = match.coords.map((c) => c[0]);
      const lats = match.coords.map((c) => c[1]);
      const centerLon = lons.reduce((a, b) => a + b, 0) / lons.length;
      const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      mapRef.current.getView().animate({ center: fromLonLat([centerLon, centerLat]), zoom: 10, duration: 800 });
      toast.success(`Centered on ${match.village}`);
    } else {
      toast.info('No matching village found in sample data');
    }
  }, [searchQuery]);

  // Toggle base layer
  const toggleBaseLayer = () => {
    if (!layersRef.current) return;
    const newBaseLayer = baseLayer === 'osm' ? 'satellite' : 'osm';
    layersRef.current.osm.setVisible(newBaseLayer === 'osm');
    layersRef.current.satellite.setVisible(newBaseLayer === 'satellite');
    setBaseLayer(newBaseLayer);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 z-10">
        <Button onClick={toggleBaseLayer} variant="secondary" size="sm" className="shadow-lg">
          {baseLayer === 'osm' ? (
            <>
              <Satellite className="w-4 h-4 mr-2" />
              Satellite
            </>
          ) : (
            <>
              <MapIcon className="w-4 h-4 mr-2" />
              Street Map
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Map;
